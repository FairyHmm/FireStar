/**
 * Thuật toán tìm đường sinh tồn (sử dụng BFS)
 * Đầu vào:
 * - grid: mảng bản đồ (0: Trống, 1: Tường)
 * - startIdx: Index 1D vị trí xuất phát của nhân vật
 * - fireTime: bản đồ lửa lan lấy từ hàm fireSpread_bfs
 * Đầu ra: Mảng các index 1D tạo thành đường đi hoàn chỉnh, hoặc null nếu kẹt.
 */

import { CELL } from "../constants.js";

const dr = [-1, +1, 0, 0];
const dc = [0, 0, -1, +1];

export function bfsSolve(grid, rows, cols, startIdx, fireDistance, fireRate = 1) {
  const size = rows * cols;
  const gScore = new Int32Array(size).fill(2e9);
  const trace = new Int32Array(size).fill(-1);
  const queue = [];
  let head = 0;

  const visitedNodesInOrder = [];

  gScore[startIdx] = 0;
  queue.push(startIdx);

  while (head < queue.length) {
    const cur = queue[head++];
    const currentDist = gScore[cur];

    // Lưu lại node đang xét và khoảng cách (thời gian) để đồng bộ với lửa lan
    visitedNodesInOrder.push({ idx: cur, d: currentDist });

    const r = Math.floor(cur / cols);
    const c = cur % cols;

    if (r === 0 || r === rows - 1 || c === 0 || c === cols - 1){
      return {
        visitedNodesInOrder,
        path: tracePath(trace, startIdx, cur)
      };
    }
    // Điều kiện chiến thắng: đã đứng ở bất kỳ ô trống nào ở rìa của bản đồ

    for (let i = 0; i < 4; i++) {
      const nr = r + dr[i];
      const nc = c + dc[i];
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      const next = nr * cols + nc;

      if (grid[next] === CELL.WALL) continue;

      const humanTime = currentDist + 1;
      const fireArrival = fireDistance[next] / fireRate;

      if (gScore[next] === 2e9 && humanTime < fireArrival) {
        gScore[next] = humanTime;
        trace[next] = cur;
        queue.push(next);
      }
    }
  }
  return { visitedNodesInOrder, path: null };
}

function tracePath(trace, startIdx, endIdx) {
  const path = [];
  let cur = endIdx;
  while (cur !== startIdx) {
    path.push(cur);
    cur = trace[cur];
  }
  path.push(startIdx);
  return path.reverse();
}
