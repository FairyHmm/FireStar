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

  // BIẾN SINH TỒN: Ghi nhớ nơi sống dai nhất
  let bestSurvivalNode = startIdx;
  let maxSurvivalTime = -1;

  while (!pq.isEmpty()) {
    const cur = pq.pop();
    const currentDist = gScore[cur];
    visitedNodesInOrder.push({ idx: cur, d: currentDist });

    // Cập nhật kỷ lục sống sót
    if (fireDistance[cur] > maxSurvivalTime) {
      maxSurvivalTime = fireDistance[cur];
      bestSurvivalNode = cur;
    }

    const r = Math.floor(cur / cols);
    const c = cur % cols;

    // TÌM THẤY LỐI THOÁT -> THẮNG
    if (isAtBoundary(r, c, rows, cols)) {
      return { visitedNodesInOrder, path: tracePath(trace, startIdx, cur), isWin: true };
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
  
  // KHÔNG CÓ LỐI THOÁT -> CHẠY ĐI TRỐN
  return { visitedNodesInOrder, path: tracePath(trace, startIdx, bestSurvivalNode), isWin: false };
}