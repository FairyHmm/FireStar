import { CELL } from "../constants.js";
import { DR, DC, tracePath, isSafeFromFire, isAtBoundary } from "./solverUtils.js";

export function beamSolve(grid, rows, cols, startIdx, fireDistance, fireRate = 1) {
  const size = rows * cols;
  const gScore = new Int32Array(size).fill(2e9);
  const trace = new Int32Array(size).fill(-1);
  const visitedNodesInOrder = [];
  
  // Beam Width: Độ rộng của chùm (Mở rộng bao nhiêu node hứa hẹn nhất ở mỗi cấp độ)
  const BEAM_WIDTH = 15; 

  // Heuristic: Khoảng cách ngắn nhất tới 1 trong 4 biên
  const getH = (idx) => {
    const r = Math.floor(idx / cols);
    const c = Math.floor(idx % cols);
    return Math.min(r, rows - 1 - r, c, cols - 1 - c);
  };

  let currentLevel = [startIdx];
  gScore[startIdx] = 0;

  let bestSurvivalNode = startIdx;
  let maxSurvivalTime = -1;

  while (currentLevel.length > 0) {
    const nextLevelMap = new Map();

    for (const cur of currentLevel) {
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

      // Khám phá các hướng
      for (let i = 0; i < 4; i++) {
        const nr = r + DR[i], nc = c + DC[i];
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;

        const next = nr * cols + nc;
        if (grid[next] & CELL.WALL) continue;

        const humanTime = currentDist + 1;
        if (isSafeFromFire(humanTime, fireDistance[next], fireRate) && humanTime < gScore[next]) {
          gScore[next] = humanTime;
          trace[next] = cur;
          
          if (!nextLevelMap.has(next)) {
            nextLevelMap.set(next, getH(next));
          }
        }
      }
    }

    // Sort next level dựa theo heuristic (càng gần mép càng tốt) và cắt lấy top BEAM_WIDTH
    const sortedNextLevel = Array.from(nextLevelMap.entries())
      .sort((a, b) => a[1] - b[1])
      .map(entry => entry[0]);

    currentLevel = sortedNextLevel.slice(0, BEAM_WIDTH);
  }

  // Chạy hết map hoặc bị kẹt
  return { visitedNodesInOrder, path: tracePath(trace, startIdx, bestSurvivalNode), isWin: false };
}