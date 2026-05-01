import { Group, Stack, Text, NumberInput } from "@mantine/core";

export default function MazeSizeInput({ w, setW, h, setH }) {
  const inputs = [
    { label: "W", value: w, onChange: setW },
    { label: "H", value: h, onChange: setH },
  ];

  return (
    <Stack gap={2}>
      {inputs.map(({ label, value, onChange }) => (
        <Group gap="xs" key={label}>
          <Text size="xs" fw={700} c="dimmed" w={15}>
            {label}:
          </Text>
          <NumberInput
            value={value}
            onChange={onChange}
            min={5}
            max={100}
            w={80}
            size="xs"
          />
        </Group>
      ))}
    </Stack>
  );
}
