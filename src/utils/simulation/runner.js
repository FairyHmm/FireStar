import { CELL } from "../constants";

export const calculateGridAtTick = (originalGrid, fireTime, path, tick, w, h) => {
  // Start fresh from the original map
  const newGrid = new Uint8Array(originalGrid);

  // 1. Apply Fire
  for (let i = 0; i < newGrid.length; i++) {
    if (fireTime[i] <= tick) {
      newGrid[i] |= CELL.FIRE_CURRENT;
    }
  }

  // 2. Move Person
  let currentPos = -1;
  if (path && path.length > 0) {
    // Move along path
    const pathIndex = Math.min(tick, path.length - 1);
    currentPos = path[pathIndex];
  } else {
    // Fallback: Find person in original (if no path found)
    currentPos = originalGrid.findIndex(val => val & CELL.PERSON);
  }

  // Update Person Position Bit
  if (currentPos !== -1) {
    newGrid[currentPos] |= CELL.PERSON;
  }

  return newGrid;
};
