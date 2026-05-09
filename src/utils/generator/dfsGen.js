import { CELL } from "../constants.js";
import punchHoles from './punchHoles.js';

export function dfsGen(rows, cols) {
  const size = rows * cols;
  const grid = new Uint8Array(size).fill(CELL.WALL);
  const getIdx = (r, c) => r * cols + c;
  const stack = [];

  // DFS Generation
  let startR = Math.floor(Math.random() * ((rows - 1) / 2)) * 2 + 1;
  let startC = Math.floor(Math.random() * ((cols - 1) / 2)) * 2 + 1;

  grid[getIdx(startR, startC)] = CELL.TILE | CELL.PERSON;
  stack.push({ r: startR, c: startC });

  const dr = [-2, 2, 0, 0];
  const dc = [0, 0, -2, 2];

  while (stack.length > 0) {
    const cur = stack[stack.length - 1];
    const neighbors = [];

    for (let i = 0; i < 4; i++) {
      const nr = cur.r + dr[i];
      const nc = cur.c + dc[i];
      if (nr > 0 && nr < rows - 1 && nc > 0 && nc < cols - 1) {
        if (!(grid[getIdx(nr, nc)] & CELL.TILE)) {
          neighbors.push({ r: nr, c: nc, dirIdx: i });
        }
      }
    }

    if (neighbors.length > 0) {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      const wallR = cur.r + dr[next.dirIdx] / 2;
      const wallC = cur.c + dc[next.dirIdx] / 2;

      // Carve through the wall and the next cell
      [getIdx(wallR, wallC), getIdx(next.r, next.c)].forEach((idx) => {
        grid[idx] &= ~CELL.WALL;
        grid[idx] |= CELL.TILE;
      });

      stack.push({ r: next.r, c: next.c });
    } else {
      stack.pop();
    }
  }

  return punchHoles(grid, rows, cols, getIdx);;
}
