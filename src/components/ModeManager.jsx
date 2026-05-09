import { useState } from "react";
import { Container, Stack, SegmentedControl, Box } from "@mantine/core";
import Toolbar from "./Toolbar";
import Canvas from "./Canvas";
import classes from "../styles/components/mode-manager.module.css";
import scClasses from "../styles/mantine/segmented-control.module.css";
import { useDesign } from "../hooks/useDesign";
import { useSimulation } from "../hooks/useSimulation";
import { usePlayback } from "../hooks/usePlayback";

export default function ModeManager() {
  const [mode, setMode] = useState("design");

  const [mazeData, setMazeData] = useState({
    grid: new Uint8Array(0),
    w: 31,
    h: 31,
  });

  const [speed, setSpeed] = useState(100);

  // Hooks
  const designData = useDesign({ mazeData, setMazeData });
  const simulationData = useSimulation({ mazeData, setMazeData });
  const playbackData = usePlayback({
    interval: speed,
    onTick: simulationData.handleTick,
    onReset: simulationData.handleReset,
  });

  const togglePlay = () =>
    playbackData.isPlaying ? playbackData.pause() : playbackData.play();

  const resetSim = () => {
    simulationData.handleReset();
    playbackData.reset();
  };

  return (
    <Container size="xl" className={classes.container}>
      <Stack gap="xl">
        <Box className={classes.header}>
          <SegmentedControl
            value={mode}
            onChange={setMode}
            data={[
              { label: "Xây dựng", value: "design" },
              { label: "Mô phỏng", value: "simulation" },
            ]}
            classNames={{
              root: scClasses["toggle-root"],
              indicator: scClasses["toggle-indicator"],
            }}
          />
        </Box>

        <Toolbar
          mode={mode}
          designProps={{ mazeData, setMazeData, ...designData }}
          simulationProps={{
            mazeData,
            setMazeData,
            ...simulationData,
            ...playbackData,
            togglePlay,
            resetSim,
            speed,
            setSpeed
          }}
        />

        <Canvas
          mazeData={mazeData}
          setMazeData={setMazeData}
          activeTool={mode === "design" ? designData.activeTool : null}
          isReadOnly={mode === "simulation"}
        />
      </Stack>
    </Container>
  );
}
