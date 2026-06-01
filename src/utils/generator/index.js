import { dfsGen } from "./dfsGen";
import { filledGen } from "./filledGen";
import { emptyGen } from "./emptyGen";

export const ALGORITHMS = {
  dfs: {
    value: "dfs",
    fn: dfsGen,
    label: "DFS - Tìm kiếm theo chiều sâu (đệ quy quay lui)",
    disabled: false
  },
  filled: {
    value: "filled",
    fn: filledGen,
    label: "Đổ tường toàn bộ",
    disabled: false
  },
  empty: {
    value: "empty",
    fn: emptyGen,
    label: "Trống (có tường bao quanh)",
    disabled: false
  },
};
