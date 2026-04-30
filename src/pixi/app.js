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

  const gfx = new PIXI.Graphics();
  gfx.eventMode = "static";
  viewport.addChild(gfx);

  const iconContainer = new PIXI.Container();
  iconContainer.eventMode = "none";
  iconContainer.interactiveChildren = false;
  viewport.addChild(iconContainer);

  const destroy = () => {
    app.destroy(true, { children: true });
    if (container) container.innerHTML = "";
  };

  return { app, viewport, gfx, iconContainer, destroy };
};
