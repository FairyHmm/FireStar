import { Group } from "@mantine/core";
import MazeSizeInput from "./MazeSizeInput";
import MapPalette from "./MapPalette";
import MazeGeneration from "./MazeGeneration";

export default function DesignTools({ design, mazeData, setMazeData }) {
  return (
    <Group justify="space-between">
      <MazeSizeInput
        w={mazeData.w}
        setW={(w) => setMazeData({ w })}
        h={mazeData.h}
        setH={(h) => setMazeData({ h })}
      />
      <MazeGeneration
        algo={design.genAlgoKey}
        setAlgo={design.setGenAlgoKey}
        onGenerate={design.handleGenerate}
        onReset={design.handleReset}
      />
      <MapPalette activeTool={design.activeTool} setActiveTool={design.setActiveTool} />
    </Group>
  );
}
