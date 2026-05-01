import { CELL } from "../constants";
import { bfsFireSpread } from "../bfsFireSpread";
import { bfsSolve } from "../solver/bfsSolve";

export const initialiseSimulation = (grid, w, h, algoName) => {
  const size = w * h;
  const fireStarts = [];
  let personStart = -1;

  // 1. Scan for Start Positions
  for (let i = 0; i < size; i++) {
    if (grid[i] & CELL.FIRE_CURRENT) fireStarts.push(i);
    if (grid[i] & CELL.PERSON) personStart = i;
  }

  if (personStart === -1) {
    throw new Error("Sếp quên đặt nhân vật vào map rồi!");
  }

  // 2. Run Algorithms
  const fireTime = bfsFireSpread(grid, h, w, fireStarts);

  let path = null;
  if (algoName === "bfs") {
    path = bfsSolve(grid, h, w, personStart, fireTime);
  } else if (algoName === "astar") {
    // Placeholder for future A*
    throw new Error("A* đang cập nhật");
  }

  // 3. Return the "Plan"
  return {
    originalGrid: new Uint8Array(grid),
    fireTime,
    path
  };
};
