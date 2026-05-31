import { bfsSolve } from "./bfsSolve";
import { aStarSolve } from "./aStarSolve.js";

export const ALGORITHMS = {
  bfs: {
    value: "bfs",
    fn: bfsSolve,
    label: "BFS - Tìm kiếm theo chiều rộng",
    disabled: false
  },
  astar: {
    value: "astar",
    fn: aStarSolve,
    label: "A* - Tìm kiếm cực tiểu với tri thức bổ sung",
    disabled: false
  },
  iddfs: {
    value: "iddfs",
    fn: null,
    label: "IDS - Tìm kiếm sâu dần (Đang cập nhật...)",
    disabled: true
  },
  beam: {
    value: "beam",
    fn: null,
    label: "Tìm kiếm chùm cục bộ (Đang cập nhật...)",
    disabled: true
  }
};
