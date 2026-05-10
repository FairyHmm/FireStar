import { SegmentedControl, Group } from "@mantine/core";

export default function ModeSwitcher({ mode, onModeChange }) {
  return (
    <Group justify="flex-end">
      <SegmentedControl
        value={mode}
        onChange={onModeChange}
        data={[
          { label: "✏️ Xây dựng", value: "design" },
          { label: "🚀 Mô phỏng", value: "simulation" },
        ]}
        styles={(theme) => ({
          root: {
            backgroundColor: "var(--color-fg)",
            borderRadius: "var(--radius-lg)",
          },
          indicator: {
            backgroundColor: "var(--color-primary)",
            borderRadius: "var(--radius-md)",
          },
          label: {
            transition: "color 0.4s ease",
            padding: "8px 12px",
            margin: "2px",
          },
        })}
      />
    </Group>
  );
}
