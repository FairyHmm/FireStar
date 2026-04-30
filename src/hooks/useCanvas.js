import { useEffect, useRef } from "react";
import { initPixi } from "../pixi/app";
import {
  renderBaseLayer,
  renderAlgoLayer,
  renderEntityLayer,
  syncViewport,
} from "../pixi/display";
import { attachDrawListener } from "../pixi/events";

export const useCanvas = ({
  mazeData,
  setMazeData,
  activeTool,
  generatorFn,
  foundPath,
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
        instances.bgLayer,
        toolRef,
        stateRef,
        setMazeData,
      );

      // Initial Render if data exists
      if (stateRef.current.grid.length > 0) {
        const { w, h, grid } = stateRef.current;
        syncViewport(instances.viewport, w, h);
        renderBaseLayer(instances.bgLayer, grid, w, h);
        renderAlgoLayer(instances.entityLayer, grid, w, h);
        renderEntityLayer(instances.entityLayer, grid, w, h);
      }
    };

    init();

    // Prevent memory leaks when the component unmounts
    return () => {
      if (cleanupInteraction) cleanupInteraction();
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
        isResize ||
        activeTool === "wall" ||
        activeTool === "tile";

      // 2. Render Algo if: Resizing OR Not found path yet
      const shouldRenderAlgo =
        isResize ||
        !foundPath;

      // 3. Render Entity if: Resizing OR Editing Entity (Person/Fire) OR Have found path
      const shouldRenderEntity =
        isResize ||
        activeTool === "person" ||
        activeTool === "fire" ||
        foundPath;

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
