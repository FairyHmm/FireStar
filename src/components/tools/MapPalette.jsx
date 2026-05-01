import { SegmentedControl, Center, Tooltip, Box } from "@mantine/core";

export default function MapPalette({ activeTool, setActiveTool }) {
  const tools = [
    { value: "tile",   icon: "⬜", tooltip: "Đường" },
    { value: "wall",   icon: "⬛", tooltip: "Tường" },
    { value: "person", icon: "🧍", tooltip: "Người" },
    { value: "fire",   icon: "🔥", tooltip: "Lửa" },
  ];

  const segmentedData = tools.map((t) => ({
    value: t.value,
    label: (
      <Tooltip label={t.tooltip} openDelay={200} withArrow position="bottom">
        <Center>
          <Box py={4}>{t.icon}</Box>
        </Center>
      </Tooltip>
    ),
  }));

  return (
    <Box ml="xl">
      <SegmentedControl
        value={activeTool}
        onChange={setActiveTool}
        data={segmentedData}
        radius="md"
        size="sm"
      />
    </Box>
  );
}
