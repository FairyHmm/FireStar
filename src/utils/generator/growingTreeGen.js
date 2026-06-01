import { CELL, DIRS } from "../constants.js";
import punchHoles from "./punchHoles.js";
import fireGen from "./fireGen.js";
import loopGen from "./loopGen.js";

export function growingTreeGen(rows, cols) {
  const size = rows * cols;
  const grid = new Uint8Array(size).fill(CELL.WALL);
  const getIdx = (r, c) => r * cols + c;
  const frontier = [];

  const getStart = (range) => {
    const min = Math.floor(range / 3);
    const max = Math.ceil((range * 2) / 3);
    return (min + Math.floor(Math.random() * (max - min))) | 1;
  };

  const startR = getStart(rows);
  const startC = getStart(cols);

  grid[getIdx(startR, startC)] = CELL.TILE | CELL.PERSON;
  frontier.push({ r: startR, c: startC });

  const dfsBias = 0.8;

  while (frontier.length > 0) {
    const curIdx =
      Math.random() < dfsBias
        ? frontier.length - 1
        : Math.floor(Math.random() * frontier.length);

    const cur = frontier[curIdx];
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
      ) {
        neighbors.push({ r: nr, c: nc, dr, dc });
      }
    }

    if (neighbors.length > 0) {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];

      grid[getIdx(cur.r + next.dr / 2, cur.c + next.dc / 2)] = CELL.TILE;

      grid[getIdx(next.r, next.c)] = CELL.TILE;

      frontier.push({ r: next.r, c: next.c });
    } else {
      frontier[curIdx] = frontier[frontier.length - 1];
      frontier.pop();
    }
  }

  loopGen(grid, rows, cols, getIdx);
  punchHoles(grid, rows, cols, getIdx);
  fireGen(grid);

  return grid;
}
