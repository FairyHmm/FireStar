import { useState } from 'react';
import { Group, NumberInput, Button, ActionIcon, Tooltip, Stack, Text, Select } from '@mantine/core';

export default function Toolbar({ onRandomise, activeTool, setActiveTool }) {
  const [w, setW] = useState(31);
  const [h, setH] = useState(31);
  const [algo, setAlgo] = useState('dfs'); // Ghi nhớ thuật toán đang chọn

  return (
    <Group p="sm" style={{ backgroundColor: '#2C2E33', borderRadius: '8px' }}>
      {/* Nhập size maze */}
      <Stack gap={2}>
        <Group gap="xs">
          <Text size="xs" fw={700} c="dimmed">W:</Text>
          <NumberInput value={w} onChange={setW} min={5} max={100} w={80} size="xs" />
        </Group>
        <Group gap="xs">
          <Text size="xs" fw={700} c="dimmed">H:</Text>
          <NumberInput value={h} onChange={setH} min={5} max={100} w={80} size="xs" />
        </Group>
      </Stack>

      {/* Chọn thuật toán  */}
      <Group gap="xs">
        <Select
          data={[
            { value: 'dfs', label: 'DFS (Quay lui)' },
            { value: 'bfs', label: 'BFS (Đang cập nhật...)', disabled: true },
            { value: 'a*', label: 'A* (Đang cập nhật...)', disabled: true }
          ]}
          value={algo}
          onChange={setAlgo}
          w={160}
          size="sm"
          allowDeselect={false}
        />
        <Button 
          variant="light" 
          onClick={() => onRandomise(w, h, algo)} // Gửi lên DesignMode
          leftSection="🎲"
        >
          Gen Map
        </Button>
      </Group>

      {/* Tự vẽ map */}
      <Group gap="xs" ml="xl">
        <Tooltip label="Đường">
          <ActionIcon size="lg" variant={activeTool === 'tile' ? 'filled' : 'light'} color="gray" onClick={() => setActiveTool('tile')}>
            ⬜
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Tường">
          <ActionIcon size="lg" variant={activeTool === 'wall' ? 'filled' : 'light'} color="dark" onClick={() => setActiveTool('wall')}>
            ⬛
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Người">
          <ActionIcon size="lg" variant={activeTool === 'person' ? 'filled' : 'light'} color="green" onClick={() => setActiveTool('person')}>
            🧍
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Lửa">
          <ActionIcon size="lg" variant={activeTool === 'fire' ? 'filled' : 'light'} color="red" onClick={() => setActiveTool('fire')}>
            🔥
          </ActionIcon>
        </Tooltip>
      </Group>
    </Group>
  );
}