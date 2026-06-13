import * as PIXI from "pixi.js";
import { CELL, tileSize, getColor } from "../utils/constants";

// --- 1. CORE HELPER ---
// Draws a grid based on a color-logic function provided by the layer.
const drawLayer = (gfx, grid, width, height, mapColor) => {
  if (!gfx) return;
  gfx.clear();

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const val = grid[y * width + x];
      const color = mapColor(val);

      if (color !== undefined) {
        gfx.rect(x * tileSize, y * tileSize, tileSize, tileSize);
        gfx.fill({ color });
      }
    }
  }
};

// --- 2. BASE LAYER (Walls & Tiles) ---
export const renderBaseLayer = (gfx, grid, width, height) => {
  drawLayer(gfx, grid, width, height, (val) => getColor(val & CELL.WALL));

  // Set interaction area for clicks
  if (width > 0 && height > 0) {
    gfx.hitArea = new PIXI.Rectangle(0, 0, width * tileSize, height * tileSize);
  }
};

// --- 3. ALGO LAYER (Overlays) ---
export const renderAlgoLayer = (gfx, grid, width, height) => {
  drawLayer(gfx, grid, width, height, (val) => {
    if (val & (CELL.PATH | CELL.EXPLORED | CELL.FRONTIER | CELL.FIRE_NEXT))
      return getColor(val);
    return undefined;
  });
};

// --- 4. ENTITY LAYER (Person & Fire) ---
export const renderEntityLayer = (gfx, grid, width, height) => {
  drawLayer(gfx, grid, width, height, (val) => {
    if (val & (CELL.PERSON | CELL.FIRE_CURRENT)) return getColor(val);
    return undefined;
  });
};

export const syncViewport = (viewport, width, height) => {
  if (viewport) {
    viewport.resize(800, 600, width * tileSize, height * tileSize);
    viewport.moveCenter((width * tileSize) / 2, (height * tileSize) / 2);
  }
};
