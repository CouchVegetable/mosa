let port = null
let reader = null
let writer = null
let outputDone = false
let outputStream = null
let inputDone = null

let target = {}
let targetHasChanged = true

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

onmessage = async (e) => {
  // console.log("Got message! " + e.data)
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
  } else if(e.data[0] === "writeToSerial") {
    if (writer) {
      const lines = e.data[1]
      lines.forEach(line => {
        console.log('[OSR][SEND]', line, '\n')
        writer.write(line + '\n')
      })
    } else {
      console.warn('[OSR][WARN] Disconnected, skipping stream write')
    }
  } else if(e.data[0] === "setTarget") {
    if(JSON.stringify(e.data[1]) !== JSON.stringify(target)) {
      target = e.data[1]
      targetHasChanged = true
    }
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
