import { Group, Stack, Text, NumberInput } from "@mantine/core";

export default function MazeSizeInput({ w, setW, h, setH }) {
  const inputs = [
    { label: "W", value: w, onChange: setW },
    { label: "H", value: h, onChange: setH },
  ];

  return (
    <Stack gap={"8"}>
      {inputs.map(({ label, value, onChange }) => (
        <Group gap="xs" key={label}>
          <Text fw={700} c="var(--color-text-muted)" w={15}>
            {label}:
          </Text>
          <NumberInput
            value={value}
            onChange={onChange}
            min={5}
            max={100}
            w={80}
            stepHoldDelay={500}
            stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
            variant="filled"
            fw={900}
            styles={{
              input: {
                color: "var(--color-text)",
                backgroundColor: "var(--color-primary)",
              },
              control: {
                backgroundColor: "transparent"
              },
            }}
          />
        </Group>
      ))}
    </Stack>
  );
}
