import { CELL } from "../constants.js";
import {
  DR,
  DC,
  tracePath,
  isSafeFromFire,
  isAtBoundary,
} from "./solverUtils.js";

export function bfsSolve(
  grid,
  rows,
  cols,
  startIdx,
  fireDistance,
  fireRate = 1,
) {
  const size = rows * cols;
  const gScore = new Int16Array(size).fill(0x7fff);
  const trace = new Int16Array(size).fill(-1);
  const queue = [startIdx];
  let head = 0;

  const visitedNodesInOrder = [];
  const frontierNodesInOrder = [];
  gScore[startIdx] = 0;

  // BIẾN SINH TỒN: Ghi nhớ nơi sống dai nhất
  let bestSurvivalNode = startIdx;
  let maxSurvivalTime = -1;

  while (head < queue.length) {
    const cur = queue[head++];
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
      return {
        visitedNodesInOrder,
        frontierNodesInOrder,
        path: tracePath(trace, startIdx, cur),
        trace,
        isWin: true,
      };
    }

    for (let i = 0; i < 4; i++) {
      const nr = r + DR[i],
        nc = c + DC[i];
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;

      const next = nr * cols + nc;
      if (grid[next] & CELL.WALL) continue;

      const humanTime = currentDist + 1;
      if (
        gScore[next] === 0x7fff &&
        isSafeFromFire(humanTime, fireDistance[next], fireRate)
      ) {
        gScore[next] = humanTime;
        trace[next] = cur;
        queue.push(next);
        frontierNodesInOrder.push({ idx: next, discoveredAtTick: head - 1 });
      }
    }
  }

  // KHÔNG CÓ LỐI THOÁT -> CHẠY ĐI TRỐN
  return {
    visitedNodesInOrder,
    frontierNodesInOrder,
    path: tracePath(trace, startIdx, bestSurvivalNode),
    trace,
    isWin: false,
  };
}
