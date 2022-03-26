import React, { useState, useEffect } from 'react'
import { defaultRange, defaultTarget } from '../config/defaults'
import { scaleAxes, constructTCodeCommand } from '../utils/tcode'

export const MosaContext = React.createContext({
  settings: defaultRange,
  target: defaultTarget,
  inputMethod: 'web',
})

export const MosaProvider = ({ children }) => {
  const isSerialAvailable =
    typeof window !== 'undefined' && 'serial' in navigator // https://github.com/gatsbyjs/gatsby/issues/6859

  const [mosaSettings, setMosaSettings] = useState(defaultRange)

  const [mosaContextWorker, setMosaContextWorker] = useState()
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
    const existingMosaSettings = JSON.parse(
      localStorage.getItem('mosaSettings')
    )
    if (existingMosaSettings) {
      setMosaSettings(existingMosaSettings)
    } else {
      setMosaSettings(defaultRange)
      // we can store strings, not objects, in localstorage
      localStorage.setItem('mosaSettings', JSON.stringify(defaultRange))
    }

    // create serial web worker
    let mcWorker = new Worker("../worker/mosaContextWorker.js")  // see static/worker/mosaContextWorker.js
    mcWorker.onmessage = (e) => {
      if(e.data[0] === "targetUpdate") {
        // the worker updates the robot target periodically
        // this decoupling allows to update the robot target without triggering rerenders excessively
        const destination = e.data[1]
        const newTarget = { ...target, ...destination }
        setTarget(newTarget)
      }
    }
    mcWorker.postMessage(["setTarget",  target])
    setMosaContextWorker(mcWorker)
  }, [setMosaSettings])

  const updateSettings = newSettings => {
    setMosaSettings(newSettings)
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

  const commandRobot = (destination, interval) => {
    mosaContextWorker.postMessage(["setTarget", destination])

    const scaledDestination = scaleAxes(destination, mosaSettings)
    const command = constructTCodeCommand(scaledDestination, interval)
    switch (outputMethod) {
      case 'serial':
        mosaContextWorker.postMessage(["writeToSerial", [command]])
        break
      case 'visualizer':
        console.log('[OSR][DEV] Output to vis: ' + command)
        break
      default:
        console.warn('[OSR][DEV] unknown output method - command: ' + command)
    }
  }

  return (
    <MosaContext.Provider
      value={{
        isSerialAvailable: isSerialAvailable,
        connected: connected,
        commandRobot: commandRobot,
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
