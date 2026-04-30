import * as PIXI from "pixi.js";
import { FLAGS } from "../utils/mazeCore";

const tileSize = 20;

export const renderGrid = (gfx, iconContainer, grid, width, height) => {
  if (!gfx || !iconContainer) return;

  gfx.clear();
  iconContainer.removeChildren();

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const val = grid[y * width + x];

      // Draw Tile/Wall
      gfx.rect(x * tileSize, y * tileSize, tileSize, tileSize);
      gfx.fill({ color: val === FLAGS.WALL ? 0x000000 : 0xffffff });

      // Draw Icons
      if (val === FLAGS.PERSON || val === FLAGS.FIRE_CURRENT) {
        const txt = new PIXI.Text({
          text: val === FLAGS.PERSON ? "🧍" : "🔥",
          style: { fontSize: 16 },
        });
        txt.anchor.set(0.5);
        txt.x = x * tileSize + tileSize / 2;
        txt.y = y * tileSize + tileSize / 2;
        iconContainer.addChild(txt);
      }
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
