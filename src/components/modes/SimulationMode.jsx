import React, { useState } from "react";
import { Stack, Group } from "@mantine/core";
import Canvas from "../Canvas";
import Toolbar from "../Toolbar";
import PlaybackControls from "../tools/PlaybackControls";
import SpeedSlider from "../tools/SpeedSlider";
import AlgorithmPicker from "../tools/AlgorithmPicker";
import { useSimulation } from "../../hooks/useSimulation";
import { usePlayback } from "../../hooks/usePlayback";

export default function SimulationMode({ mazeData, setMazeData }) {
  const [speed, setSpeed] = useState(100);

  // 1. Get Simulation Logic
  const { algoName, setAlgoName, handleTick, handleReset } = useSimulation({
    mazeData,
    setMazeData,
  });

  // 2. Get Playback Logic
  const { isPlaying, play, pause, reset } = usePlayback({
    interval: speed,
    onTick: handleTick, // Wire Simulation Logic into Player
    onReset: handleReset,
  });

  // Toggle helper
  const togglePlay = () => (isPlaying ? pause() : play());

  return (
    <Stack h="100%" spacing="md" align="center" mt="md">
      <Toolbar>
        <AlgorithmPicker algo={algoName} setAlgo={setAlgoName} />
        <PlaybackControls
          isPlaying={isPlaying}
          onPlayPause={togglePlay}
          onReset={reset}
        />
        <SpeedSlider speed={speed} setSpeed={setSpeed} />
      </Toolbar>

      <Canvas mazeData={mazeData} setMazeData={setMazeData} isReadOnly={true} />
    </Stack>
  );
}
