import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  FormControlLabel,
  MenuItem,
  Select,
  Slider,
  Switch,
  Typography,
} from '@material-ui/core'

import { useTimeout } from '../../hooks/useTimeoutHook'
import { clampedFloat, clampedNum } from '../../utils/clamp'

const Canvas = props => {
  const { funscripts, axis, totalTime, vpos, ...rest } = props
  const canvasRef = useRef(null)
  const vis_width = 800
  const canvas_width = 20000 + vis_width

  const draw = ctx => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    ctx.moveTo(vis_width / 2,50)
    for(let entry of funscripts[axis]["actions"]) {
      let x = entry["at"] / totalTime * (canvas_width - vis_width) + vis_width / 2
      let y = 100 - entry["pos"]
      ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    draw(context)
  }, [funscripts, axis, totalTime])

  useEffect(() => {
    let scroll_left = Math.max(Math.floor(vpos / totalTime * (canvas_width - vis_width)), 0)
    document.getElementById("fiudfzdifu").scrollLeft = scroll_left
  }, [vpos, totalTime])

  let stle = {maxHeight: '120px', maxWidth: vis_width + 'px', overflow: 'hidden'}
  return <div id="fiudfzdifu" style={stle}>
          <canvas width={canvas_width+"px"} height="100px" ref={canvasRef} {...rest}/>
         </div>
}

let last_video_element_time = 0
let last_performance_now_time = 0
let timers_delta = 0

export const MosaVideoPlayer = props => {
  const { connected, target, commandRobot } = props

  const [current_file, setCurrentFile] = useState("none")
  const [video_files, setVideoFiles] = useState([])
  const [local_video_files, setLocalVideoFiles] = useState({})

  const [running, setRunning] = useState(false)
  const [moving_pauses, setMovingPauses] = useState(true)
  const [moving_pause_start, setMovingPauseStart] = useState(0)

  const [video_length, setVideoLength] = useState(0)
  const [video_position, setVideoPosition] = useState(0)
  const [video_speed, setVideoSpeed] = useState("100")
  const [latency, setLatency] = useState(0)

  const position = useRef({})
  const [funscripts, setFunscripts] = useState({})
  const script_offsets = useRef({})

  const [editing_axis, setEditingAxis] = useState("none")

  const axes = [["R2", ".pitch.funscript"],
                ["R1", ".roll.funscript"],
                ["R0", ".twist.funscript"],
                ["L1", ".forward.funscript"],
                ["A1", ".suck.funscript"],
                ["L0", ".funscript"]];

  const time_window = 60

  function doLoop() {
    // video element currentTime isn't 100% accurate (based on current frame?)
    // in testing, for 100ms intervals, it is often off by +-10ms.
    // keep an own video timer and skew that if necessary.
    let performance_now_time = Math.floor(performance.now())
    let player = document.getElementById("idvideo")
    let video_element_time = Math.floor(player.currentTime * 1000)
    let timers_delta_current = performance_now_time - video_element_time
    let delta_delta = timers_delta_current - timers_delta
    if(Math.abs(delta_delta) > 50) {
      // timers are out of sync, just reset, probably user skipped/paused video
      timers_delta = performance_now_time - video_element_time
      if(!player.paused) console.log("Video timer out of sync, resetting")
    } else if(Math.abs(delta_delta) > 12) {
      // some difference, skew delta a bit to correct
      timers_delta = timers_delta + (delta_delta > 0 ? +1 : -1)
      //console.log("Skewing")
    }
    let current_msecs = performance_now_time - timers_delta
    //console.log(`smoothed time: ${current_msecs}, timers_delta: ${timers_delta}`)
    last_video_element_time = video_element_time
    last_performance_now_time = performance_now_time

    // plan movement towards next_msecs (current_msecs plus time_window)
    // if any funscript action happens before next_msecs, schedule next call for that time
    // otherwise interpolate position and schedule next call after time_window
    let next_call_delta_time = time_window
    if (running) {
      if(player.paused) return next_call_delta_time;
      let playback_rate = 1 / (parseFloat(video_speed) / 100)
      next_call_delta_time = next_call_delta_time * playback_rate
      current_msecs = current_msecs - latency * playback_rate + time_window * playback_rate;
      let next_msecs = current_msecs + time_window * playback_rate;
      let delta_times = {}
      for(let tmp_p in position.current) delta_times[tmp_p] = time_window
      for(let axis of axes.map((entry) => entry[0])) {
        try {
          if(funscripts[axis] === undefined) continue;
          if(funscripts[axis]["actions"] === undefined) continue;
          let inverted = !!funscripts[axis]["inverted"];

          let actions = funscripts[axis]["actions"];
          let prev_offset = script_offsets.current[axis];
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
          }
          if(actions[prev_offset]["at"] > current_msecs) {
            // current time is before the start of the funscript
            next_offset = prev_offset;
          }

          let prev_action = actions[prev_offset];
          let next_action = actions[next_offset];
          let prev_val = clampedNum(prev_action["pos"], 0, 100) * 10.0;
          let next_val = clampedNum(next_action["pos"], 0, 100) * 10.0;
          if(inverted) {
            prev_val = 1000 - prev_val;
            next_val = 1000 - next_val;
          }
          let mid_val = 0
          if(next_action["at"] >= next_msecs) {
            // next_action is more than time_window in the future: just interpolate
            let where_in_interval = prev_offset !== next_offset ?
                                    (next_msecs - prev_action["at"])*1.0 / (next_action["at"] - prev_action["at"])*1.0 :
                                    0.5
            mid_val = (1.0 - where_in_interval) * prev_val + where_in_interval * next_val;
            delta_times[axis] = time_window * playback_rate / 1000
          } else {
            // next_action is coming up: use value directly and shorten next_call_delta_time
            // this makes sure we catch all extremas and don't interpolate them away
            let delta_time = next_action["at"] - current_msecs + 1
            delta_times[axis] = delta_time * playback_rate / 1000
            mid_val = next_val
            next_call_delta_time = Math.min(next_call_delta_time, delta_time)
          }

          // if enabled, fill L0 pauses with slow motion
          const pause_threshold = 2000
          if(axis === "L0" && moving_pauses) {
            if(mid_val > 850) {
              if(moving_pause_start <= 0) {
                // we are not in pause mode yet, keep watching
                setMovingPauseStart(current_msecs)
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
                mid_val = recover_degree * mid_val + (1 - recover_degree) * position.current["L0"]
                if(recover_degree > 0.95) setMovingPauseStart(0)
              } else if(moving_pause_start > 0) {
                // we might be in a pause
                if(current_msecs - moving_pause_start > pause_threshold) {
                  // we were in a pause, set to recover
                  setMovingPauseStart(-current_msecs)
                  mid_val = position.current["L0"]
                } else {
                  // not paused yet, just reset timer
                  setMovingPauseStart(0)
                }
              }
            }
          }

          // if(axis === "L0") console.log(`${prev_offset} ${where_in_interval} ${mid_val} ${prev_val} ${next_val}`);
          position.current[axis] = mid_val;
          script_offsets.current[axis] = prev_offset
        } catch(e) {
          console.log(e);
        }
      }
      if(connected) {
        commandRobot(position.current, delta_times);
      }
      let time_elapsed = performance.now() - performance_now_time  // correct next call delta for runtime - this is easily 20-50ms occasionally with serial on
      next_call_delta_time = Math.max(1, next_call_delta_time - time_elapsed)
      //console.log(`performance_now_time ${performance_now_time}, current_msecs ${Math.floor(current_msecs)}, time_elapsed ${time_elapsed}, delta ${Math.floor(next_call_delta_time)}, L0offset ${script_offsets.current["L0"]}`)
    }
    return next_call_delta_time
  }

  async function setFile(file) {
    function initVideo(filename, funscripts) {
      setEditingAxis("none")
      setCurrentFile(filename)
      setFunscripts(funscripts)
      script_offsets.current = {}
      for(let axis in funscripts) script_offsets.current[axis] = 0
      position.current = {}
      for(let axis in funscripts) if(funscripts[axis] !== undefined) position.current[axis] = 500
      let video = document.getElementById("idvideo")
      video.play();
      video.ondurationchange = (e) => setVideoLength(e.srcElement.duration * 1000)
      video.ontimeupdate = (e) => setVideoPosition(e.srcElement.currentTime * 1000)
    }

    if(file in local_video_files) {
      let fileItem = local_video_files[file]
      document.getElementById("idvideo").src = URL.createObjectURL(await fileItem["entry"].getFile());
      let funscripts = {}
      for(let axis of axes) {
        if(axis[0] in fileItem) {
          let fh = await fileItem[axis[0]].getFile()
          let txt = await fh.text()
          funscripts[axis[0]] = JSON.parse(txt)
        }
      }
      initVideo(file, funscripts)
      return
    }

    let funscripts = {};
    document.getElementById("idvideo").src = `video/${file}`;
    let file_base = "video/" + file.replaceAll(".mp4", "");
    let fetches = [];
    for(let axis of axes) {
      fetches.push(
        fetch(file_base + axis[1], { headers : { 'Content-Type': 'application/json', 'Accept': 'application/json' } } ).then(
          (res) => res.json().then(
            (json) => funscripts[axis[0]] = json
          ).catch(
            (err) => { console.log(err); funscripts[axis[0]] = undefined; }
          )
        ).catch(
            (err) => { console.warn(err); funscripts[axis[0]] = undefined; }
          )
      )
    }
    Promise.allSettled(fetches).then(
        () => { initVideo(file, funscripts) }
    );
  }

  async function openLocalFolder() {
    if(!window.hasOwnProperty("showDirectoryPicker")) {
      window.alert("Your browser does not support the File Syste API")
      return
    }
    const dirHandle = await window.showDirectoryPicker()
    let videoFiles = {}
    for await (const entry of dirHandle.values()) {
      if(entry.kind === 'file') {
        if(entry.name.endsWith(".mp4")) {
          if(entry.name in videoFiles) {
            videoFiles[entry.name]["entry"] = entry
          } else {
            videoFiles[entry.name] = {"name": entry.name, "entry": entry}
          }
          continue
        }
        if(entry.name.endsWith(".funscript")) {
          for(let axis of axes) {
            if(entry.name.endsWith(axis[1])) {
              let name = entry.name.replaceAll(axis[1], ".mp4")
              if(name in videoFiles) {
                videoFiles[name][axis[0]] = entry
              } else {
                videoFiles[name] = {"name": name, [axis[0]]: entry}
              }
              break
            }
          }
        }
      }
    }
    let videos = []
    for(let e of Object.keys(videoFiles)) {
      videos.push(e)
    }
    videos.sort()
    setVideoFiles(videos)
    setLocalVideoFiles(videoFiles)
  }

  const setEditAxis = axis => {
    let tmp = {...funscripts}
    if(tmp[axis] === undefined) {
      tmp[axis] = {"actions": [{"at": 0, "pos": 50}]}
      setFunscripts(tmp)
      console.log(`created funscript file ${axis}`)
      script_offsets.current[axis] = 0
    }
    setEditingAxis(axis)
  }

  const selectVideoSpeed = speed => {
    let player = document.getElementById("idvideo");
    player.playbackRate = parseFloat(speed) / 100;
    setVideoSpeed(speed)
  }

  const keydownListener = keydownEvent => {
    const { key, target, repeat } = keydownEvent;
    if (repeat) return;
    if(key >= '1' && key <= '9') {
      let pos = (key - '1') / 8 * 100
      let tmp = {...funscripts}
      let player = document.getElementById("idvideo")
      let current_msecs = player.currentTime * 1000.0 - latency
      tmp[editing_axis]["actions"].push({"at": Math.floor(current_msecs), "pos": Math.floor(pos)})
      tmp[editing_axis]["actions"].sort((a, b) => a["at"] - b["at"])
      setFunscripts(tmp)
      console.log(`Axis ${editing_axis} has ${tmp[editing_axis]["actions"].length} actions`)
    }
    if(key === '0') {
      let tmp = {...funscripts}
      let player = document.getElementById("idvideo")
      let current_msecs = player.currentTime * 1000 - latency
      tmp[editing_axis]["actions"] = tmp[editing_axis]["actions"].filter( (e) => e["at"] < current_msecs - 1500 || e["at"] > current_msecs + 1500)
      setFunscripts(tmp)
      player.currentTime = (current_msecs - 3000 + latency) / 1000
    }
    const speed_key_dict = { 'q': 10, 'w': 25, 'e': 50, 'r': 100, 't': 200 }
    if(key in speed_key_dict) {
      selectVideoSpeed(speed_key_dict[key])
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", keydownListener, true)
    return () => window.removeEventListener("keydown", keydownListener, true)
  })

  const toggleRunning = running => {
    setRunning(!running)
  }

  const downloadEditingScript = () => {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(funscripts[editing_axis])));
    let extension = ".json"
    for(let axis of axes) {
      if(axis[0] === editing_axis) extension = axis[1]
    }
    element.setAttribute('download', current_file.replaceAll(".mp4", extension));
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  useEffect(() => {
    if(video_files.length > 0) return;
    fetch("video/videos.txt", {})
    .then(res => res.text())
    .then(
          (result) => { setVideoFiles(result.split("\n")) },
          (error) => { alert("Could not load list of video files"); }
    )
  })

  useTimeout(doLoop, 100)
  let stle = {position: 'absolute', marginLeft: '399px', width: '2px', height: '100px', backgroundColor: 'grey'}
  const result = useMemo(() => (
    <Card>
      <CardContent>
        <Typography variant="h5">Video</Typography>
        <hr />
        <video id="idvideo" width="100%" controls>
        </video>
        {editing_axis !== "none" ? <div style={stle}/> : ""}
        {editing_axis !== "none" ? <Canvas vpos={video_position} funscripts={funscripts} axis={editing_axis} totalTime={video_length}></Canvas> : ""}
      </CardContent>
      <Typography>File</Typography>
      <Button
        onClick={() => openLocalFolder()}
        variant="contained"
        color="default"
      >
        Open Client Video Folder
      </Button>
      <Select
        id="idselect"
        value={current_file}
        onChange={(e, value) => setFile(value.props.value)}>
        <MenuItem value="none" key="none">no video</MenuItem>
        {video_files.map((f) => (
          <MenuItem value={f} key={f} >{f}</MenuItem>
        ))}
      </Select>

      <Select
        value={video_speed}
        onChange={(e, value) => selectVideoSpeed(value.props.value)}>
        <MenuItem value="10" key="10">10%</MenuItem>
        <MenuItem value="25" key="25">25%</MenuItem>
        <MenuItem value="50" key="50">50%</MenuItem>
        <MenuItem value="100" key="100">100%</MenuItem>
        <MenuItem value="200" key="200">200%</MenuItem>
      </Select>
      <Select
        value={editing_axis}
        onChange={(e, value) => setEditAxis(value.props.value)}>
        <MenuItem value="none" key="none">none</MenuItem>
        <MenuItem value="L0" key="main">Main/L0</MenuItem>
        <MenuItem value="R2" key="pitch">Pitch/R2</MenuItem>
        <MenuItem value="R1" key="roll">Roll/R1</MenuItem>
        <MenuItem value="R0" key="twist">Twist/R0</MenuItem>
        <MenuItem value="L1" key="forward">Forward/L1</MenuItem>
        <MenuItem value="L2" key="left">Left/L2</MenuItem>
        <MenuItem value="V0" key="vibe1">Vibe1/V0</MenuItem>
        <MenuItem value="A0" key="valve">Valve/A0</MenuItem>
        <MenuItem value="A1" key="suck">Suck/A1</MenuItem>
      </Select>
      <Button
        onClick={() => downloadEditingScript()}
        variant="contained"
        color="default"
        disabled={editing_axis === "none"}
      >
        Download script
      </Button>

      <Typography>Latency</Typography>
      <Slider
        value={latency}
        min={-2000}
        max={2000}
        step={10}
        track={false}
        valueLabelDisplay={'auto'}
        onChange={(e, value) => setLatency(value)}
        marks={[{ value: -1000, label: 'Video 1s early' },{ value: 1000, label: 'Video 1s late' }]}
      />
      <FormControlLabel key="moving_pauses" label="Moving pauses"
          control={
              <Switch
                  checked={moving_pauses}
                  onChange={(e) => setMovingPauses(!moving_pauses)}
                  name="Moving pauses"
                  value="moving_pauses"
                  color={'primary'}
              />
          }
      />
      <CardActions>
        <Button
          onClick={() => toggleRunning(running)}
          variant="contained"
          color="default"
        >
          {running ? 'STOP' : 'START'}
        </Button>
      </CardActions>
    </Card>
    ), [connected, current_file, video_files, running, moving_pauses,
        video_length, video_position, video_speed, latency, funscripts, editing_axis]
  );
  return result;
}

export default MosaVideoPlayer
