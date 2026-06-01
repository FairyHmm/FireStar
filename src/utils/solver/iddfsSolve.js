import { CELL } from "../constants.js";
import {
  DR,
  DC,
  tracePath,
  isSafeFromFire,
  isAtBoundary,
} from "./solverUtils.js";

export function iddfsSolve(
  grid,
  rows,
  cols,
  startIdx,
  fireDistance,
  fireRate = 1,
) {
  const size = rows * cols;
  
  let bestSurvivalNode = startIdx;
  let maxSurvivalTime = -1;
  let bestTrace = new Int32Array(size).fill(-1);
  
  // Khai báo biến giữ kết quả mô phỏng cuối cùng
  let finalVisitedNodes = [];

  const maxDepth = rows * cols;

  //Tăng bước nhảy của limit để giảm số vòng lặp thừa
  for (let limit = 0; limit <= maxDepth; limit += 1) {
    const trace = new Int32Array(size).fill(-1);
    const gScore = new Int32Array(size).fill(2e9);
    
    // Đưa mảng ghi hình vào TRONG vòng lặp để reset sau mỗi lần tăng limit
    const currentVisitedNodes = [];
    
    let foundExit = -1;
    let completelyExplored = true;

    const stack = [{ idx: startIdx, d: 0 }];
    gScore[startIdx] = 0;

    while (stack.length > 0) {
      const { idx: cur, d: currentDist } = stack.pop();
      currentVisitedNodes.push({ idx: cur, d: currentDist });

      if (fireDistance[cur] > maxSurvivalTime) {
        maxSurvivalTime = fireDistance[cur];
        bestSurvivalNode = cur;
        bestTrace = new Int32Array(trace);
      }

      const r = Math.floor(cur / cols);
      const c = cur % cols;

      if (isAtBoundary(r, c, rows, cols)) {
        foundExit = cur;
        bestTrace = new Int32Array(trace);
        break;
      }

      if (currentDist < limit) {
        for (let i = 0; i < 4; i++) {
          const nr = r + DR[i],
            nc = c + DC[i];
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;

          const next = nr * cols + nc;
          if (grid[next] & CELL.WALL) continue;

          const humanTime = currentDist + 1;
          if (
            isSafeFromFire(humanTime, fireDistance[next], fireRate) &&
            humanTime < gScore[next]
          ) {
            gScore[next] = humanTime;
            trace[next] = cur;
            stack.push({ idx: next, d: humanTime });
            completelyExplored = false;
          }
        }
      } else {
        completelyExplored = false;
      }
    }

    // Cập nhật lại kết quả mô phỏng của vòng lặp hiện tại
    finalVisitedNodes = currentVisitedNodes;

    if (foundExit !== -1) {
      return {
        visitedNodesInOrder: finalVisitedNodes,
        path: tracePath(bestTrace, startIdx, foundExit),
        isWin: true,
      };
    }

    if (completelyExplored) {
      break;
    }
  }

  return {
    visitedNodesInOrder: finalVisitedNodes,
    path: tracePath(bestTrace, startIdx, bestSurvivalNode),
    isWin: false,
  };
}