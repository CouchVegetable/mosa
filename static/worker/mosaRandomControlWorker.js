let contextWorkerPort = {}

let running = false
let queue = []
let lastProgressUpdate = 0

onmessage = async (e) => {
  //console.log(`RandomControlWorker got message! ${JSON.stringify(e.data)}`)
  if(e.data[0] === "running") {
    running = e.data[1]
    contextWorkerPort.postMessage(["enableTempSmoothing"])
  } else if(e.data[0] === "addStroke") {
    queue.push(e.data[1])
  } else if(e.data[0] === "setContextPort") {
    contextWorkerPort = e.data[1]
  } else {
    console.error(`Unknown message: ${JSON.stringify(e.data)}`)
  }
}

function doLoop() {
  let performance_now_time = Math.floor(performance.now())
  let next_call_delta_time = 250

  if (running && queue.length > 0) {
    let stroke = queue[0]
    const destination = stroke.actions.shift()
    contextWorkerPort.postMessage(["commandRobot", destination, stroke.step / 1000])
    next_call_delta_time = stroke.step
    let requestUpdate = false
    if(stroke.actions.length * stroke.step < 500 && !stroke.updateRequested) {
      stroke.updateRequested = true
      requestUpdate = true
    }
    if(performance_now_time - lastProgressUpdate > 250 || requestUpdate) {
      lastProgressUpdate = performance_now_time
      postMessage(["progressUpdate", stroke.actions.length * stroke.step, stroke.name, requestUpdate])
    }
    if(stroke.actions.length === 0) {
      queue.shift()
    }
  } else {
    postMessage(["progressUpdate", 0, "", true])
  }

  let time_elapsed = performance.now() - performance_now_time
  next_call_delta_time = Math.max(1, next_call_delta_time - time_elapsed)  // correct next call delta for runtime
  if(next_call_delta_time == 1) console.log("Performance issues.")
  setTimeout(doLoop, next_call_delta_time)
}

setTimeout(doLoop, 10)
