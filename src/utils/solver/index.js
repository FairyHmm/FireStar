import { bfsSolve } from "./bfsSolve";
import { aStarSolve } from "./aStarSolve.js";

export const ALGORITHMS = {
  bfs: {
    value: "bfs",
    fn: bfsSolve,
    label: "BFS",
    disabled: false
  },
  astar: {
    value: "astar",
    fn: aStarSolve,
    label: "A*",
    disabled: false
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
