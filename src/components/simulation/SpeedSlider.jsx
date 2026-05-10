import { Box, Text, Slider, Group } from "@mantine/core";

export default function SpeedSlider({ speed, setSpeed }) {
  const getSpeedColor = () => {
    if (speed < 180)
      return "success";
    if (speed < 350)
      return "warning";
    return "danger";
  };

  return (
    <Box w={180} ml="md">
      <Group justify="space-between" mb={4}>
        <Text size="xs" fw={700} c="var(--color-text-muted)" lts={0.5}>
          Tốc độ
        </Text>
        <Text
          size="xs"
          fw={700}
          c={`var(--color-${getSpeedColor()}`}
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
        color={`var(--color-${getSpeedColor()}-bg`}
        label={null}
        marks={[{ value: 10 }, { value: 180 }, { value: 350 }, { value: 500 }]}
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
