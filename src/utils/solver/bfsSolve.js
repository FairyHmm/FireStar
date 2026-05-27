import { CELL } from "../constants.js";
import { DR, DC, tracePath, isSafeFromFire, isAtBoundary } from "./solverUtils.js";

export function bfsSolve(grid, rows, cols, startIdx, fireDistance, fireRate = 1) {
  const size = rows * cols;
  const gScore = new Int32Array(size).fill(2e9);
  const trace = new Int32Array(size).fill(-1);
  const queue = [startIdx];
  let head = 0;

  const visitedNodesInOrder = [];
  gScore[startIdx] = 0;

  while (head < queue.length) {
    const cur = queue[head++];
    const currentDist = gScore[cur];
    visitedNodesInOrder.push({ idx: cur, d: currentDist });

    const r = Math.floor(cur / cols);
    const c = cur % cols;

    if (isAtBoundary(r, c, rows, cols)) {
      return { visitedNodesInOrder, path: tracePath(trace, startIdx, cur) };
    }

    for (let i = 0; i < 4; i++) {
      const nr = r + DR[i], nc = c + DC[i];
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;

      const next = nr * cols + nc;
      if (grid[next] & CELL.WALL) continue;

      const humanTime = currentDist + 1;
      if (gScore[next] === 2e9 && isSafeFromFire(humanTime, fireDistance[next], fireRate)) {
        gScore[next] = humanTime;
        trace[next] = cur;
        queue.push(next);
      }
    }
  }
  return { visitedNodesInOrder, path: null };
}
