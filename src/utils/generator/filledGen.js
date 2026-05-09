import { CELL } from "../constants.js";

export function filledGen(rows, cols) {
  const size = rows * cols;
  const grid = new Uint8Array(size).fill(CELL.WALL);
  return grid;
}
