import React, { useMemo, useState, useCallback, useEffect } from 'react'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  FormControlLabel,
  FormGroup,
  Slider,
  Switch,
  Typography,
} from '@material-ui/core'

import { chooseRandomStroke } from '../../utils/random'

import { strokes } from '../../config/strokes'

let mosaRandomControlWorker = new Worker((window.location.pathname.startsWith("/mosa/") ? "/mosa/" : "/") + "worker/mosaRandomControlWorker.js")  // see static/

let lastTarget = undefined

export const MosaRandomControl = props => {
  const { connected, target, getMosaContextWorkerPort } = props

  const [running, setRunning] = useState(false)
  const [availableStrokes, setAvailableStrokes] = useState(strokes) // start with all strokes enabled by default

  const [timer, setTimer] = useState(0)
  const [step, setStep] = useState(50)
  const [speed, setSpeed] = useState(100)
  const [randomness, setRandomness] = useState(30)
  const [strokeName, setStrokeName] = useState("")
  const [strokeType, setStrokeType] = useState(undefined)

  const toggleRunning = running => {
    setRunning(!running)
    mosaRandomControlWorker.postMessage(["running", !running])
  }

  const handleStrokeChange = useCallback(e => {
    setAvailableStrokes({
      ...availableStrokes,
      [e.target.value]: {
        ...availableStrokes[e.target.value],
        enabled: e.target.checked,
      },
    })
  }, [availableStrokes])
  
  const enqueueNextStroke = useCallback( () => {
    if (running && connected) {
      const newStrokeType =
        Math.random() * 100 < randomness || strokeType === undefined
          ? chooseRandomStroke(availableStrokes)
          : strokeType
      setStrokeType(newStrokeType)

      let actions = newStrokeType.getStroke(lastTarget, speed/100, step)
      lastTarget = { ...lastTarget, ...actions.slice(-1)[0] }  // new actions might not use all axes
      let strokePars = {
        "name": newStrokeType.name,
        "step": step,
        "speed": speed,
        "actions": actions,
      }
      mosaRandomControlWorker.postMessage(["addStroke", strokePars])
    }
  }, [connected, running, availableStrokes, randomness, speed, step, strokeType])

  useEffect(() => {
    //console.log("SETTING WORKER CALLBACK")
    mosaRandomControlWorker.onmessage = (e) => {
      if(e.data[0] === "progressUpdate") {
        let remaining_time = e.data[1]
        setTimer(remaining_time)
        if(e.data[2] !== "") setStrokeName(e.data[2])
        if(e.data[3]) enqueueNextStroke()
      } else {
        console.error(`Unknown message: ${JSON.stringify(e.data)}`)
      }
    }
  }, [setTimer, setStrokeName, enqueueNextStroke])

  useEffect(() => {
    //console.log("SENDING SETCONTEXTPORT")
    const port = getMosaContextWorkerPort()
    mosaRandomControlWorker.postMessage(["setContextPort", port], [port])
  }, [])

  useEffect(() => {
    if(!lastTarget) lastTarget = target
  }, [target])

  const cachedPortion = useMemo(() => (
      <CardContent>
        <Typography variant="h5">Random: {strokeName}</Typography>
        <hr />
        <Typography>Change Stroke: {randomness}%</Typography>
        <Slider
          value={randomness}
          min={0}
          max={100}
          valueLabelDisplay={'auto'}
          onChange={(e, value) => setRandomness(value)}
        />
        <Typography>Speed: {speed}%</Typography>
        <Slider
          value={speed}
          min={20}
          max={500}
          step={1}
          valueLabelDisplay={'auto'}
          onChange={(e, value) => setSpeed(value)}
        />
        <Typography>Update Frequency</Typography>
        <Slider
          value={step}
          min={10}
          max={100}
          step={1}
          track={false}
          valueLabelDisplay={'auto'}
          onChange={(e, value) => setStep(value)}
          marks={[{ value: 50, label: '50ms/step' }]}
          disabled={running}
        />
        <FormGroup row>
          {Object.entries(availableStrokes).map(([k, stroke]) => {
            return (
              <FormControlLabel
                key={stroke.name}
                label={stroke.name}
                control={
                  <Switch
                    checked={stroke.enabled}
                    onChange={handleStrokeChange}
                    name={stroke.name}
                    value={k}
                    color={'primary'}
                  />
                }
              />
            )
          })}
        </FormGroup>
      </CardContent>
  ), [running, randomness, speed, step, availableStrokes, handleStrokeChange, strokeName])

  return (
    <Card>
      { cachedPortion }
      <CardActions>
        <Button
          onClick={() => toggleRunning(running)}
          variant="contained"
          color="default"
          disabled={!connected}
        >
          {running ? 'STOP' : 'START'}
        </Button>
        <Typography>
          Next: {(timer >= 0 ? timer / 1000 : 0).toFixed(1)}s
        </Typography>
      </CardActions>
    </Card>
  )
}

export default MosaRandomControl
