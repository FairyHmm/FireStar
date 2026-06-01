import { useState } from "react";
import { AppShell, Stack } from "@mantine/core";
import ModeSwitcher from "./ModeSwitcher";
import Toolbar from "./Toolbar";
import Canvas from "./Canvas";
import SimulationResultModal from "./SimulationResultModal";
import { useDesign } from "../hooks/useDesign";
import { useSimulation } from "../hooks/useSimulation";
import { useMaze } from "../hooks/useMaze";

export default function ModeManager() {
  const [mode, setMode] = useState("design");

  const [simResult, setSimResult] = useState(null);

  const maze = useMaze();
  const design = useDesign({ maze });

  const simulation = useSimulation({
    maze,
    onSimulationEnd: setSimResult
  });

  const handleModeChange = (newMode) => {
    if (newMode === "design")
      simulation.reset();
    setMode(newMode);
  };

  return (
    <AppShell padding="xl" styles={{ main: { background: "var(--color-bg)" } }}>
      <AppShell.Main>
        <Stack gap="xl">
          <ModeSwitcher mode={mode} onModeChange={handleModeChange} />

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

      <SimulationResultModal
        opened={simResult !== null}
        onClose={() => setSimResult(null)}
        data={simResult}
      />
    </AppShell>
  );
}
