import React, { useRef, useMemo, useState } from 'react'
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

import { useTimeout } from '../../hooks/useTimeoutHook'
import { chooseRandomStroke } from '../../utils/random'

import { strokes } from '../../config/strokes'

export const MosaRandomControl = props => {
  const { connected, target, commandRobot } = props

  const [running, setRunning] = useState(false)
  const [availableStrokes, setAvailableStrokes] = useState(strokes) // start with all strokes enabled by default

  const [timer, setTimer] = useState(0) // start with no seconds on the clock
  const strokeStartTime = useRef(0)
  const [step, setStep] = useState(50)
  const [speed, setSpeed] = useState(100)
  const [randomness, setRandomness] = useState(30)
  const [strokeType, setStrokeType] = useState(
    chooseRandomStroke(availableStrokes)
  ) // todo: refactor this
  const [stroke, setStroke] = useState(strokeType.getStroke(target, step))
  const [strokeCounter, setStrokeCounter] = useState(0)

  useTimeout(() => {
    const start_time = performance.now()
    if (running && connected) {
      if (timer <= 0) {
        // do we change stroke?
        const newStrokeType =
          Math.random() * 100 < randomness
            ? chooseRandomStroke(availableStrokes) // todo: refactor this
            : strokeType

        const stroke = newStrokeType.getStroke(target, speed/100, step)
        const newTimer = step * stroke.Length // derive next timing from length of stroke

        setStrokeType(newStrokeType)
        setStroke(stroke)
        setTimer(newTimer) // add time to the timer
        strokeStartTime.current = start_time
        setStrokeCounter(strokeCounter + 1)
      } else {
        // execute the next stroke step
        let curStepNr = Math.floor((performance.now() - strokeStartTime.current) / step)
        curStepNr = curStepNr < stroke.length ? curStepNr : stroke.length - 1
        const destination = stroke[curStepNr]
        commandRobot(destination, step / 1000)
        const next_timer = step * (stroke.length - curStepNr - 1)
        setTimer(next_timer)
      }
      const delta_to_next_call = Math.max(step - (performance.now() - start_time), 1)
      console.log(start_time + " " + delta_to_next_call)
      return delta_to_next_call
    }
    return 100 // wait 100ms in case we're idle
  }, 10)

  const toggleRunning = running => {
    running ? setTimer(0) : setStrokeCounter(0)
    setRunning(!running)
  }

  const handleStrokeChange = e => {
    setAvailableStrokes({
      ...availableStrokes,
      [e.target.value]: {
        ...availableStrokes[e.target.value],
        enabled: e.target.checked,
      },
    })
  }

  const cachedPortion = useMemo(() => (
      <CardContent>
        <Typography variant="h5">Random: {strokeType.name}</Typography>
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
  ), [running, strokeType, randomness, speed, step, availableStrokes])

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
        <Typography>-- Stroke #{strokeCounter}</Typography>
      </CardActions>
    </Card>
  )
}

export default MosaRandomControl
