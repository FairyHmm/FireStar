import { useState } from "react";
import { Container, Stack, SegmentedControl, Box } from "@mantine/core";
import Toolbar from "./Toolbar";
import Canvas from "./Canvas";
import classes from "../styles/components/mode-manager.module.css";;
import { useDesign } from "../hooks/useDesign";
import { useSimulation } from "../hooks/useSimulation";
import { usePlayback } from "../hooks/usePlayback";
import { useMaze } from "../hooks/useMaze";

export default function ModeManager() {
  const [mode, setMode] = useState("design");
  const [speed, setSpeed] = useState(100);

  // Centralized Maze Hook
  const maze = useMaze();

  const designData = useDesign({
    mazeData: maze.state,
    setMazeData: maze.actions.setGrid,
  });

  const simulationData = useSimulation({
    mazeData: maze.state,
    setMazeData: maze.actions.setGrid,
  });

  const playbackData = usePlayback({
    interval: speed,
    onTick: simulationData.handleTick,
    onReset: () => {
      simulationData.handleReset();
      maze.actions.revert();
    },
  });

  const togglePlay = () =>
    playbackData.isPlaying ? playbackData.pause() : playbackData.play();

  const resetSim = () => {
    simulationData.handleReset();
    maze.actions.revert();
    playbackData.reset();
  };

  const handleModeChange = (newMode) => {
    if (newMode === "design") maze.actions.revert();
    setMode(newMode);
  };

  return (
    <Container size="xl" className={classes.container}>
      <Stack gap="xl">
        <Box className={classes.header}>
          <SegmentedControl
            value={mode}
            onChange={handleModeChange}
            data={[
              { label: "Xây dựng", value: "design" },
              { label: "Mô phỏng", value: "simulation" },
            ]}
            color={"var(--color-primary)"}
            style={{ backgroundColor: "var(--color-fg)" }}
          />
        </Box>

        <Toolbar
          mode={mode}
          designProps={{
            mazeData: maze.state,
            setMazeData: maze.actions.setGrid,
            ...designData,
          }}
          simulationProps={{
            mazeData: maze.state,
            setMazeData: maze.actions.setGrid,
            ...simulationData,
            ...playbackData,
            togglePlay,
            resetSim,
            speed,
            setSpeed,
          }}
        />

        <Canvas
          mazeData={maze.state}
          setMazeData={maze.actions.setGrid}
          activeTool={mode === "design" ? designData.activeTool : null}
          isReadOnly={mode === "simulation"}
        />
      </Stack>
    </Container>
  );
}
