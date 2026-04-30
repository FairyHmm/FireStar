import * as PIXI from "pixi.js";
import { CELL, getColor } from '../utils/constants.js';

const tileSize = 20;

export const renderGrid = (gfx, iconContainer, grid, width, height) => {
  if (!gfx || !iconContainer) return;

  gfx.clear();
  iconContainer.removeChildren();

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const val = grid[y * width + x];

      gfx.rect(x * tileSize, y * tileSize, tileSize, tileSize);
      gfx.fill({ color: getColor(val) });
    }
  }

  gfx.hitArea = new PIXI.Rectangle(0, 0, width * tileSize, height * tileSize);
};

export const syncViewport = (viewport, width, height) => {
  if (viewport) {
    viewport.resize(800, 600, width * tileSize, height * tileSize);
    viewport.moveCenter((width * tileSize) / 2, (height * tileSize) / 2);
  }
};
