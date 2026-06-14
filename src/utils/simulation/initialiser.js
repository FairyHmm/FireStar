import { CELL } from "../constants";
import { bfsFireSpread } from "../bfsFireSpread";

export const initialiseSimulation = (grid, w, h, algoFn, fireRate = 1) => {
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

  // 1. Tính lưới khoảng cách lửa nguyên thủy (Chưa xét fireRate)
  const fireDistance = bfsFireSpread(grid, h, w, fireStarts);

  // 2. Chạy Thuật toán
  let result = null;
  if (algoFn && typeof algoFn === 'function') {
    result = algoFn(grid, h, w, personStart, fireDistance, fireRate);
  } else {
    throw new Error("Thuật toán này chưa có sẵn.");
  }

  // 3. Return the "Plan"
  return {
    originalGrid: new Uint8Array(grid),
    fireDistance,
    visitedNodesInOrder: result.visitedNodesInOrder,
    frontierNodesInOrder: result.frontierNodesInOrder,
    path: result.path,
    trace: result.trace,
    personStart,
    fireRate,
    isWin: result.isWin
  };
};
