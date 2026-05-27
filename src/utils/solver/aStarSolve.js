import { CELL } from "../constants.js";
import { MinHeap } from "./minHeap.js";
import { DR, DC, tracePath, isSafeFromFire, isAtBoundary } from "./solverUtils.js";

export function aStarSolve(grid, rows, cols, startIdx, fireDistance, fireRate = 1) {
  const size = rows * cols;
  const gScore = new Int32Array(size).fill(2e9);
  const trace = new Int32Array(size).fill(-1);
  const visitedNodesInOrder = [];

  const getH = (idx) => {
    const r = Math.floor(idx / cols);
    const c = Math.floor(idx % cols);
    return Math.min(r, rows - 1 - r, c, cols - 1 - c);
  };

  const pq = new MinHeap();
  gScore[startIdx] = 0;
  pq.push(startIdx, 0 + getH(startIdx));

  while (!pq.isEmpty()) {
    const cur = pq.pop();
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
      if (isSafeFromFire(humanTime, fireDistance[next], fireRate) && humanTime < gScore[next]) {
        gScore[next] = humanTime;
        trace[next] = cur;
        pq.push(next, humanTime + getH(next));
      }
    }
  }
  return { visitedNodesInOrder, path: null };
}
