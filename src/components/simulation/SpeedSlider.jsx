import { useState, useEffect } from "react";
import { Box, Text, Slider, Group } from "@mantine/core";

export default function SpeedSlider({ speed, setSpeed }) {
  const [localSpeed, setLocalSpeed] = useState(speed);

  useEffect(() => {
    setLocalSpeed(speed);
  }, [speed]);

  const getSpeedColor = () => {
    if (localSpeed < 1)
      return "success";
    if (localSpeed < 2)
      return "warning";
    return "danger";
  };

  return (
    <Box w={180} ml="md">
      <Group justify="space-between" mb={4}>
        <Text size="xs" fw={700} c="var(--color-text-muted)" lts={0.5}>
          Tốc độ lửa lan
        </Text>
        <Text
          size="xs"
          fw={700}
          c={`var(--color-${getSpeedColor()})`}
          style={{ transition: ".3s" }}
        >
          x{localSpeed}
        </Text>
      </Group>

      <Slider
        value={localSpeed}
        onChange={setLocalSpeed}
        onChangeEnd={setSpeed}
        min={0.2}
        max={3}
        step={0.2}
        size="sm"
        color={`var(--color-${getSpeedColor()}-bg)`}
        label={null}
        marks={[{ value: 0.2 }, { value: 1 }, { value: 2 }, { value: 3 }]}
        styles={{
          root: {
            transition: "all 0.3s ease",
          },
          track: {
            "--track-bg": "var(--color-ac)",
          },
          bar: {
            transition: "background-color 0.2s ease",
          },
          thumb: {
            borderWidth: "2px",
            transition: "color 0.2s ease",
          },
        }}
      />

      <Group justify="space-between" mt={4} px={2}>
        <Text size="xs" fw={800} c="var(--color-success)" lts={1}>
          Nhanh
        </Text>
        <Text size="xs" fw={800} c="var(--color-danger)" lts={1}>
          Chậm
        </Text>
      </Group>
    </Box>
  );
}
