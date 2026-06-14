import { CELL } from "../constants.js";
import { MinHeap } from "./minHeap.js";
import {
  DR,
  DC,
  tracePath,
  isSafeFromFire,
  isAtBoundary,
} from "./solverUtils.js";
import { createHeuristic } from "./heuristic.js";

export function beamSolve(
  grid,
  rows,
  cols,
  startIdx,
  fireDistance,
  fireRate = 1,
) {
  const size = rows * cols;
  const gScore = new Int32Array(size).fill(2e9);
  const trace = new Int32Array(size).fill(-1);
  const closed = new Uint8Array(size);
  const visitedNodesInOrder = [];
  const frontierNodesInOrder = [];

  // Beam Width: Độ rộng của chùm (Mở rộng bao nhiêu node hứa hẹn nhất ở mỗi cấp độ)
  const BEAM_WIDTH = 15;

  const getH = createHeuristic(grid, rows, cols);

  let pq = new MinHeap();
  gScore[startIdx] = 0;

  const tieBreaker = 1000;
  pq.push(startIdx, (0 + getH(startIdx)) * tieBreaker + getH(startIdx));

  let bestSurvivalNode = startIdx;
  let maxSurvivalTime = -1;

  while (!pq.isEmpty()) {
    const cur = pq.pop();

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
      return {
        visitedNodesInOrder,
        frontierNodesInOrder,
        path: tracePath(trace, startIdx, cur),
        trace,
        isWin: true,
      };
    }

    let neighborsAdded = false;
    // Calculate the current active tick index based on our historical records array
    const currentTickIndex = visitedNodesInOrder.length - 1;

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

        const h = getH(next);
        const f = humanTime + h;
        const fScoreTieBreaked = f * tieBreaker + h;

        pq.push(next, fScoreTieBreaked);

        // --- FIXED: Push the newly staged node onto the frontier collection ---
        frontierNodesInOrder.push({
          idx: next,
          discoveredAtTick: currentTickIndex,
        });

        neighborsAdded = true;
      }
    }

    // --- OPTIMIZED BEAM GUARD ---
    // Direct access to pq.data.length cuts out the tracking array overhead
    if (neighborsAdded && pq.data.length > BEAM_WIDTH) {
      // Sort the underlying heap data array directly by fScore
      pq.data.sort((a, b) => a.fScore - b.fScore);

      // Keep only the best candidates
      const survivors = pq.data.slice(0, BEAM_WIDTH);

      // Create a clean heap and swap out the old data array
      pq = new MinHeap();
      for (let j = 0; j < survivors.length; j++) {
        pq.push(survivors[j].idx, survivors[j].fScore);
      }

      // Fast lookup dictionary for valid survivor node keys
      const survivorSet = new Set(survivors.map(s => s.idx));

      // --- FIXED: Loop backwards to safely remove pruned items from the timeline ---
      for (let k = frontierNodesInOrder.length - 1; k >= 0; k--) {
        const item = frontierNodesInOrder[k];

        // If it was added during this current tick but dropped by the beam width limit, splice it out
        if (item.discoveredAtTick === currentTickIndex && !survivorSet.has(item.idx)) {
          frontierNodesInOrder.splice(k, 1);
        }
      }
    }
  }

  // FAILURE: Snap to best survival node
  if (bestSurvivalNode !== startIdx) {
    visitedNodesInOrder.push({ idx: bestSurvivalNode, d: gScore[bestSurvivalNode] });
  }

  return {
    visitedNodesInOrder,
    frontierNodesInOrder,
    path: tracePath(trace, startIdx, bestSurvivalNode),
    trace,
    isWin: false,
  };
}
