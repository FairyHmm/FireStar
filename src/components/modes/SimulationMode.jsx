import { useState } from 'react';
import { Stack, Text } from '@mantine/core';
import Canvas from '../Canvas';

export default function SimulationMode({ mazeData }) {
  const [foundPath, setFoundPath] = useState(false);

  return (
    <Stack align="center" mt="md">
      <Text c="dimmed">// TODO: Bổ sung thuật toán tìm đường</Text>
      <Canvas
        mazeData={mazeData}
        foundPath={foundPath}
      />
    </Stack>
  );
}
