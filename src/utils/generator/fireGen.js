import { CELL } from "../constants.js";

export default function fireGen(grid, probability = 0.01) {
  for (const [i, cell] of grid.entries()) {
    if (
      cell & CELL.TILE &&
      !(cell & CELL.PERSON) &&
      Math.random() < probability
    ) {
      grid[i] |= CELL.FIRE_CURRENT;
    }
  }
}
