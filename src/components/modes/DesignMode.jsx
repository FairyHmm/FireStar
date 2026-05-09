import { useState, useEffect } from "react";
import { Stack, Text } from "@mantine/core";
import Canvas from "../Canvas";
import Toolbar from "../Toolbar";
import MazeSizeInput from "../tools/MazeSizeInput";
import MazeGeneration from "../tools/MazeGeneration";
import MapPalette from "../tools/MapPalette";
import { ALGORITHMS } from "../../utils/generator";

export default function DesignMode({ mazeData, setMazeData }) {
  const [activeTool, setActiveTool] = useState("wall");
  const [h, setH] = useState(31);
  const [w, setW] = useState(31);
  const [algo, setAlgo] = useState("dfs");

  const handleGenerate = () => {
    const generatorFn = ALGORITHMS[algo]?.fn;
    // Force maze sizes to be odd
    const newGrid = generatorFn(h | 1, w | 1);
    setMazeData({ h: h | 1, w: w | 1, grid: newGrid });
  };

  useEffect(() => {
    handleGenerate();
  }, [h, w, algo]);

  return (
    <Stack align="center" mt="md">
      <Toolbar>
        <MazeSizeInput w={w} setW={setW} h={h} setH={setH} />
        <MazeGeneration
          algo={algo}
          setAlgo={setAlgo}
          onGenerate={handleGenerate}
        />
        <MapPalette activeTool={activeTool} setActiveTool={setActiveTool} />
      </Toolbar>

      <Text c="dimmed" size="xs">
        Hướng dẫn: Click chuột trái để vẽ, chuột phải để di chuyển
      </Text>

      <Canvas
        mazeData={mazeData}
        setMazeData={setMazeData}
        activeTool={activeTool}
      />
    </Stack>
  );
}
