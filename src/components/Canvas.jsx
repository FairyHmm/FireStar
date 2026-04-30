import { useEffect, useRef } from 'react';
import { Box } from '@mantine/core';
import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { FLAGS, generateRandomMazeDFS } from '../utils/mazeCore';

export default function Canvas({ mazeData, setMazeData, triggerRandom, activeTool, isReadOnly = false }) {
  const containerRef = useRef(null);
  const appRef = useRef(null);
  const gfxRef = useRef(null);
  const viewportRef = useRef(null);
  const iconContainerRef = useRef(null);

  const toolRef = useRef(activeTool);
  const stateRef = useRef({ grid: mazeData.grid, w: mazeData.w, h: mazeData.h });

  const isReadOnlyRef = useRef(isReadOnly);
  useEffect(() => { isReadOnlyRef.current = isReadOnly; }, [isReadOnly]);

  useEffect(() => { toolRef.current = activeTool; }, [activeTool]);

  useEffect(() => {
    stateRef.current = { grid: mazeData.grid, w: mazeData.w, h: mazeData.h };
  }, [mazeData]);

  useEffect(() => {
    const initPixi = async () => {
      const app = new PIXI.Application();
      await app.init({
        width: 800, height: 600,
        backgroundColor: 0x1a1b1e,
        resolution: window.devicePixelRatio || 1,
      });
      
      if (containerRef.current) containerRef.current.appendChild(app.canvas);

      const viewport = new Viewport({
        screenWidth: 800, screenHeight: 600,
        events: app.renderer.events 
      });

      app.stage.addChild(viewport);
      viewport.drag({ mouseButtons: 'right' }).pinch().wheel().decelerate();

      const gfx = new PIXI.Graphics();
      gfx.eventMode = 'static';
      viewport.addChild(gfx);

      const iconContainer = new PIXI.Container();
      iconContainer.eventMode = 'none';
      iconContainer.interactiveChildren = false; 
      viewport.addChild(iconContainer);

      appRef.current = app;
      viewportRef.current = viewport;
      gfxRef.current = gfx;
      iconContainerRef.current = iconContainer;

      gfx.on('pointerdown', (e) => handleDraw(e));

      if (stateRef.current.grid.length > 0) {
        syncViewport(stateRef.current.w, stateRef.current.h);
        renderGrid();
      } else {
        doRandomise(stateRef.current.w, stateRef.current.h);
      }
    };

    initPixi();
    return () => {
      if (appRef.current) {
        appRef.current.destroy(true, { children: true });
        if (containerRef.current) containerRef.current.innerHTML = '';
      }
    };
  }, []);

  const handleDraw = (e) => {
    if (isReadOnlyRef.current) return;
    
    
    const { grid: currentGrid, w, h } = stateRef.current;
    if (currentGrid.length === 0) return;

    const localPos = gfxRef.current.toLocal(e.global);
    const x = Math.floor(localPos.x / 20);
    const y = Math.floor(localPos.y / 20);

    if (x < 0 || x >= w || y < 0 || y >= h) return;

    const index = y * w + x;
    const val = currentGrid[index];
    const currentTool = toolRef.current;
    
    if ((currentTool === 'person' || currentTool === 'fire') && val === FLAGS.WALL) {
      return; 
    }

    const newGrid = new Uint8Array(currentGrid); 
    
    if (currentTool === 'person') {
      for (let i = 0; i < w * h; i++) if (newGrid[i] === FLAGS.PERSON) newGrid[i] = FLAGS.TILE;
      newGrid[index] = FLAGS.PERSON;
    } 
    else if (currentTool === 'wall') newGrid[index] = FLAGS.WALL;
    else if (currentTool === 'tile') newGrid[index] = FLAGS.TILE;
    else if (currentTool === 'fire') newGrid[index] = FLAGS.FIRE_CURRENT;

    setMazeData(prev => ({ ...prev, grid: newGrid }));
  };

  const doRandomise = (width, height) => {
    const newGrid = generateRandomMazeDFS(width, height);
    setMazeData({ w: width, h: height, grid: newGrid });
  };

  const syncViewport = (width, height) => {
    if (viewportRef.current) {
      viewportRef.current.resize(800, 600, width * 20, height * 20);
      viewportRef.current.moveCenter((width * 20) / 2, (height * 20) / 2);
    }
  };

  const renderGrid = () => {
    if (!gfxRef.current || !iconContainerRef.current) return;
    const { grid: currentGrid, w: width, h: height } = stateRef.current;

    const gfx = gfxRef.current;
    const iconContainer = iconContainerRef.current;
    
    gfx.clear();
    iconContainer.removeChildren(); 

    const tileSize = 20;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const val = currentGrid[y * width + x];
        
        gfx.rect(x * tileSize, y * tileSize, tileSize, tileSize);
        gfx.fill({ color: val === FLAGS.WALL ? 0x000000 : 0xffffff });

        if (val === FLAGS.PERSON || val === FLAGS.FIRE_CURRENT) {
          const txt = new PIXI.Text({
            text: val === FLAGS.PERSON ? '🧍' : '🔥',
            style: { fontSize: 16 }
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

  useEffect(() => {
    if (appRef.current && mazeData.grid.length > 0) {
      renderGrid();
    }
  }, [mazeData.grid]);

  useEffect(() => {
    if (appRef.current && triggerRandom > 0) {
      doRandomise(mazeData.w, mazeData.h);
      syncViewport(mazeData.w, mazeData.h);
    }
  }, [triggerRandom]);

  return <Box ref={containerRef} style={{ display: 'flex', justifyContent: 'center', border: '1px solid #373a40', borderRadius: '8px', overflow: 'hidden' }} />;
}