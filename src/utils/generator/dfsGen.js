import { CELL, DIRS } from "../constants.js";
import punchHoles from "./punchHoles.js";
import fireGen from "./fireGen.js";

export function dfsGen(rows, cols) {
  const size = rows * cols;
  const grid = new Uint8Array(size).fill(CELL.WALL);
  const getIdx = (r, c) => r * cols + c;
  const stack = [];

  // DFS Generation
  const getStart = (range) => {
    const min = Math.floor(range / 3);
    const max = Math.ceil(range * 2 / 3);
    return (min + Math.floor(Math.random() * (max - min))) | 1;
  };
  const startR = getStart(rows);
  const startC = getStart(cols);

  grid[getIdx(startR, startC)] = CELL.TILE | CELL.PERSON;
  stack.push({ r: startR, c: startC });

  while (stack.length > 0) {
    const cur = stack[stack.length - 1];
    const neighbors = [];

    for (const [dr, dc] of DIRS) {
      const nr = cur.r + dr;
      const nc = cur.c + dc;
      if (
        nr > 0 &&
        nr < rows - 1 &&
        nc > 0 &&
        nc < cols - 1 &&
        grid[getIdx(nr, nc)] & CELL.WALL
      )
        neighbors.push({ r: nr, c: nc, dr, dc });
    }

    if (neighbors.length > 0) {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];

      const wallIdx = getIdx(cur.r + next.dr / 2, cur.c + next.dc / 2);
      const nextIdx = getIdx(next.r, next.c);

      // Carve through the wall and the next cell
      grid[wallIdx] = CELL.TILE;
      grid[nextIdx] = CELL.TILE;

      stack.push({ r: next.r, c: next.c });
    } else {
      stack.pop();
    }
  }

  punchHoles(grid, rows, cols, getIdx);
  fireGen(grid);
  return grid;
}
