import { CELL } from "../constants";

export const calculateGridAtTick = (plan, tick, w, h) => {
  const {
    originalGrid,
    fireDistance,
    visitedNodesInOrder,
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
    // Phase 1: Exploration
    for (let i = 0; i <= tick; i++) {
      newGrid[visitedNodesInOrder[i].idx] |= CELL.EXPLORED;
    }

    // Draw path from current explored node back to start
    if (plan.trace) {
      let currentIdx = visitedNodesInOrder[tick].idx;

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

    // REMOVED: The logic that clears the path (newGrid[i] &= ~CELL.PATH)
    // We now keep the path drawn and just move the person on it.

    if (path && path.length > 0) {
      // CHANGE: Draw the FULL path immediately so it stays visible
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

  for (let i = 0; i < newGrid.length; i++) {
    if (fireDistance[i] <= simTime / fireRate) {
      newGrid[i] |= CELL.FIRE_CURRENT;
    }
  }

  return { newGrid, isFinished, status, simTime };
};
