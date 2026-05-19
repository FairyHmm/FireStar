import { CELL } from "../constants.js";
import { MinHeap } from "./minHeap.js";

const dr = [-1, +1, 0, 0];
const dc = [0, 0, -1, +1];

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
  // lấy Heuristic là khoảng cách từ ô đang xét đến biên gần nhất (trên/dưới/trái/phải)

  const pq = new MinHeap();

  gScore[startIdx] = 0;
  pq.push(startIdx, 0 + getH(startIdx)); 

  while (!pq.isEmpty()) {
    const cur = pq.pop();
    const currentDist = gScore[cur];

    visitedNodesInOrder.push({ idx: cur, d: currentDist });

    const r = Math.floor(cur / cols);
    const c = cur % cols;

    if (r === 0 || r === rows - 1 || c === 0 || c === cols - 1) {
      return {
        visitedNodesInOrder,
        path: tracePath(trace, startIdx, cur)
      };
    }

    for (let i = 0; i < 4; i++) {
      const nr = r + dr[i];
      const nc = c + dc[i];
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      
      const next = nr * cols + nc;

      if (grid[next] & CELL.WALL) continue;

      const humanTime = currentDist + 1;
      const fireArrival = fireDistance[next] / fireRate;

      if (humanTime < fireArrival && humanTime < gScore[next]) {
        gScore[next] = humanTime;
        trace[next] = cur;
        
        const fScore = humanTime + getH(next);
        pq.push(next, fScore);
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