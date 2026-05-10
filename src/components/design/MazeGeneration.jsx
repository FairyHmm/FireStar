import { Button, Menu, ActionIcon } from "@mantine/core";
import { ALGORITHMS } from "../../utils/generator";

export default function MazeGeneration({ algo, setAlgo, onGenerate }) {
  const algos = Object.values(ALGORITHMS);

  return (
    <Button.Group>
      <Button
        onClick={onGenerate}
        leftSection="🎲"
        color="var(--color-primary)"
        style={{ transition: "all 0.2s ease" }}
      >
        Generate Maze
      </Button>

      <Menu
        transitionProps={{
          transition: "pop",
          duration: 200,
          exitDuration: 500,
        }}
        position="bottom-end"
        withinPortal
        styles={{
          dropdown: {
            backgroundColor: "var(--color-fg)",
          },
        }}
      >
        <Menu.Target>
          <ActionIcon
            size={36}
            style={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              transition: "all 0.2s ease",
            }}
            color="var(--color-primary)"
          >
            ▾
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label c="var(--color-text)">Generation Algorithms</Menu.Label>
          {algos.map((item) => (
            <Menu.Item
              key={item.value}
              disabled={item.disabled}
              onClick={() => setAlgo(item.value)}
              styles={{
                item: {
                  fontWeight: algo === item.value ? 600 : 400,
                  backgroundColor:
                    algo === item.value ? "var(--color-primary)" : "",
                  transition: "background-color 0.3s",
                  "&:hover": {
                    backgroundColor:
                      algo === item.value
                        ? "var(--color-primary)"
                        : "var(--color-primary-muted)",
                  },
                },
              }}
              color={
                algo === item.value
                  ? "var(--color-primary-muted)"
                  : "var(--color-ac)"
              }
            >
              {item.label}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    </Button.Group>
  );
}
