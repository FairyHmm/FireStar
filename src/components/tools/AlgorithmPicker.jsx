import { Menu, Button, Stack, Text } from "@mantine/core";

export default function AlgorithmPicker({ algo, setAlgo }) {
  const algos = [
    { value: "bfs", label: "BFS" },
    { value: "astar", label: "A* (Đang cập nhật...)", disabled: true },
    { value: "iddfs", label: "idDFS (Đang cập nhật...)", disabled: true },
    { value: "beam", label: "Beam Search (Đang cập nhật...)", disabled: true },
  ];

  const currentLabel = algos.find((i) => i.value === algo)?.label;

  return (
    <Stack gap={4} w={220}>
      <Text
        size="xs"
        c="dimmed"
        fw={600}
        style={{ textTransform: "uppercase" }}
      >
        Thuật toán tìm đường
      </Text>

      <Menu
        transitionProps={{
          transition: "pop",
          duration: 200,
          exitDuration: 500,
        }}
        position="bottom-end"
        withinPortal
      >
        <Menu.Target>
          <Button
            variant="default"
            size="sm"
            justify="space-between"
            fullWidth
            rightSection={<Text size="xs">▼</Text>}
          >
            {currentLabel}
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          {algos.map((item) => (
            <Menu.Item
              key={item.value}
              disabled={item.disabled}
              onClick={() => setAlgo(item.value)}
              styles={{
                item: {
                  fontWeight: algo === item.value ? 600 : 400,
                  backgroundColor:
                    algo === item.value
                      ? "var(--mantine-color-blue-light)"
                      : "",
                },
              }}
            >
              {item.label}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    </Stack>
  );
}
