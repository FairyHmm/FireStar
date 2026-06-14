import { CELL } from "../constants";

export const calculateGridAtTick = (plan, tick, w, h) => {
  const {
    originalGrid,
    fireDistance,
    visitedNodesInOrder,
    frontierNodesInOrder,
    path,
    personStart,
    fireRate,
    isWin,
  } = plan;
  const newGrid = new Uint8Array(originalGrid);

  newGrid[personStart] &= ~CELL.PERSON;

  let simTime = 0;
  let isFinished = false;
  let status = "running";

  if (tick < visitedNodesInOrder.length) {
    simTime = 0;

    // Track the last timeline tick index where a node was either explored or queued
    const lastExploredTick = new Int16Array(w * h).fill(-1);
    const lastFrontierTick = new Int16Array(w * h).fill(-1);
    const activeNodeIdx = visitedNodesInOrder[tick].idx;

    // 1. Record all historical explorations up to the current tick frame
    for (let i = 0; i <= tick; i++) {
      const nodeIdx = visitedNodesInOrder[i].idx;
      newGrid[nodeIdx] |= CELL.EXPLORED;
      lastExploredTick[nodeIdx] = i; // Save the latest frame index it was explored
    }

    // 2. Record all frontier discoveries up to the current tick frame
    if (frontierNodesInOrder) {
      for (let i = 0; i < frontierNodesInOrder.length; i++) {
        const item = frontierNodesInOrder[i];
        if (item.discoveredAtTick <= tick) {
          lastFrontierTick[item.idx] = item.discoveredAtTick; // Save the latest frame index it was queued
        }
      }
    }

    // 3. Compare timelines for every grid slot to determine the final bit state
    for (let i = 0; i < newGrid.length; i++) {
      if (i === activeNodeIdx)
        // The active node being popped right now must drop its frontier tag
        newGrid[i] &= ~CELL.FRONTIER;
      else if (lastFrontierTick[i] > lastExploredTick[i])
        // If it was queued MORE RECENTLY than it was explored, the frontier flag wins
        newGrid[i] |= CELL.FRONTIER;
      else
        // Otherwise, the exploration is more recent, so clear any stale frontier tags
        newGrid[i] &= ~CELL.FRONTIER;
    }

    // Draw path from current explored node back to start
    if (plan.trace) {
      let currentIdx = activeNodeIdx;

      while (currentIdx !== personStart && plan.trace[currentIdx] !== -1) {
        newGrid[currentIdx] |= CELL.PATH;
        currentIdx = plan.trace[currentIdx];
      }
      newGrid[personStart] |= CELL.PATH;
    }

    newGrid[personStart] |= CELL.PERSON;
  } else {
    // Phase 2: Running the found path
    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      newGrid[visitedNodesInOrder[i].idx] |= CELL.EXPLORED;
    }

    const runTick = tick - visitedNodesInOrder.length;
    simTime = runTick;

    if (path && path.length > 0) {
      for (let i = 0; i < path.length; i++) {
        newGrid[path[i]] |= CELL.PATH;
      }

      const pathIndex = Math.min(runTick, path.length - 1);
      newGrid[path[pathIndex]] |= CELL.PERSON;

      if (runTick >= path.length - 1) {
        if (plan.isWin) {
          isFinished = true;
          status = "won";
        } else {
          const currentPos = path[pathIndex];
          const isBurned = fireDistance[currentPos] <= simTime / fireRate;

          if (isBurned || simTime > 2000) {
            isFinished = true;
            status = "lost";
          }
        }
      }
    } else {
      newGrid[personStart] |= CELL.PERSON;
      const isBurned = fireDistance[personStart] <= simTime / fireRate;

      if (isBurned || simTime > 2000) {
        isFinished = true;
        status = "lost";
      }
    }
  }

  // Draw fire state based on current simulation time
  for (let i = 0; i < newGrid.length; i++) {
    if (fireDistance[i] <= simTime / fireRate) {
      newGrid[i] |= CELL.FIRE_CURRENT;
    }
  }

  return { newGrid, isFinished, status, simTime };
};
