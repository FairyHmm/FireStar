import { useEffect, useRef } from "react";
import { generateRandomMazeDFS } from "../utils/mazeCore";
import { initPixi } from "../pixi/app";
import { renderGrid, syncViewport } from "../pixi/display";
import { attachDrawListener } from "../pixi/events";

export const useCanvas = ({
  mazeData,
  setMazeData,
  triggerRandom,
  activeTool,
}) => {
  const containerRef = useRef(null);
  const instancesRef = useRef(null);

  // Refs to keep imperative logic synced with React props
  const toolRef = useRef(activeTool);
  const stateRef = useRef({
    grid: mazeData.grid,
    w: mazeData.w,
    h: mazeData.h,
  });

  // Sync Tool Ref
  useEffect(() => {
    toolRef.current = activeTool;
  }, [activeTool]);

  // Sync State Ref
  useEffect(() => {
    stateRef.current = { grid: mazeData.grid, w: mazeData.w, h: mazeData.h };
  }, [mazeData]);

  // Initialization & Cleanup
  useEffect(() => {
    let cleanupInteraction;

    const init = async () => {
      const instances = await initPixi(containerRef.current);
      instancesRef.current = instances;

      // Attach drawing events
      cleanupInteraction = attachDrawListener(
        instances.gfx,
        toolRef,
        stateRef,
        setMazeData,
      );

      // Initial Render
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
      } else {
        doRandomise(stateRef.current.w, stateRef.current.h);
      }
    };

    init();

    return () => {
      if (cleanupInteraction) cleanupInteraction();
      if (instancesRef.current) instancesRef.current.destroy();
    };
  }, []);

  // Re-render when grid data changes
  useEffect(() => {
    if (instancesRef.current && mazeData.grid.length > 0) {
      renderGrid(
        instancesRef.current.gfx,
        instancesRef.current.iconContainer,
        mazeData.grid,
        mazeData.w,
        mazeData.h,
      );
    }
  }, [mazeData.grid]);

  // Handle Random Generation Trigger
  useEffect(() => {
    if (instancesRef.current && triggerRandom > 0) {
      doRandomise(mazeData.w, mazeData.h);
      syncViewport(instancesRef.current.viewport, mazeData.w, mazeData.h);
    }
  }, [triggerRandom]);

  // Helper: Generate Random Maze
  const doRandomise = (width, height) => {
    const newGrid = generateRandomMazeDFS(width, height);
    setMazeData({ w: width, h: height, grid: newGrid });
  };

  return containerRef;
};
