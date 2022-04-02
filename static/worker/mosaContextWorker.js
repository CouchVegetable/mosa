self.importScripts('../utils/tcode.js')

let port = null
let reader = null
let writer = null
let outputDone = false
let outputStream = null
let inputDone = null

let mosaSettings = {}

let target = {}
let targetHasChanged = true

let smoothingUntil = 0

// serial handling info:
// thanks to https://github.com/WICG/serial/blob/gh-pages/EXPLAINER.md
//         & https://codelabs.developers.google.com/codelabs/web-serial/

readFromSerial = async () => {
  while (reader) {
    const { value, done } = await reader.read()
    if (value) {
      console.log('[OSR][READ] ' + value)
    }
    if (done) {
      console.log('[OSR][INFO] READ LOOP CLOSED')
      reader.releaseLock()
      break
    }
  }
}

writeToSerial = (lines) => {
  if (writer) {
    lines.forEach(line => {
      writer.write(line + '\n')
    })
  } else {
    console.warn('[OSR][WARN] Disconnected, skipping stream write')
  }
}

commandRobot = (destination, interval) => {
  const smoothingForSecs = (smoothingUntil - performance.now()) / 1000
  if(smoothingForSecs > 0) {
    console.log(`Smoothing movement, ${smoothingForSecs} secs remaining`)
    if (typeof interval === 'object') {
      for(let axis of Object.keys(interval)) {
        interval[axis] = interval[axis] < smoothingForSecs ? smoothingForSecs : interval[axis]
      }
    } else {
      interval = interval < smoothingForSecs ? smoothingForSecs : interval
    }
  }
  const scaledDestination = scaleAxes(destination, mosaSettings)
  const command = constructTCodeCommand(scaledDestination, interval)
  if(writer) writeToSerial([command])
  console.log('[OSR][DEV] commandRobot: ' + command)
}

onmessage = async (e) => {
  //console.log(`Got message! ${JSON.stringify(e.data)}`)
  if(e.data[0] === "connectSerial") {
    if (!port) {
      try {
        const ports = await self.navigator.serial.getPorts()
        port = ports[0]
        await port.open({ baudRate: 115200 })

        // eslint-disable-next-line no-undef
        const encoder = new TextEncoderStream()
        outputDone = encoder.readable.pipeTo(port.writable)
        outputStream = encoder.writable
        writer = outputStream.getWriter()

        // eslint-disable-next-line no-undef
        const decoder = new TextDecoderStream()
        inputDone = port.readable.pipeTo(decoder.writable)
        reader = decoder.readable.getReader()

        readFromSerial()
      } catch (e) {
        port = null
        outputDone = null
        outputStream = null
        inputDone = null
        writer = null
        reader = null
        throw e
      }
    } else {
      console.warn('[OSR][WARN] Port already set')
    }
  } else if(e.data[0] === "disconnectSerial") {
    if (port) {
      if (reader) {
        await reader.cancel()
        await inputDone.catch(() => {})
        reader = null
        inputDone = null
      }
      if (outputStream) {
        await writer.close()
        await outputDone
        outputStream = null
        writer = null
        outputDone = null
      }
      await port.close()
      port = null
    }
  } else if(e.data[0] === "setMosaSettings") {
    console.log(`setMosaSettings: ${JSON.stringify(e.data)}`)
    mosaSettings = e.data[1]
  } else if(e.data[0] === "commandRobot") {
    let newTarget = e.data[1]
    commandRobot(newTarget, e.data[2])
    if(!targetHasChanged) {
      for(let a of Object.keys(newTarget)) {
        if(newTarget[a] !== target[a]) {
          targetHasChanged = true
          break
        }
      }
    }
    target = { ...target, ...e.data[1] }
  } else if(e.data[0] === "enableTempSmoothing") {
    console.log("Enabling temp movement smoothing")
    smoothingUntil = performance.now() + 1000
  } else if(e.data[0] === "createNewPort") {
    const port = e.data[1]
    port.onmessage = onmessage
  }
}

const notifyTarget = () => {
  if(targetHasChanged) {
    postMessage(["targetUpdate", target])
    targetHasChanged = false
  }
  setTimeout(notifyTarget, 100)
}

setTimeout(notifyTarget, 10)
