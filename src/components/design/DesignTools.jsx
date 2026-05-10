import { Group } from "@mantine/core";
import MazeSizeInput from "./MazeSizeInput";
import MapPalette from "./MapPalette";
import MazeGeneration from "./MazeGeneration";

export default function DesignTools({
  activeTool,
  setActiveTool,
  mazeData,
  setMazeData,
  genAlgoKey,
  setGenAlgoKey,
  handleGenerate,
  handleReset,
}) {
  return (
    <Group justify="space-between">
      <MazeSizeInput
        w={mazeData.w}
        setW={(w) => setMazeData({ w })}
        h={mazeData.h}
        setH={(h) => setMazeData({ h })}
      />
      <MazeGeneration
        algo={genAlgoKey}
        setAlgo={setGenAlgoKey}
        onGenerate={handleGenerate}
        onReset={handleReset}
      />
      <MapPalette activeTool={activeTool} setActiveTool={setActiveTool} />
    </Group>
  );
}
