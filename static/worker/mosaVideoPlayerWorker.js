let contextWorkerPort = {}

let last_video_element_time = 0
let last_performance_now_time = 0
let timers_delta = 0

let parameters = {
  funscripts: {},
  running: false,
  playback_rate: 1,
  moving_pauses: false,
  latency: 0,
}

const time_window = 150
let position = { "L0": 500 }
let script_offsets = {}
let moving_pause_start = 0

onmessage = async (e) => {
  // console.log("Got message! " + e.data)
  if(e.data[0] === "videoElementTimeMs") {
    // video element currentTime isn't 100% accurate (based on current frame?)
    // in testing, for 100ms intervals, it is often off by +-10ms.
    // keep an own video timer and skew that if necessary.
    let video_element_time = Math.floor(e.data[1])
    let performance_now_time = Math.floor(performance.now())
    let timers_delta_current = performance_now_time - video_element_time
    let delta_delta = timers_delta_current - timers_delta
    if(Math.abs(delta_delta) > 50) {
      // timers are out of sync, just reset, probably user skipped/paused video
      timers_delta = performance_now_time - video_element_time
      console.log("Video timer out of sync, resetting")
    } else if(Math.abs(delta_delta) > 12) {
      // some difference, skew delta a bit to correct
      timers_delta = timers_delta + (delta_delta > 0 ? +1 : -1)
      //console.log("Skewing")
    }
    last_video_element_time = video_element_time
    let current_msecs = performance_now_time - timers_delta
    console.log(`smoothed time: ${current_msecs}, timers_delta: ${timers_delta}`)
  } else if(e.data[0] === "updateParameters") {
    console.log(`updated parameters: ${JSON.stringify(e.data[1])}`)
    if(e.data[1]["funscripts"]) {
      script_offsets = {}
      for(let axis in e.data[1]["funscripts"]) script_offsets[axis] = 0
      position = { "L0": 500 }
    }
    parameters = { ...parameters, ...e.data[1] }
  } else if(e.data[0] === "setContextPort") {
    contextWorkerPort = e.data[1]
  }
}

function clampedFloat(x, min, max) {
  if(x < min) return min
  if(x > max) return max
  return x
}

function doLoop() {
  let performance_now_time = Math.floor(performance.now())
  let current_msecs = performance_now_time - timers_delta
  last_performance_now_time = performance_now_time

  // plan movement towards next_msecs (current_msecs plus time_window)
  // if any funscript action happens before next_msecs, schedule next call for that time
  // otherwise interpolate position and schedule next call after time_window
  let next_call_delta_time = time_window
  const funscripts = parameters.funscripts
  if (parameters.running) {
    next_call_delta_time = next_call_delta_time * parameters.playback_rate
    current_msecs = current_msecs - parameters.latency * parameters.playback_rate + time_window * parameters.playback_rate
    let next_msecs = current_msecs + time_window * parameters.playback_rate
    position = { "L0": position["L0"] }
    let delta_times = {}
    for(let axis in funscripts) {
      try {
        if(funscripts[axis] === undefined) continue
        if(funscripts[axis]["actions"] === undefined) continue
        let inverted = !!funscripts[axis]["inverted"]

        let actions = funscripts[axis]["actions"]
        let prev_offset = script_offsets[axis]
        if(prev_offset === undefined) prev_offset = 0
        if(actions[prev_offset]["at"] > current_msecs && prev_offset > 0) {
          // current_msecs jumped back, video probably got rewound.
          console.log(`${axis}: Retracing current funscript event (did the video skip?)`)
          prev_offset = 0;
        }
        // look for the first offset that's after current_msecs
        let next_offset = prev_offset + 1;
        while(next_offset < actions.length && actions[next_offset]["at"] < current_msecs) next_offset++;
        if(next_offset < 1) continue; // empty script
        prev_offset = next_offset - 1;
        if(next_offset >= actions.length) {
          // current time is after the end of the funscript
          next_offset = prev_offset;
          continue
        }
        if(actions[prev_offset]["at"] > current_msecs) {
          // current time is before the start of the funscript
          next_offset = prev_offset;
        }

        let prev_action = actions[prev_offset];
        let next_action = actions[next_offset];
        let prev_val = Math.floor(clampedFloat(prev_action["pos"], 0, 100) * 10)
        let next_val = Math.floor(clampedFloat(next_action["pos"], 0, 100) * 10)
        if(inverted) {
          prev_val = 1000 - prev_val;
          next_val = 1000 - next_val;
        }
        let mid_val = 0
        let delta_time = next_action["at"] - current_msecs
        if(delta_time >= time_window + 50) {
          // next_action is more than time_window in the future: just interpolate
          let where_in_interval = prev_offset !== next_offset ?
                                  (next_msecs - prev_action["at"]) / (next_action["at"] - prev_action["at"]) :
                                  0.5
          mid_val = (1.0 - where_in_interval) * prev_val + where_in_interval * next_val;
          delta_times[axis] = time_window * parameters.playback_rate / 1000
          next_call_delta_time = Math.min(next_call_delta_time, delta_time - 50)
        } else {
          // next_action is coming up: use value directly and shorten next_call_delta_time
          // this makes sure we catch all extremas and don't interpolate them away
          delta_times[axis] = delta_time * parameters.playback_rate / 1000
          mid_val = next_val
          if(delta_time < time_window) {
            next_call_delta_time = Math.min(next_call_delta_time, delta_time + 2)
          } else if(delta_time > 50) {
            next_call_delta_time = Math.min(next_call_delta_time, delta_time - 50)
          }
        }

        // if enabled, fill L0 pauses with slow motion
        const pause_threshold = 2000
        if(axis === "L0" && parameters.moving_pauses) {
          if(mid_val > 850) {
            if(moving_pause_start <= 0) {
              // we are not in pause mode yet, keep watching
              moving_pause_start = current_msecs
            } else {
              if(current_msecs - moving_pause_start > pause_threshold) {
                // we are in a pause, create holding pattern
                mid_val = Math.abs(1000 - (((current_msecs - moving_pause_start - pause_threshold) / 4) % 2000)) * 0.8
                delta_times[axis] = time_window / 1000
              }
            }
          } else {
            // seems to be some action here, recover
            if(moving_pause_start < 0) {
              // we are recovering from a pause, advance to mid_val (finish in 600ms)
              let recover_degree = clampedFloat((current_msecs - Math.abs(moving_pause_start)) / 600, 0, 1)
              console.log(`recovering ${recover_degree}`)
              mid_val = recover_degree * mid_val + (1 - recover_degree) * position["L0"]
              if(recover_degree > 0.95) moving_pause_start = 0
            } else if(moving_pause_start > 0) {
              // we might be in a pause
              if(current_msecs - moving_pause_start > pause_threshold) {
                // we were in a pause, set to recover
                moving_pause_start = -current_msecs
                mid_val = position["L0"]
              } else {
                // not paused yet, just reset timer
                moving_pause_start = 0
              }
            }
          }
        }

        // if(axis === "L0") console.log(`${prev_offset} ${where_in_interval} ${mid_val} ${prev_val} ${next_val}`);
        position[axis] = Math.floor(mid_val)
        script_offsets[axis] = prev_offset
      } catch(e) {
        console.log(e);
      }
    }
    //console.log(JSON.stringify({"pos": position, "delta": delta_times}))
    for(let axis in position) {
      if(delta_times[axis] === undefined) delta_times[axis] = time_window
    }
    contextWorkerPort.postMessage(["commandRobot", position, delta_times])
    let time_elapsed = performance.now() - performance_now_time
    //console.log(`performance_now_time ${performance_now_time}, current_msecs ${Math.floor(current_msecs)}, time_elapsed ${time_elapsed}, delta ${Math.floor(next_call_delta_time)}, L0offset ${script_offsets["L0"]}`)
    next_call_delta_time = Math.max(1, next_call_delta_time - time_elapsed)  // correct next call delta for runtime
  }
  if(next_call_delta_time == 1) console.log("Performance issues.")
  setTimeout(doLoop, next_call_delta_time)
}

setTimeout(doLoop, 10)
