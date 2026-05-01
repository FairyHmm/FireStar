import { bfsSolve } from "./bfsSolve";

export const ALGORITHMS = {
  bfs: {
    value: "bfs",
    fn: bfsSolve,
    label: "BFS",
    disabled: false
  },
  astar: {
    value: "astar",
    fn: null,
    label: "A* (Đang cập nhật...)",
    disabled: true
  },
  iddfs: {
    value: "iddfs",
    fn: null,
    label: "idDFS (Đang cập nhật...)",
    disabled: true
  },
  beam: {
    value: "beam",
    fn: null,
    label: "Beam Search (Đang cập nhật...)",
    disabled: true
  }
};
