import { CELL } from "../constants.js";
import {
  DR,
  DC,
  tracePath,
  isSafeFromFire,
  isAtBoundary,
} from "./solverUtils.js";

export function iddfsSolve(grid, rows, cols, start, fireDist, fireRate = 1) {
  const size = rows * cols;
  let bestNode = start;
  let bestNodeDist = 0; // Track distance to best node
  let maxSurvival = -1;
  let exitNode = -1;
  let limit = 0;

  // Search state trackers (flat arrays to guarantee zero-allocation hot paths)
  const trace = new Int32Array(size).fill(-1);
  const gScore = new Int32Array(size).fill(2e9);
  const stIdx = new Int32Array(size);
  const stDist = new Int32Array(size);

  // Dirty-tracking buffer to clean up altered nodes without clearing the whole grid
  const modified = new Int32Array(size);
  let modCount = 0;

  // Telemetry logs used for final UI visualization mapping
  const visIdx = new Int32Array(size);
  const visDist = new Int32Array(size);
  let visCount = 0;

  // Memory-safe flat frontier logging
  const frontIdx = new Int32Array(size * 4);
  const frontTick = new Int32Array(size * 4);
  let frontCount = 0;

  // Outer IDDFS iterative deepening loop
  while (limit <= size) {
    // Fast selective state reset based on nodes touched in the previous depth pass
    for (let i = 0; i < modCount; i++) {
      gScore[modified[i]] = 2e9;
      trace[modified[i]] = -1;
    }
    modCount = 0;
    visCount = 0;
    frontCount = 0;

    let fullyExplored = true;
    let maxDepth = 0;

    // Initialize depth stack with the start node
    let ptr = 0;
    stIdx[ptr] = start;
    stDist[ptr] = 0;
    ptr++;

    gScore[start] = 0;
    modified[modCount++] = start;

    // Inner Depth-First Search loop
    while (ptr > 0) {
      ptr--;
      const cur = stIdx[ptr];
      const dist = stDist[ptr];

      // Append node to visualization trail
      visIdx[visCount] = cur;
      visDist[visCount] = dist;
      visCount++;

      maxDepth = Math.max(maxDepth, dist);

      // Continuously track the safest position found in case no exit is reachable
      if (fireDist[cur] > maxSurvival) {
        maxSurvival = fireDist[cur];
        bestNode = cur;
        bestNodeDist = dist;
      }

      // Project 1D array index back to 2D coordinates
      const r = Math.floor(cur / cols);
      const c = cur % cols;

      // Exit condition met
      if (isAtBoundary(r, c, rows, cols)) {
        exitNode = cur;
        break;
      }

      // Cut off exploration if current branch depth hits the IDDFS limit
      if (dist >= limit) {
        fullyExplored = false;
        continue;
      }

      // Evaluate orthogonal neighbors using the optimal default order of DR/DC
      for (let i = 0; i < 4; i++) {
        const nr = r + DR[i];
        const nc = c + DC[i];

        // Bounds checking
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;

        const next = nr * cols + nc;
        if (grid[next] & CELL.WALL) continue;

        const nextDist = dist + 1;

        // Path validation: shorter path discovered, human beats fire, and node is unvisited
        if (
          nextDist < gScore[next] &&
          isSafeFromFire(nextDist, fireDist[next], fireRate) &&
          gScore[next] === 2e9
        ) {
          modified[modCount++] = next; // Flag node for subsequent clearing

          gScore[next] = nextDist;
          trace[next] = cur;
          stIdx[ptr] = next;
          stDist[ptr] = nextDist;
          ptr++;
          fullyExplored = false;

          if (frontCount < frontIdx.length) {
            frontIdx[frontCount] = next;
            frontTick[frontCount] = visCount - 1;
            frontCount++;
          }
        }
      }
    }

    // Terminate early if the exit is found or the graph is fully explored at this depth
    if (exitNode !== -1 || fullyExplored) break;

    limit++;
  }

  // FAILURE: Snap visualization to best node
  if (exitNode === -1 && bestNode !== start) {
    visIdx[visCount] = bestNode;
    visDist[visCount] = bestNodeDist;
    visCount++;
  }

  // Transform flat performance arrays into expected UI object schema exactly once
  const visitedNodesInOrder = new Array(visCount);
  for (let i = 0; i < visCount; i++) {
    visitedNodesInOrder[i] = { idx: visIdx[i], d: visDist[i] };
  }

  const frontierNodesInOrder = new Array(frontCount);
  for (let i = 0; i < frontCount; i++) {
    frontierNodesInOrder[i] = {
      idx: frontIdx[i],
      discoveredAtTick: frontTick[i]
    };
  }

  const isWin = exitNode !== -1;
  return {
    visitedNodesInOrder,
    frontierNodesInOrder,
    path: tracePath(trace, start, isWin ? exitNode : bestNode),
    trace,
    isWin,
  };
}
