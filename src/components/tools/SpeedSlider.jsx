import { Group, Text, Slider } from '@mantine/core';

export default function SpeedSlider({ speed, setSpeed }) {
  return (
    <Group style={{ width: 350 }}>
      <Text size="sm" weight={600} c="dimmed" style={{ width: 170, flexShrink: 0 }}>
        Tốc độ (ms/bước): {speed}
      </Text>
      <Slider
        value={speed}
        onChange={setSpeed}
        min={10}
        max={500}
        step={10}
        style={{ flex: 1 }}
        color="orange"
        marks={[
          { value: 10, label: "Nhanh" },
          { value: 250, label: "Thường" },
          { value: 500, label: "Chậm" },
        ]}
      />
    </Group>
  );
}