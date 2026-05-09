import { Box, Text, Slider, Group } from "@mantine/core";
import sClasses from "../../styles/mantine/slider.module.css";

export default function SpeedSlider({ speed, setSpeed }) {
  const getSpeedColor = () => {
    if (speed < 180)
      return "var(--color-success)";
    if (speed < 350)
      return "var(--color-warning)";
    return "var(--color-danger)";
  };

  return (
    <Box w={180} ml="md">
      <Group justify="space-between" mb={4}>
        <Text size="xs" fw={700} c="var(--color-text-muted)" lts={0.5} >
          Tốc độ
        </Text>
        <Text
          size="xs"
          fw={700}
          c={getSpeedColor()}
          style={{ transition: ".3s" }}
        >
          {speed}ms
        </Text>
      </Group>

      <Slider
        value={speed}
        onChange={setSpeed}
        domain={[0, 500]}
        min={10}
        max={500}
        step={10}
        size="sm"
        color={getSpeedColor()}
        label={null}
        marks={[{ value: 10 }, { value: 180 }, { value: 350 }, { value: 500 }]}
        classNames={{
          root: sClasses["slider-root"],
          track: sClasses["slider-track"],
          bar: sClasses["slider-bar"],
          thumb: sClasses["slider-thumb"],
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
