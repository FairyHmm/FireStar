import { Select } from "@mantine/core";

export default function PathAlgoSelect({ algo, setAlgo }) {
  return (
    <Select
      data={[
        { value: "bfs", label: "BFS" },
        { value: "astar", label: "A* (Đang cập nhật...)" },
        { value: "iddfs", label: "idDFS (Đang cập nhật...)" },
        { value: "beam", label: "Beam Search (Đang cập nhật...)" },
      ]}
      value={algo}
      onChange={setAlgo}
      w={220}
      size="sm"
      allowDeselect={false}
      label="Thuật toán tìm đường:"
      labelProps={{
        style: { color: "#C1C2C5", fontSize: "12px", marginBottom: "4px" },
      }}
    />
  );
}
