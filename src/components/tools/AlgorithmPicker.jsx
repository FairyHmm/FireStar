import { Menu, Button, Stack, Text } from "@mantine/core";
import { ALGORITHMS } from "../../utils/solver/index";

export default function AlgorithmPicker({ algoKey, setAlgoKey }) {
  // Map the registry object to an array for rendering
  const algoList = Object.values(ALGORITHMS);

  // Find label of currently selected function
  const currentConfig = algoList.find((i) => i.value === algoKey) || ALGORITHMS.bfs;

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
            {currentConfig.label}
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          {algoList.map((item, index) => (
            <Menu.Item
              key={index}
              disabled={item.disabled}
              onClick={() => setAlgo(item.value)}
              styles={{
                item: {
                  fontWeight: item.fn === algoKey ? 600 : 400,
                  backgroundColor:
                    item.fn === algoKey ? "var(--mantine-color-blue-light)" : "",
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
