import { useState } from 'react';
import { Stack, Text } from '@mantine/core';
import Canvas from '../Canvas';
import Toolbar from '../Toolbar';
import { generateRandomMazeDFS } from '../../utils/mazeCore';

export default function DesignMode({ mazeData, setMazeData }) {
  const [activeTool, setActiveTool] = useState('wall');

  const handleRandomise = (w, h, algo) => {
    const validW = w % 2 === 0 ? w + 1 : w;
    const validH = h % 2 === 0 ? h + 1 : h;

    // Generate manually when button is clicked
    const newGrid = generateRandomMazeDFS(validW, validH);
    // Update State triggers the Canvas Re-render
    setMazeData({ w: validW, h: validH, grid: newGrid });
  };

  return (
    <Stack align="center" mt="md">
      <Toolbar
        onRandomise={handleRandomise}
        activeTool={activeTool}
        setActiveTool={setActiveTool}
      />
      <Text c="dimmed" size="xs">Hướng dẫn: Click chuột trái để vẽ, chuột phải để di chuyển</Text>

      <Canvas
        mazeData={mazeData}
        setMazeData={setMazeData}
        activeTool={activeTool}
        generatorFn={generateRandomMazeDFS}
      />
    </Stack>
  );
}
