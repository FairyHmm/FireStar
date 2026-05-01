import { useState } from "react";
import { Stack, Text, Group } from "@mantine/core";
import Canvas from "../Canvas";
import Toolbar from "../Toolbar";
import MazeSizeInput from "../tools/MazeSizeInput";
import MazeGeneration from "../tools/MazeGeneration";
import MapPalette from "../tools/MapPalette";
import { dfsGen } from "../../utils/generator/dfsGen";

export default function DesignMode({ mazeData, setMazeData }) {
  const [activeTool, setActiveTool] = useState("wall");
  const [w, setW] = useState(31);
  const [h, setH] = useState(31);
  const [algo, setAlgo] = useState("dfs");

  const handleRandomise = () => {
    const validW = w % 2 === 0 ? w + 1 : w;
    const validH = h % 2 === 0 ? h + 1 : h;

    const newGrid = dfsGen(validW, validH);
    setMazeData({ w: validW, h: validH, grid: newGrid });
  };

  return (
    <Stack align="center" mt="md">
      <Toolbar>
        <MazeSizeInput w={w} setW={setW} h={h} setH={setH} />
        <MazeGeneration
          algo={algo}
          setAlgo={setAlgo}
          onGenerate={handleRandomise}
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
        generatorFn={dfsGen}
      />
    </Stack>
  );
}
