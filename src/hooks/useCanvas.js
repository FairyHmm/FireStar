import { useEffect, useRef } from "react";
import { initPixi } from "../pixi/app";
import { renderGrid, syncViewport } from "../pixi/display";
import { attachDrawListener } from "../pixi/events";

export const useCanvas = ({
  mazeData,
  setMazeData,
  activeTool,
  generatorFn,
}) => {
  // --- 1. SETUP & REFS ---
  const containerRef = useRef(null);
  const instancesRef = useRef(null);

  // Update refs directly
  const toolRef = useRef(activeTool);
  const stateRef = useRef({
    grid: mazeData.grid,
    w: mazeData.w,
    h: mazeData.h,
    algoData: mazeData.algoData,
    entities: mazeData.entities,
  });

  toolRef.current = activeTool;
  stateRef.current = {
    grid: mazeData.grid,
    w: mazeData.w,
    h: mazeData.h,
    algoData: mazeData.algoData,
    entities: mazeData.entities,
  };

  // --- 2. INITIALIZE PIXI & ATTACH LISTENER ---
  useEffect(() => {
    let cleanupInteraction;

    const init = async () => {
      const instances = await initPixi(containerRef.current);
      instancesRef.current = instances;

      // Auto-generate default maze if missing
      if (stateRef.current.grid.length === 0 && generatorFn) {
        const { w, h } = stateRef.current;
        const newGrid = generatorFn(w, h);
        setMazeData({ w, h, grid: newGrid });
      }

      // Attach mouse/drawing events
      cleanupInteraction = attachDrawListener(
        instances.gfx,
        toolRef,
        stateRef,
        setMazeData,
      );

      // Initial Render if data exists
      if (stateRef.current.grid.length > 0) {
        syncViewport(
          instances.viewport,
          stateRef.current.w,
          stateRef.current.h,
        );
        renderGrid(
          instances.gfx,
          instances.iconContainer,
          stateRef.current.grid,
          stateRef.current.w,
          stateRef.current.h,
        );
      }
    };

    init();

    // Prevent memory leaks when the component unmounts
    return () => {
      if (cleanupInteraction) cleanupInteraction();
      if (instancesRef.current) instancesRef.current.destroy();
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, []);

  // --- 3. RE-RENDER ON DATA CHANGE ---
  useEffect(() => {
    if (instancesRef.current && mazeData.grid.length > 0) {
      syncViewport(instancesRef.current.viewport, mazeData.w, mazeData.h);

      renderGrid(
        instancesRef.current.gfx,
        instancesRef.current.iconContainer,
        mazeData.grid,
        mazeData.w,
        mazeData.h,
      );
    }
  }, [mazeData.grid, mazeData.w, mazeData.h]);

  return containerRef;
};
