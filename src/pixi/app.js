import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";

export const initPixi = async (container) => {
  const app = new PIXI.Application();
  await app.init({
    width: 800,
    height: 600,
    backgroundColor: 0xffffff,
    resolution: window.devicePixelRatio || 1,
  });

  if (container) container.appendChild(app.canvas);

  const viewport = new Viewport({
    screenWidth: 800,
    screenHeight: 600,
    events: app.renderer.events,
  });

  app.stage.addChild(viewport);
  viewport.drag({ mouseButtons: "right-middle" }).pinch().wheel().decelerate();

  // Layer 1: Background (Walls & Tiles)
  const bgLayer = new PIXI.Graphics();
  bgLayer.eventMode = "static"; // Catches clicks
  viewport.addChild(bgLayer);

  // Layer 2: Algorithm (Explored, Path, Predictions)
  const algoLayer = new PIXI.Graphics();
  algoLayer.eventMode = "none";
  viewport.addChild(algoLayer);

  // Layer 3: Entities (Person, Fire)
  const entityLayer = new PIXI.Graphics();
  entityLayer.eventMode = "none";
  viewport.addChild(entityLayer);

  const destroy = () => {
    app.destroy(true, { children: true });
    if (container) container.innerHTML = "";
  };

  return { app, viewport, bgLayer, algoLayer, entityLayer, destroy };
};
