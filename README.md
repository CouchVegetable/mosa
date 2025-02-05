# mosa

This is a fork of https://github.com/tnxa/mosa

New features
- video and (multi axis) funscript playback
  - best go to "Videoscript" page (via burger menu at left top)
  - you can select videos from the server side or from your local machine
    - for **playback from a local file folder**, click "Open Client Video Folder" button and select a folder containing MP4 videos and funscripts, then select a video from the dropdown list
    - to add own videos to the **server side** of an instance of this software that you are running on an own machine, put videos and scripts in the static/video folder, and add a static/video/videos.txt file listing video files
  - "moving pauses" feature adding slow movement in case L0 is inactive in the funscript for some seconds
- very simple funscript editing/authoring
  - keys 1-9 to input position at current time in video
  - 0 to delete events from 1500ms in the past up to 1500ms in the future, then skip back 3000ms ("quick fix")
  - change playback speed (via dropdown box or QWERT keys)
  - download and save script when done
- reduced latency by using web workers
- new random movement features
  - speed adjustment in random movement
  - new "Doubles sines" random movement
- range widget with added "Intensity" slider and Defaults button

## Upstream readme

mosa is a tool you can use to send [t-code][t-code-spec] to a compatible device over serial using the [web serial API][webserial].

In Google Chrome, you should be able to connect a device which accepts [t-code][t-code-spec] and then use web controls to send commands in a visual/intuitive way.

## Running / Developing Locally

To get started running locally, you will need [`nodejs`][nodejs] and [`npm`][npm] installed.

As you have nodejs and npm installed, open the project directory with your favorite shell.

Run `npm install` (in the same directory as `package.json`).

Once installation completes:

- to run the app in development mode, run `npm start` and open [http://localhost:8000](http://localhost:8000) to view it in the
  browser. The page will reload if you make edits. You will also see any lint errors in the console.

- to build the app for production, run `npm build`. This will build the app for production to the `build` folder, making some optimizations for the best performance. You can then run `npm run serve` to serve the production build locally.

- to include a path prefix, run `PREFIX_PATHS=true npm run-script build`, and Gatsby will include the prefix path defined in gatsby-config.js.

## Context

This started out as an experiment in [React][reactjs]/[Gatsby][gatsbyjs] using [web serial][webserial] to interface with OSR firmware and hardware.

This is accomplished by producing [t-code][t-code-spec] to be used by the OSR3, OSR2, and now SR6 as developed by [Tempest][tempestvr], as well as any other devices which accept [t-code][t-code-spec].

Made possible by the [Web Serial API][webserial]. Bootstrapped with [Gatsby][gatsbyjs] & the [material-ui-starter][material-ui-starter].

[nodejs]: https://nodejs.org/
[npm]: https://www.npmjs.com/
[reactjs]: https://reactjs.org/
[gatsbyjs]: https://gatsbyjs.com
[material-ui-starter]: https://material-ui-starter.netlify.com/
[webserial]: https://wicg.github.io/serial/
[t-code-spec]: https://github.com/multiaxis/tcode-spec
[tempestvr]: https://patreon.com/tempestvr
