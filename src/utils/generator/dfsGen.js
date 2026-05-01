import { CELL } from "../constants.js";

export function dfsGen(rows, cols) {
  const size = rows * cols;
  const grid = new Uint8Array(size).fill(CELL.WALL);
  const getIdx = (r, c) => r * cols + c;
  const stack = [];

  // 1. Core DFS Generation
  let startR = Math.floor(Math.random() * ((rows - 1) / 2)) * 2 + 1;
  let startC = Math.floor(Math.random() * ((cols - 1) / 2)) * 2 + 1;

  grid[getIdx(startR, startC)] &= ~CELL.WALL;
  grid[getIdx(startR, startC)] |= CELL.TILE;
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

  // 2. Punching Holes (Exit Generation)
  const possibleExits = [];

  // Scan horizontal borders (Top and Bottom)
  for (let c = 1; c < cols - 1; c += 2) {
    // Top border: if cell at (1, c) is a tile, the wall at (0, c) is a candidate
    if (grid[getIdx(1, c)] & CELL.TILE) possibleExits.push(getIdx(0, c));
    // Bottom border
    if (grid[getIdx(rows - 2, c)] & CELL.TILE)
      possibleExits.push(getIdx(rows - 1, c));
  }

  // Scan vertical borders (Left and Right)
  for (let r = 1; r < rows - 1; r += 2) {
    if (grid[getIdx(r, 1)] & CELL.TILE) possibleExits.push(getIdx(r, 0));
    if (grid[getIdx(r, cols - 2)] & CELL.TILE)
      possibleExits.push(getIdx(r, cols - 1));
  }

  // Randomize candidate exits
  possibleExits.sort(() => Math.random() - 0.5);

  // Determine how many holes to punch (e.g., 2 to 5)
  const numExits = Math.floor(Math.random() * 4) + 2;
  const actualExits = Math.min(numExits, possibleExits.length);

  for (let i = 0; i < actualExits; i++) {
    const exitIdx = possibleExits[i];
    grid[exitIdx] &= ~CELL.WALL;
    grid[exitIdx] |= CELL.TILE;
  }

  return grid;
}
