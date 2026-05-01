import { Group, Tooltip, ActionIcon } from '@mantine/core';

export default function DrawTools({ activeTool, setActiveTool }) {
  return (
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
  );
}