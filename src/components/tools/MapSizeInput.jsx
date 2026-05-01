import { Group, Stack, Text, NumberInput } from "@mantine/core";

export default function MapSizeInput({ w, setW, h, setH }) {
  return (
    <Stack gap={2}>
      <Group gap="xs">
        <Text size="xs" fw={700} c="dimmed">
          W:
        </Text>
        <NumberInput
          value={w}
          onChange={setW}
          min={5}
          max={100}
          w={80}
          size="xs"
        />
      </Group>
      <Group gap="xs">
        <Text size="xs" fw={700} c="dimmed">
          H:
        </Text>
        <NumberInput
          value={h}
          onChange={setH}
          min={5}
          max={100}
          w={80}
          size="xs"
        />
      </Group>
    </Stack>
  );
}
