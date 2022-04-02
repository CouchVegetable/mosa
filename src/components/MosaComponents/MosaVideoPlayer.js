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

// create web worker
const worker = new Worker((window.location.pathname.startsWith("/mosa/") ? "/mosa/" : "/") + "worker/mosaVideoPlayerWorker.js")  // see static/worker/mosaVideoPlayerWorker.js

export const MosaVideoPlayer = props => {
  const { connected, getMosaContextWorkerPort } = props

  const [current_file, setCurrentFile] = useState("none")
  const [video_files, setVideoFiles] = useState([])
  const [local_video_files, setLocalVideoFiles] = useState({})

  const [moving_pauses, setMovingPauses] = useState(false)
  const [moving_pause_start, setMovingPauseStart] = useState(0)

  const [video_length, setVideoLength] = useState(0)
  const [video_position, setVideoPosition] = useState(0)
  const [video_speed, setVideoSpeed] = useState("100")
  const [latency, setLatency] = useState(0)

  const position = useRef({})
  const [funscripts, setFunscripts] = useState({})

  const [editing_axis, setEditingAxis] = useState("none")

  const axes = [["R2", ".pitch.funscript"],
                ["R1", ".roll.funscript"],
                ["R0", ".twist.funscript"],
                ["L1", ".forward.funscript"],
                ["A1", ".suck.funscript"],
                ["L0", ".funscript"]];

  async function setFile(file) {
    function initVideo(filename, funscripts) {
      setEditingAxis("none")
      setCurrentFile(filename)
      setFunscripts(funscripts)
      let lsLatency = localStorage.getItem(`mosaSettingsVideoLatency_${filename}`)
      if(lsLatency) setLatency(parseFloat(lsLatency))
      worker.postMessage(["updateParameters", { funscripts: funscripts }])
      let video = document.getElementById("idvideo")
      video.play();
      video.ondurationchange = (e) => {
        setVideoLength(e.srcElement.duration * 1000)
      }
      video.ontimeupdate = (e) => {
        const veTimeMs = e.srcElement.currentTime * 1000
        worker.postMessage(["videoElementTimeMs", veTimeMs])
        setVideoPosition(veTimeMs)
      }
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
    let pathPrefix = window.location.pathname.startsWith("/mosa/") ? "/mosa/" : "/"
    document.getElementById("idvideo").src = `${pathPrefix}video/${file}`;
    let file_base = pathPrefix + "video/" + file.replaceAll(".mp4", "");
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
      worker.postMessage(["updateParameters", { funscripts: funscripts }])
      console.log(`created funscript file ${axis}`)
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
      worker.postMessage(["updateParameters", { funscripts: funscripts }])
      console.log(`Axis ${editing_axis} has ${tmp[editing_axis]["actions"].length} actions`)
    }
    if(key === '0') {
      let tmp = {...funscripts}
      let player = document.getElementById("idvideo")
      let current_msecs = player.currentTime * 1000 - latency
      tmp[editing_axis]["actions"] = tmp[editing_axis]["actions"].filter( (e) => e["at"] < current_msecs - 1500 || e["at"] > current_msecs + 1500)
      setFunscripts(tmp)
      worker.postMessage(["updateParameters", { funscripts: funscripts }])
      player.currentTime = (current_msecs - 3000 + latency) / 1000
    }
    const speed_key_dict = { 'q': 10, 'w': 25, 'e': 50, 'r': 100, 't': 200 }
    if(key in speed_key_dict) {
      selectVideoSpeed(speed_key_dict[key])
      worker.postMessage(["updateParameters", { playback_rate: 100 / speed_key_dict[key] }])
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", keydownListener, true)
    return () => window.removeEventListener("keydown", keydownListener, true)
  })

  const setRunning = running => {
    worker.postMessage(["updateParameters", { running: running }])
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
    let pathPrefix = window.location.pathname.startsWith("/mosa/") ? "/mosa/" : "/"
    fetch(`${pathPrefix}video/videos.txt`, {})
    .then(res => res.text())
    .then(
          (result) => { setVideoFiles(result.split("\n")) },
          (error) => { alert("Could not load list of video files"); }
    )
  }, [])

  useEffect(() => {
    const port = getMosaContextWorkerPort()
    worker.postMessage(["setContextPort", port], [port])
  }, [])

  const updateLatency = value => {
    worker.postMessage(["updateParameters", { latency: value }])
    setLatency(value)
    localStorage.setItem(`mosaSettingsVideoLatency_${current_file}`, `${value}`)
  }

  let stle = {position: 'absolute', marginLeft: '399px', width: '2px', height: '100px', backgroundColor: 'grey'}
  const result = useMemo(() => (
    <Card>
      <CardContent>
        <Typography variant="h5">Video</Typography>
        <hr />
        <video id="idvideo" width="100%" onPlay={() => setRunning(true)} onPause={() => setRunning(false)} controls>
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
        onChange={(e, value) => { updateLatency(value) } }
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
    </Card>
    ), [connected, current_file, video_files, moving_pauses,
        video_length, video_position, video_speed, latency, funscripts, editing_axis]
  );
  return result;
}

export default MosaVideoPlayer
