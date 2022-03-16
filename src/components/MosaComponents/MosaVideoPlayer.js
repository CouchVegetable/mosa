import React, { useEffect, useRef, useState } from 'react'
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

import { useInterval } from '../../hooks/useIntervalHook'
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

export const MosaVideoPlayer = props => {
  const { connected, target, commandRobot } = props

  const [current_file, setCurrentFile] = useState("none")
  const [video_files, setVideoFiles] = useState([])
  const [local_video_files, setLocalVideoFiles] = useState({})

  const [running, setRunning] = useState(false)
  const [moving_pauses, setMovingPauses] = useState(true)
  const [moving_pause_start, setMovingPauseStart] = useState(0)

  const [video_length, setVideoLength] = useState(0)
  const [video_position, setVideoPosition] = useState(0)
  const [video_speed, setVideoSpeed] = useState("100")
  const [latency, setLatency] = useState(0)
  const [position, setPosition] = useState({})

  const [funscripts, setFunscripts] = useState({})
  const [script_offsets, setScriptOffsets] = useState({})

  const [editing_axis, setEditingAxis] = useState("none")

  const axes = [["R2", ".pitch.funscript"],
                ["R1", ".roll.funscript"],
                ["R0", ".twist.funscript"],
                ["L1", ".forward.funscript"],
                ["A1", ".suck.funscript"],
                ["L0", ".funscript"]];

  useInterval(() => {
    if (running) {
      let player = document.getElementById("idvideo");
      if(player.paused) return;
      let current_msecs = player.currentTime * 1000.0 - latency;
      let tmp_position = {...position};
      let tmp_offsets = {...script_offsets};
      for(let axis of axes.map((entry) => entry[0])) {
        try {
          if(funscripts[axis] === undefined) continue;
          if(funscripts[axis]["actions"] === undefined) continue;
          let inverted = !!funscripts[axis]["inverted"];

          let actions = funscripts[axis]["actions"];
          let prev_offset = script_offsets[axis];
          if(actions[prev_offset]["at"] > current_msecs) prev_offset = 0;
          let next_offset = prev_offset + 1;
          while(next_offset < actions.length && actions[next_offset]["at"] < current_msecs) next_offset++;
          if(next_offset < 1) continue;
          prev_offset = next_offset - 1;
          if(next_offset >= actions.length) next_offset = prev_offset;
          if(actions[prev_offset]["at"] > current_msecs) next_offset = prev_offset;

          let prev_action = actions[prev_offset];
          let next_action = actions[next_offset];
          let prev_val = clampedNum(prev_action["pos"], 0, 100) * 10.0;
          let next_val = clampedNum(next_action["pos"], 0, 100) * 10.0;
          if(inverted) {
            prev_val = 1000 - prev_val;
            next_val = 1000 - next_val;
          }
          let where_in_interval = prev_offset !== next_offset ?
                                  (current_msecs - prev_action["at"])*1.0 / (next_action["at"] - prev_action["at"])*1.0 :
                                  0.5
          let mid_val = (1.0 - where_in_interval) * prev_val + where_in_interval * next_val;

          // if enabled, fill L0 pauses with slow motion
          const pause_threshold = 2000
          if(axis === "L0" && moving_pauses) {
            if(mid_val > 850) {
              if(moving_pause_start <= 0) {
                // we are not in pause mode yet, keep watching
                setMovingPauseStart(current_msecs)
              } else {
                if(current_msecs - moving_pause_start > pause_threshold) {
                  // we are in a pause, create holding pattern
                  mid_val = Math.abs(1000 - (((current_msecs - moving_pause_start - pause_threshold) / 4) % 2000)) * 0.8
                }
              }
            } else {
              // seems to be some action here, recover
              if(moving_pause_start < 0) {
                // we are recovering from a pause, advance to mid_val (finish in 600ms)
                let recover_degree = clampedFloat((current_msecs - Math.abs(moving_pause_start)) / 600, 0, 1)
                console.log(`recovering ${recover_degree}`)
                mid_val = recover_degree * mid_val + (1 - recover_degree) * tmp_position["L0"]
                if(recover_degree > 0.95) setMovingPauseStart(0)
              } else if(moving_pause_start > 0) {
                // we might be in a pause
                if(current_msecs - moving_pause_start > pause_threshold) {
                  // we were in a pause, set to recover
                  setMovingPauseStart(-current_msecs)
                  mid_val = tmp_position["L0"]
                } else {
                  // not paused yet, just reset timer
                  setMovingPauseStart(0)
                }
              }
            }
          }

          tmp_position[axis] = mid_val;
          // if(axis === "L0") console.log(`${prev_offset} ${where_in_interval} ${mid_val} ${prev_val} ${next_val}`);
          tmp_offsets[axis] = prev_offset;
        } catch(e) {
          console.log(e);
        }
      }
      setPosition(tmp_position);
      setScriptOffsets(tmp_offsets);
      if(connected) commandRobot(tmp_position, 0);
    }
  }, 50) // next execution in 50ms

  async function setFile(file) {
    function initVideo(filename, funscripts) {
      setEditingAxis("none")
      setCurrentFile(filename)
      setFunscripts(funscripts)
      let tmp2 = {};
      for(let axis in funscripts) tmp2[axis] = 0
      setScriptOffsets(tmp2)
      tmp2 = {};
      for(let axis in funscripts) if(funscripts[axis] !== undefined) tmp2[axis] = 500
      setPosition({...tmp2})
      let video = document.getElementById("idvideo")
      video.play();
      video.ondurationchange = (e) => setVideoLength(e.srcElement.duration * 1000)
      video.ontimeupdate = (e) => setVideoPosition(e.srcElement.currentTime * 1000)
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
    document.getElementById("idvideo").src = `video/${file}`;
    let file_base = "video/" + file.replaceAll(".mp4", "");
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
      console.log(`created funscript file ${axis}`)
      let tmp2 = {...script_offsets}
      tmp2[axis] = 0
      setScriptOffsets(tmp2)
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
      console.log(`Axis ${editing_axis} has ${tmp[editing_axis]["actions"].length} actions`)
    }
    if(key === '0') {
      let tmp = {...funscripts}
      let player = document.getElementById("idvideo")
      let current_msecs = player.currentTime * 1000 - latency
      tmp[editing_axis]["actions"] = tmp[editing_axis]["actions"].filter( (e) => e["at"] < current_msecs - 1500 || e["at"] > current_msecs + 1500)
      setFunscripts(tmp)
      player.currentTime = (current_msecs - 3000 + latency) / 1000
    }
    const speed_key_dict = { 'q': 10, 'w': 25, 'e': 50, 'r': 100, 't': 200 }
    if(key in speed_key_dict) {
      selectVideoSpeed(speed_key_dict[key])
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", keydownListener, true)
    return () => window.removeEventListener("keydown", keydownListener, true)
  })

  const toggleRunning = running => {
    setRunning(!running)
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
    fetch("video/videos.txt", {})
    .then(res => res.text())
    .then(
          (result) => { setVideoFiles(result.split("\n")) },
          (error) => { alert("Could not load list of video files"); }
    )
  })

  let stle = {position: 'absolute', marginLeft: '399px', width: '2px', height: '100px', backgroundColor: 'grey'}
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Video {Math.floor(position["L0"])} {Math.floor(position["R2"])} {Math.floor(position["R1"])}</Typography>
        <hr />
        <video id="idvideo" width="100%" controls>
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
        onChange={(e, value) => setLatency(value)}
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
      <CardActions>
        <Button
          onClick={() => toggleRunning(running)}
          variant="contained"
          color="default"
        >
          {running ? 'STOP' : 'START'}
        </Button>
      </CardActions>
    </Card>
  )
}

export default MosaVideoPlayer
