import { Button, Group, Menu, ActionIcon } from "@mantine/core";
// Import the centralized registry config
import { ALGORITHMS } from "../../utils/generator";

export default function MazeGeneration({ algo, setAlgo, onGenerate }) {
  // Convert your config object values into an array for rendering the menu
  const algos = Object.values(ALGORITHMS);

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
                      ? "var(--primary)"
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
