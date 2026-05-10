import { useState } from "react";
import { AppShell, Group, SegmentedControl, Stack } from "@mantine/core";
import Toolbar from "./Toolbar";
import Canvas from "./Canvas";
import { useDesign } from "../hooks/useDesign";
import { useSimulation } from "../hooks/useSimulation";
import { usePlayback } from "../hooks/usePlayback";
import { useMaze } from "../hooks/useMaze";

export default function ModeManager() {
  const [mode, setMode] = useState("design");
  const [speed, setSpeed] = useState(100);

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
    <AppShell
      padding="xl"
      styles={{
        main: { background: "var(--color-bg)" },
      }}
    >
      <AppShell.Main>
        <Stack gap="xl">
          <Group justify="flex-end">
            <SegmentedControl
              value={mode}
              onChange={handleModeChange}
              data={[
                { label: "Xây dựng", value: "design" },
                { label: "Mô phỏng", value: "simulation" },
              ]}
              styles={{
                root: { backgroundColor: "var(--color-fg)" },
                indicator: { backgroundColor: "var(--color-primary)" },
              }}
            />
          </Group>

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
            updateGrid={maze.actions.updateGrid}
            activeTool={mode === "design" ? designData.activeTool : null}
            isReadOnly={mode === "simulation"}
          />
        </Stack>
      </AppShell.Main>
    </AppShell>
  );
}
