import { bfsSolve } from "./bfsSolve";
import { aStarSolve } from "./aStarSolve.js";

export const ALGORITHMS = {
  bfs: {
    value: "bfs",
    fn: bfsSolve,
    label: "BFS",
    description: "Tìm kiếm theo chiều rộng",
    disabled: false
  },
  astar: {
    value: "astar",
    fn: aStarSolve,
    label: "A*",
    description: "Tìm kiếm cực tiểu với tri thức bổ sung",
    disabled: false
  },
  iddfs: {
    value: "iddfs",
    fn: null,
    label: "idDPS",
    description: "Tìm kiếm sâu dần",
    disabled: true
  },
  beam: {
    value: "beam",
    fn: null,
    label: "Beam Search",
    description: "Tìm kiếm chùm cục bộ",
    disabled: true
  }
};
