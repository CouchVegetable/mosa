import React from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'

import { Card, Typography, CardContent, Grid, Divider } from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'

import { MosaContext } from '../context/MosaContext'

import MosaOutputRangeControl from '../components/MosaComponents/MosaOutputRangeControl'
import MosaMotionControl from '../components/MosaComponents/MosaMotionControl'
import MosaVideoPlayer from '../components/MosaComponents/MosaVideoPlayer'
import MosaVibeControl from '../components/MosaComponents/MosaVibeControl'
import MosaVisualizer from '../components/MosaComponents/MosaVisualizer'

const TestBedPage = () => {
  return (
    <MosaContext.Consumer>
      {({
        isSerialAvailable,
        connected,
        commandRobot,
        getMosaContextWorkerPort,
        target,
        inputMethod,
        handleInputMethodChange,
        outputMethod,
        handleOutputMethodChange,
        settings,
        updateSettings,
      }) => (
        <Layout>
          <SEO title="Videoscript" />
          <Grid container spacing={2} justify="center">
            <Grid item xs={4} md={4} lg={3}>
              <MosaOutputRangeControl
                settings={settings}
                updateSettings={updateSettings}
              />
            </Grid>
            <Grid item xs={8}>
              <MosaVideoPlayer
                connected={connected}
                commandRobot={commandRobot}
                getMosaContextWorkerPort={getMosaContextWorkerPort}
              />
            </Grid>
            <Grid item xs={4}>
              <Card>
                <CardContent>
                  <Typography>
                    Input: {!inputMethod && 'none selected'}
                  </Typography>
                  <ToggleButtonGroup
                    value={inputMethod}
                    exclusive
                    onChange={handleInputMethodChange}
                  >
                    <ToggleButton value="web">WEB</ToggleButton>
                    <ToggleButton value="remote" disabled>
                      REMOTE
                    </ToggleButton>
                  </ToggleButtonGroup>
                  <br />
                  <br />
                  <Typography>
                    Output: {!outputMethod && 'none selected'}
                  </Typography>
                  <ToggleButtonGroup
                    value={outputMethod}
                    exclusive
                    onChange={handleOutputMethodChange}
                  >
                    {isSerialAvailable && (
                      <ToggleButton value="serial">SERIAL</ToggleButton>
                    )}
                    <ToggleButton value="visualizer">SR-VIS</ToggleButton>
                  </ToggleButtonGroup>
                  {!isSerialAvailable && ( // if serial not available, explain
                    <>
                      <br />
                      <Typography>
                        Could not detect serial capabilities. Please use the
                        latest version of Chrome, open{' '}
                        <code>chrome://flags</code>, and set
                        <code>
                          #enable-experimental-web-platform-features
                        </code>{' '}
                        (note that these are experimental features, use at your
                        own risk, etc etc)
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <MosaVisualizer target={target} />
              <hr/>
              <MosaVibeControl
                connected={connected}
                target={target}
                commandRobot={commandRobot}
              />
            </Grid>
            <Grid item xs={4}>
              <MosaMotionControl
                connected={connected}
                target={target}
                commandRobot={commandRobot}
              />
            </Grid>
          </Grid>
          &nbsp;
          <Divider />
        </Layout>
      )}
    </MosaContext.Consumer>
  )
}

export default TestBedPage
