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
  const visitedNodesInOrder = [];

  let bestSurvivalNode = startIdx;
  let maxSurvivalTime = -1;
  let bestTrace = new Int32Array(size).fill(-1);

  // Giới hạn độ sâu tối đa (bằng tổng số ô)
  const maxDepth = rows * cols;

  for (let limit = 0; limit <= maxDepth; limit++) {
    const trace = new Int32Array(size).fill(-1);
    const gScore = new Int32Array(size).fill(2e9);
    let foundExit = -1;
    let completelyExplored = true;

    // Stack lưu trạng thái DFS: { idx, d }
    const stack = [{ idx: startIdx, d: 0 }];
    gScore[startIdx] = 0;

    while (stack.length > 0) {
      const { idx: cur, d: currentDist } = stack.pop();
      visitedNodesInOrder.push({ idx: cur, d: currentDist });

      // Lưu lại vị trí sống sót lâu nhất phòng trường hợp không có đường ra
      if (fireDistance[cur] > maxSurvivalTime) {
        maxSurvivalTime = fireDistance[cur];
        bestSurvivalNode = cur;
        bestTrace = new Int32Array(trace);
      }

      const r = Math.floor(cur / cols);
      const c = cur % cols;

      // Tìm thấy lối thoát
      if (isAtBoundary(r, c, rows, cols)) {
        foundExit = cur;
        bestTrace = new Int32Array(trace);
        break;
      }

      // Chỉ mở rộng nhánh nếu chưa chạm tới giới hạn độ sâu (limit) của vòng lặp này
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
        // Vẫn còn các node có thể đi tiếp ở độ sâu lớn hơn
        completelyExplored = false;
      }
    }

    if (foundExit !== -1) {
      return {
        visitedNodesInOrder,
        path: tracePath(bestTrace, startIdx, foundExit),
        isWin: true,
      };
    }

    // Nếu toàn bộ bản đồ đã được duyệt xong ở độ sâu này mà không tìm thấy đường thoát
    // (nghĩa là không còn node nào bị chặn bởi limit nữa), thì dừng lại để tiết kiệm tài nguyên.
    if (completelyExplored) {
      break;
    }
  }

  // Kịch bản sinh tồn (Không tìm thấy đường ra)
  return {
    visitedNodesInOrder,
    path: tracePath(bestTrace, startIdx, bestSurvivalNode),
    isWin: false,
  };
}
