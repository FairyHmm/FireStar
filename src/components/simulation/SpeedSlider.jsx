import { useState, useEffect } from "react";
import { Box, Text, Slider, Group } from "@mantine/core";

export default function SpeedSlider({
  value,
  onChange,
  label,
  min = 1,
  max = 100,
  step = 1,
  unit = "",
  marks = [],
  variant,
}) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const getSpeedColor = () => {
    if (!marks || marks.length < 4) return "success";

    if (localValue < marks[1].value) return "success";
    if (localValue < marks[2].value) return "warning";
    return "danger";
  };

  return (
    <Box w={180} ml="md">
      <Group justify="space-between" mb={4}>
        <Text size="xs" fw={700} c="var(--color-text-muted)" lts={0.5}>
          {label}
        </Text>
        <Text
          size="xs"
          fw={700}
          c={`var(--color-${getSpeedColor()})`}
          style={{ transition: ".3s" }}
        >
          {unit === "×" ? `×${localValue.toFixed(2)}` : `${localValue}${unit}`}
        </Text>
      </Group>

      <Slider
        value={localValue}
        onChange={setLocalValue}
        onChangeEnd={onChange}
        min={min}
        max={max}
        step={step}
        size="sm"
        color={`var(--color-${getSpeedColor()}-bg)`}
        label={null}
        marks={marks}
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
