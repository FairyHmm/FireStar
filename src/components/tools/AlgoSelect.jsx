import { Select } from "@mantine/core";

export default function AlgoSelect({ algo, setAlgo }) {
  return (
    <Select
      data={[
        { value: "dfs", label: "DFS (Quay lui)" },
        { value: "bfs", label: "BFS (Đang cập nhật...)", disabled: true },
        { value: "a*", label: "A* (Đang cập nhật...)", disabled: true },
      ]}
      value={algo}
      onChange={setAlgo}
      w={160}
      size="sm"
      allowDeselect={false}
    />
  );
}
