import { useEffect, useRef } from "react";
import { initPixi } from "../pixi/app";
import {
  renderBaseLayer,
  renderAlgoLayer,
  renderEntityLayer,
  syncViewport,
} from "../pixi/display";
import { attachDrawListener, attachHoverListener } from "../pixi/events";

export const useCanvas = ({
  mazeData,
  setMazeData,
  activeTool,
  generatorFn,
  isReadOnly,
}) => {
  // --- 1. SETUP & REFS ---
  const containerRef = useRef(null);
  const instancesRef = useRef(null);
  const toolRef = useRef(activeTool);
  const stateRef = useRef({
    grid: mazeData.grid,
    w: mazeData.w,
    h: mazeData.h,
  });

  toolRef.current = activeTool;
  stateRef.current = {
    grid: mazeData.grid,
    w: mazeData.w,
    h: mazeData.h,
  };

  const dimRef = useRef({ w: mazeData.w, h: mazeData.h });

  // --- 2. INITIALIZE PIXI & ATTACH LISTENER ---
  useEffect(() => {
    let cleanupInteraction;
    let cleanupHover;

    const init = async () => {
      const instances = await initPixi(containerRef.current);
      instancesRef.current = instances;

      if (!stateRef.current.grid || stateRef.current.grid.length === 0) {
        if (generatorFn) {
          const newGrid = generatorFn(mazeData.w, mazeData.h);
          setMazeData({ w: mazeData.w, h: mazeData.h, grid: newGrid });
        }
      }

      // Auto-generate default maze if missing
      if (stateRef.current.grid.length === 0 && generatorFn) {
        const { w, h } = stateRef.current;
        const newGrid = generatorFn(w, h);
        setMazeData({ w, h, grid: newGrid });
      }

      // Attach mouse/drawing events
      cleanupInteraction = attachDrawListener(
        instances.viewport,
        toolRef,
        stateRef,
        setMazeData,
      );

      // Attach Hover Highlight
      cleanupHover = attachHoverListener(
        instances.viewport,
        instances.hoverLayer,
        toolRef,
        stateRef,
      );

      // Initial Render if data exists
      if (stateRef.current.grid.length > 0) {
        const { w, h, grid } = stateRef.current;
        syncViewport(instances.viewport, w, h);
        renderBaseLayer(instances.bgLayer, grid, w, h);
        renderAlgoLayer(instances.algoLayer, grid, w, h);
        renderEntityLayer(instances.entityLayer, grid, w, h);
      }
    };

    init();

    // Prevent memory leaks when the component unmounts
    return () => {
      if (cleanupInteraction) cleanupInteraction();
      if (cleanupHover) cleanupHover();
      if (instancesRef.current) instancesRef.current.destroy();
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [generatorFn, setMazeData]);

  // --- 3. RE-RENDER ON DATA CHANGE ---
  useEffect(() => {
    if (instancesRef.current && mazeData.grid.length > 0) {
      const { bgLayer, algoLayer, entityLayer, viewport } =
        instancesRef.current;
      const { grid, w, h } = mazeData;

      const { w: prevW, h: prevH } = dimRef.current;
      const isResize = w !== prevW || h !== prevH;

      // 1. Render Background if: Resizing OR Editing Base Layer (Wall/Tile)
      const shouldRenderBase =
        isResize || activeTool === "wall" || activeTool === "tile";

      // 2. Render Algo if: Resizing OR Not found path yet
      const shouldRenderAlgo = isResize || !isReadOnly;

      // 3. Render Entity if: Resizing OR Editing OR Have found path
      const shouldRenderEntity = isResize || activeTool || isReadOnly;

      // --- EXECUTE RENDER ---
      if (shouldRenderBase) renderBaseLayer(bgLayer, grid, w, h);
      if (shouldRenderAlgo) renderAlgoLayer(algoLayer, grid, w, h);
      if (shouldRenderEntity) renderEntityLayer(entityLayer, grid, w, h);

      // Update dimension tracker
      dimRef.current = { w, h };
    }
  }, [mazeData.grid, mazeData.w, mazeData.h]);

  return containerRef;
};
