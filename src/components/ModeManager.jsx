import { useState } from "react";
import { AppShell, Group, SegmentedControl, Stack } from "@mantine/core";
import Toolbar from "./Toolbar";
import Canvas from "./Canvas";
import { useDesign } from "../hooks/useDesign";
import { useSimulation } from "../hooks/useSimulation";
import { useMaze } from "../hooks/useMaze";

export default function ModeManager() {
  const [mode, setMode] = useState("design");

  const maze = useMaze();
  const design = useDesign({ maze });
  const simulation = useSimulation({ maze });

  const handleModeChange = (newMode) => {
    if (newMode === "design")
      simulation.reset();
    setMode(newMode);
  };

  return (
    <AppShell padding="xl" styles={{ main: { background: "var(--color-bg)" } }}>
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
            design={design}
            simulation={simulation}
            mazeState={maze.state}
            setMazeData={maze.actions.setGrid}
          />

          <Canvas
            mazeData={maze.state}
            updateGrid={maze.actions.updateGrid}
            activeTool={mode === "design" ? design.activeTool : null}
            isReadOnly={mode === "simulation"}
          />
        </Stack>
      </AppShell.Main>
    </AppShell>
  );
}
