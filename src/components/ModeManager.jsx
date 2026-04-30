import { useState } from "react";
import { Stack, SegmentedControl, Box, Container } from "@mantine/core";
import DesignMode from "./modes/DesignMode";
import SimulationMode from "./modes/SimulationMode";
import classes from "../styles/components/mode-manager.module.css";
import scClasses from "../styles/mantine/segmented-control.module.css";

export default function ModeManager() {
  const [mode, setMode] = useState("design");

  // Giữ maze ko bị mất khi chuyển chế độ
  const [mazeData, setMazeData] = useState({
    grid: new Uint8Array(0),
    w: 31,
    h: 31,
  });

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

        {mode === "design" ? (
          <DesignMode mazeData={mazeData} setMazeData={setMazeData} />
        ) : (
          <SimulationMode mazeData={mazeData} setMazeData={setMazeData} />
        )}
      </Stack>
    </Container>
  );
}
