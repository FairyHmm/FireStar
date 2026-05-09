import { dfsGen } from "./dfsGen";
import { filledGen } from "./filledGen";
import { emptyGen } from "./emptyGen";

export const ALGORITHMS = {
  dfs: {
    value: "dfs",
    fn: dfsGen,
    label: "DFS",
    disabled: false
  },
  filled: {
    value: "filled",
    fn: filledGen,
    label: "Filled",
    disabled: false
  },
  empty: {
    value: "empty",
    fn: emptyGen,
    label: "Empty",
    disabled: false
  },
};
