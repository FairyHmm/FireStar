import { Menu, Button, Stack, Text } from "@mantine/core";
import { ALGORITHMS } from "../../utils/solver/index";

export default function AlgorithmPicker({ algoKey = "bfs", setAlgoKey }) {
  const algoList = Object.values(ALGORITHMS);

  const currentConfig =
    algoList.find((i) => i.value === algoKey) || ALGORITHMS.bfs;

  return (
    <Stack gap={4} w={160}>
      <Text
        size="xs"
        c="var(--color-text-muted)"
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
        position="bottom-start"
        withinPortal
        styles={{
          dropdown: {
            backgroundColor: "var(--color-fg)",
          },
        }}
      >
        <Menu.Target>
          <Button
            size="sm"
            justify="space-between"
            fullWidth
            color="var(--color-ac)"
            rightSection={<Text size="xs">▼</Text>}
            style={{ transition: "all 0.2s ease" }}
          >
            {currentConfig.label}
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label c="var(--color-text)">Thuật toán</Menu.Label>
          {algoList.map((item) => (
            <Menu.Item
              key={item.value}
              disabled={item.disabled}
              onClick={() => setAlgoKey(item.value)}
              styles={{
                item: {
                  fontWeight: item.value === algoKey ? 600 : 400,
                  backgroundColor:
                    item.value === algoKey ? "var(--color-primary)" : "",
                  transition: "background-color 0.3s",
                  whiteSpace: "nowrap",
                  "&:hover": {
                    backgroundColor:
                      item.value === algoKey
                        ? "var(--color-primary)"
                        : "var(--color-primary-muted)",
                  },
                },
              }}
              color={
                item.value === algoKey
                  ? "var(--color-primary-muted)"
                  : "var(--color-ac)"
              }
            >
              {item.label} - {item.description}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    </Stack>
  );
}
