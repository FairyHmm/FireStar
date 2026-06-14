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

    // Phase 1a: Draw Explored Nodes
    for (let i = 0; i <= tick; i++) {
      newGrid[visitedNodesInOrder[i].idx] |= CELL.EXPLORED;
    }

    // Phase 1b: Draw Frontier Nodes discovered up to this tick
    if (frontierNodesInOrder) {
      for (let i = 0; i < frontierNodesInOrder.length; i++) {
        const item = frontierNodesInOrder[i];
        if (item.discoveredAtTick <= tick) {
          newGrid[item.idx] |= CELL.FRONTIER;
        }
      }
    }

    // --- FIXED Phase 1c ---
    // Only strip the frontier flag if the node was explored BEFORE the current tick.
    // This allows the "soon to be explored" nodes at the current tick to stay painted!
    for (let i = 0; i < tick; i++) {
      newGrid[visitedNodesInOrder[i].idx] &= ~CELL.FRONTIER;
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
