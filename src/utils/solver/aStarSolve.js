import { CELL } from "../constants.js";
import { MinHeap } from "./minHeap.js";
import { DR, DC, tracePath, isSafeFromFire, isAtBoundary } from "./solverUtils.js";

export function aStarSolve(grid, rows, cols, startIdx, fireDistance, fireRate = 1) {
  const size = rows * cols;
  const gScore = new Int32Array(size).fill(2e9);
  const trace = new Int32Array(size).fill(-1);
  
  // Closed List để đánh dấu các node đã được pop ra khỏi Heap
  const closed = new Uint8Array(size); 
  
  const visitedNodesInOrder = [];

  const getH = (idx) => {
    const r = Math.floor(idx / cols);
    const c = Math.floor(idx % cols);
    return Math.min(r, rows - 1 - r, c, cols - 1 - c);
  };

  const pq = new MinHeap();
  gScore[startIdx] = 0;
  
  //Hệ số Tie-breaker. Đẩy giá trị F lên cao để nhét thêm H vào hàng đơn vị.
  const tieBreaker = 1000;
  pq.push(startIdx, (0 + getH(startIdx)) * tieBreaker + getH(startIdx));

  let bestSurvivalNode = startIdx;
  let maxSurvivalTime = -1;

  while (!pq.isEmpty()) {
    const cur = pq.pop();
    
    // Bỏ qua nếu node này đã được duyệt xong (Tránh xử lý lặp)
    if (closed[cur]) continue;
    closed[cur] = 1;

    const currentDist = gScore[cur];
    visitedNodesInOrder.push({ idx: cur, d: currentDist });

    if (fireDistance[cur] > maxSurvivalTime) {
      maxSurvivalTime = fireDistance[cur];
      bestSurvivalNode = cur;
    }

    const r = Math.floor(cur / cols);
    const c = cur % cols;

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
        
        const h = getH(next);
        const f = humanTime + h;
        
        // Áp dụng Tie-breaker, Khi F bằng nhau, node nào có H nhỏ hơn (gần đích hơn) sẽ có fScore nhỏ hơn và được pop ra trước!
        const fScoreTieBreaked = f * tieBreaker + h; 
        
        pq.push(next, fScoreTieBreaked);
      }
    }
  }
  
  return { visitedNodesInOrder, path: tracePath(trace, startIdx, bestSurvivalNode), isWin: false };
}