import { CELL } from "../constants.js";

export default function loopGen(grid, rows, cols, getIdx, probability = 0.2) {
  const isTile = (r, c) => (grid[getIdx(r, c)] & CELL.TILE) !== 0;

  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      const idx = getIdx(r, c);

      if (!(grid[idx] & CELL.WALL)) continue;
      if (Math.random() >= probability) continue;

      if (isTile(r - 1, c) && isTile(r + 1, c)) {
        grid[idx] = CELL.TILE;
        continue;
      }

      if (isTile(r, c - 1) && isTile(r, c + 1)) grid[idx] = CELL.TILE;
    }
  }
}
