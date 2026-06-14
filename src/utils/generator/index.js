import { dfsGen } from "./dfsGen";
import { growingTreeGen } from "./growingTreeGen";
import { filledGen } from "./filledGen";
import { emptyGen } from "./emptyGen";

export const ALGORITHMS = {
  dfs: {
    value: "dfs",
    fn: dfsGen,
    label: "DFS - Đệ quy quay lui",
  },
  tree: {
    value: "tree",
    fn: growingTreeGen,
    label: "Growing Tree - Mê cung nhiều nhánh",
  },
  filled: {
    value: "filled",
    fn: filledGen,
    label: "Filled - Đổ tường toàn bộ",
  },
  empty: {
    value: "empty",
    fn: emptyGen,
    label: "Empty - Trống với tường bao",
  },
};
