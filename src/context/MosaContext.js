import React, { useState, useEffect } from 'react'
import { defaultRange, defaultTarget } from '../config/defaults'

export const MosaContext = React.createContext({
  settings: defaultRange,
  target: defaultTarget,
  inputMethod: 'web',
})

// create web worker
let mosaContextWorker = typeof window !== "undefined" ? new Worker((window.location.pathname.startsWith("/mosa/") ? "/mosa/" : "/") + "worker/mosaContextWorker.js") : undefined // see static/worker/mosaContextWorker.js

export const MosaProvider = ({ children }) => {
  const isSerialAvailable =
    typeof window !== 'undefined' && 'serial' in navigator // https://github.com/gatsbyjs/gatsby/issues/6859

  const [mosaSettings, setMosaSettings] = useState(defaultRange)

  const [connected, setConnected] = useState(false)
  const [target, setTarget] = useState(defaultTarget)

  const [inputMethod, setSelectedInputMethod] = useState('web')
  const handleInputMethodChange = (event, newInputMethod) => {
    setSelectedInputMethod(newInputMethod)
  }

  const [outputMethod, setSelectedOutputMethod] = useState()
  const handleOutputMethodChange = async (event, newOutputMethod) => {
    // todo: make this better
    if (connected) {
      await handleDisconnectFromSerial() // eventually, all methods
      await handleDisconnectFromVisualization()
    }

    switch (newOutputMethod) {
      case null: // none selected or active is deselected
        console.log('[OSR][INFO] Disconnecting from outputs.')
        break
      case 'serial':
        handleConnectToSerial()
        break
      case 'visualizer':
        handleConnectToVisualization()
        break
      default:
        console.warn(
          '[OSR][WARN] Unknown output method selected: ' + newOutputMethod
        )
    }
    setSelectedOutputMethod(newOutputMethod)
  }

  const handleConnectToVisualization = async () => {
    console.log('[OSR][DEV] Connecting to SR Visualization')
    setConnected(true)
  }
  const handleDisconnectFromVisualization = async () => {
    console.log('[OSR][DEV] Disconnecting from SR Visualization')
    setConnected(false)
  }

  useEffect(() => {
    // once, on load, try to load settings from localStorage
    // if we can't find them, create them in localStorage
    // we can store strings, not objects, in localstorage
    let _mosaSettings = JSON.parse(
      localStorage.getItem('mosaSettings')
    )
    if (!_mosaSettings) {
      _mosaSettings = defaultRange
      // we can store strings, not objects, in localstorage
      localStorage.setItem('mosaSettings', JSON.stringify(defaultRange))
    }
    setMosaSettings(_mosaSettings)

    mosaContextWorker.onmessage = (e) => {
      if(e.data[0] === "targetUpdate") {
        // the worker updates the robot target periodically
        // this decoupling allows to update the robot target without triggering rerenders excessively
        const destination = e.data[1]
        const newTarget = { ...target, ...destination }
        setTarget(newTarget)
      }
    }

    mosaContextWorker.postMessage(["setMosaSettings", _mosaSettings])
    mosaContextWorker.postMessage(["commandRobot",  target, 0.5])
  }, [setMosaSettings])

  const updateSettings = newSettings => {
    setMosaSettings(newSettings)
    mosaContextWorker.postMessage(["setMosaSettings", newSettings])
    localStorage.setItem('mosaSettings', JSON.stringify(newSettings))
  }

  const handleConnectToSerial = async () => {
    try {
      await navigator.serial.requestPort()
      mosaContextWorker.postMessage(["connectSerial"])
      setConnected(true)
    } catch (e) {
      console.error(e)
      setConnected(false)
      setSelectedOutputMethod(null) // connecting failed :(
      // TODO: set error state, create/catch via error boundary?
    }
  }

  const handleDisconnectFromSerial = async () => {
    commandRobot(defaultTarget, 1, defaultRange)
    mosaContextWorker.postMessage(["disconnectSerial"])
    setConnected(false)
  }

  const getMosaContextWorkerPort = () => {
    const channel = new MessageChannel()
    mosaContextWorker.postMessage(["createNewPort", channel.port1], [channel.port1])
    return channel.port2
  }

  const commandRobot = (destination, interval) => {
    mosaContextWorker.postMessage(["commandRobot", destination, interval])
  }

  return (
    <MosaContext.Provider
      value={{
        isSerialAvailable: isSerialAvailable,
        connected: connected,
        commandRobot: commandRobot,
        getMosaContextWorkerPort: getMosaContextWorkerPort,
        target: target,
        inputMethod: inputMethod,
        handleInputMethodChange,
        outputMethod: outputMethod,
        handleOutputMethodChange: handleOutputMethodChange,
        settings: mosaSettings,
        updateSettings: updateSettings,
      }}
    >
      {children}
    </MosaContext.Provider>
  )
}
