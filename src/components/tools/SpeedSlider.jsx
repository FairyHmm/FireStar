import { Box, Text, Slider, Group } from "@mantine/core";

export default function SpeedSlider({ speed, setSpeed }) {
  const getSpeedColor = () => {
    if (speed < 180)
      return "green";
    if (speed < 350)
      return "yellow";
    return "red";
  };

  return (
    <Box w={180} ml="md">
      <Group justify="space-between" mb={4}>
        <Text size="xs" fw={700} c="dimmed" lts={0.5}>
          Tốc độ
        </Text>
        <Text
          size="xs"
          fw={700}
          c={getSpeedColor()}
        >
          {speed}ms
        </Text>
      </Group>

      <Slider
        value={speed}
        onChange={setSpeed}
        min={10}
        max={500}
        step={10}
        size="sm"
        color={getSpeedColor()}
        label={null}
        marks={[{ value: 10 }, { value: 180 }, { value: 350 }, { value: 500 }]}
      />

      <Group justify="space-between" mt={4} px={2}>
        <Text size="xs" fw={800} c="green.8" lts={1}>
          Nhanh
        </Text>
        <Text size="xs" fw={800} c="red.8" lts={1}>
          Chậm
        </Text>
      </Group>
    </Box>
  );
}
