import { Button, Group, Menu, ActionIcon } from "@mantine/core";

export default function MazeGeneration({ algo, setAlgo, onGenerate }) {
  const algos = [
    { value: "dfs", label: "DFS (Quay lui)" },
    { value: "bfs", label: "BFS (Updating...)", disabled: true },
    { value: "a*", label: "A* (Updating...)", disabled: true },
  ];

  const currentAlgo = algos.find((a) => a.value === algo);

  return (
    <Group wrap="nowrap" gap={0}>
      {/* Generating Button */}
      <Button
        onClick={onGenerate}
        leftSection="🎲"
        style={{
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        Generate Maze
      </Button>

      {/* Dropdown Menu */}
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
          <ActionIcon
            size={36}
            style={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            }}
          >
            ▾
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Generation Algorithms</Menu.Label>
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
    </Group>
  );
}
