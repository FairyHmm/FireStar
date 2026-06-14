import { bfsSolve } from "./bfsSolve";
import { aStarSolve } from "./aStarSolve.js";
import { iddfsSolve } from "./iddfsSolve.js";
import { beamSolve } from "./beamSolve.js";

export const ALGORITHMS = {
  bfs: {
    value: "bfs",
    fn: bfsSolve,
    label: "BFS",
    description: "Tìm kiếm theo chiều rộng",
  },
  astar: {
    value: "astar",
    fn: aStarSolve,
    label: "A*",
    description: "Tìm kiếm cực tiểu với tri thức bổ sung",
  },
  iddfs: {
    value: "iddfs",
    fn: iddfsSolve,
    label: "idDFS",
    description: "Tìm kiếm sâu dần",
  },
  beam: {
    value: "beam",
    fn: beamSolve,
    label: "Beam Search",
    description: "Tìm kiếm chùm cục bộ",
  },
};
