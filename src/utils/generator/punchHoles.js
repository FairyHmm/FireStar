import { CELL } from "../constants.js";

// Carve exits along the 4 borders
export default function punchHoles(grid, rows, cols, getIdx) {
  const minDistance = cols + rows > 30 ? 8 : 4;
  const exitProbability = 0.2;

  const walls = [
    { length: cols, getPos: (i) => [0, i],        dir: [1,  0] }, // Top
    { length: cols, getPos: (i) => [rows - 1, i], dir: [-1, 0] }, // Bottom
    { length: rows, getPos: (i) => [i, 0],        dir: [0,  1] }, // Left
    { length: rows, getPos: (i) => [i, cols - 1], dir: [0, -1] }, // Right
  ];

  for (const { length, getPos, dir: [dr, dc] } of walls) {
    for (let i = 1; i < length - 1; i++) {
      const [r, c] = getPos(i);

      // Check if the cell directly inward is walkable
      if (grid[getIdx(r + dr, c + dc)] & CELL.TILE) {
        if (Math.random() < exitProbability) {
          grid[getIdx(r, c)] = CELL.TILE; // Carve the exit
          i += minDistance; // Enforce spacing
        }
      }
    }
  }
}
