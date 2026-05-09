import { CELL } from "../constants.js";

export function emptyGen(rows, cols) {
  const size = rows * cols;
  const grid = new Uint8Array(size).fill(CELL.TILE);

  for (let i = 0; i < cols; i++) {
    grid[i] = CELL.WALL; // Top
    grid[(rows - 1) * cols + i] = CELL.WALL; // Bottom
  }

  for (let i = 1; i < rows - 1; i++) {
    grid[i * cols] = CELL.WALL; // Left
    grid[(i + 1) * cols - 1] = CELL.WALL; // Right
  }

  return grid;
}
