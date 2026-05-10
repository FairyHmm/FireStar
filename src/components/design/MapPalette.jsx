import { SegmentedControl, Tooltip, Box } from "@mantine/core";

export default function MapPalette({ activeTool, setActiveTool }) {
  const tools = [
    { value: "tile", icon: "⬜", tooltip: "Đường" },
    { value: "wall", icon: "⬛", tooltip: "Tường" },
    { value: "person", icon: "🧍", tooltip: "Người" },
    { value: "fire", icon: "🔥", tooltip: "Lửa" },
  ];

  const segmentedData = tools.map((t) => ({
    value: t.value,
    label: (
      <Tooltip
        label={t.tooltip}
        withArrow
        position="bottom"
        color={"var(--color-primary-muted)"}
        transitionProps={{ transition: "scale", duration: 200 }}
      >
        <Box py={4}>{t.icon}</Box>
      </Tooltip>
    ),
  }));

  return (
    <SegmentedControl
      value={activeTool}
      onChange={setActiveTool}
      data={segmentedData}
      size="xl"
      color={"var(--color-primary)"}
      withItemsBorders={false}
      style={{ backgroundColor: "var(--color-ac)" }}
    />
  );
}
