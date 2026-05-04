import { CELL, TOOL_COLORS, tileSize } from "../utils/constants";
export const attachDrawListener = (
  viewport,
  toolRef,
  stateRef,
  setMazeData,
) => {
  const isDrawingRef = { current: false };

  const performDraw = (e) => {
    const { grid: currentGrid, w, h } = stateRef.current;

    // --- DEFENSIVE CHECK ---
    if (!currentGrid || currentGrid.length === 0) return;

    // --- TOOL CHECK ---
    const currentTool = toolRef.current;
    if (!currentTool) return; // Don't draw if no tool selected

    // Get coordinates
    const globalPos = e.data?.global || e.global;
    const localPos = viewport.toLocal(globalPos);
    const x = Math.floor(localPos.x / tileSize);
    const y = Math.floor(localPos.y / tileSize);

    // Boundary Check
    if (x < 0 || x >= w || y < 0 || y >= h) return;

    const index = y * w + x;
    const val = currentGrid[index];

    // Logic: Cannot place Person/Fire on top of a Wall
    if (
      (currentTool === "person" || currentTool === "fire") &&
      val & CELL.WALL
    ) {
      return;
    }

    const newGrid = new Uint8Array(currentGrid);

    if (currentTool === "person") {
      for (let i = 0; i < w * h; i++) {
        if (newGrid[i] & CELL.PERSON) newGrid[i] &= ~CELL.PERSON;
      }
      newGrid[index] |= CELL.PERSON;
    } else if (currentTool === "fire") {
      newGrid[index] |= CELL.FIRE_CURRENT;
    } else if (currentTool === "wall") {
      newGrid[index] = CELL.WALL;
    } else if (currentTool === "tile") {
      newGrid[index] = CELL.TILE;
    }

    setMazeData((prev) => ({ ...prev, grid: newGrid }));
  };

  // --- EVENT HANDLERS ---
  const handleDown = (e) => {
    // ONLY allow Left Click to start drawing
    if (e.button !== 0) return;

    e.stopPropagation();
    e.preventDefault();

    isDrawingRef.current = true;
    performDraw(e); // Draw immediately
  };

  const handleMove = (e) => {
    if (isDrawingRef.current) {
      performDraw(e);
    }
  };

  const handleUp = () => {
    isDrawingRef.current = false;
  };

  // --- ATTACH ---
  viewport.on("pointerdown", handleDown);
  viewport.on("pointermove", handleMove);
  viewport.on("pointerup", handleUp);
  viewport.on("pointerupoutside", handleUp);

  return () => {
    viewport.off("pointerdown", handleDown);
    viewport.off("pointermove", handleMove);
    viewport.off("pointerup", handleUp);
    viewport.off("pointerupoutside", handleUp);
  };
};

export const attachHoverListener = (
  viewport,
  hoverLayer,
  toolRef,
  stateRef,
) => {
  const handleMove = (e) => {
    const currentTool = toolRef.current;

    if (!currentTool) {
      hoverLayer.clear();
      return;
    }

    // Get coordinates
    const localPos = viewport.toLocal(e.data.global || e.global); // Fallback for different PIXI versions
    const x = Math.floor(localPos.x / tileSize);
    const y = Math.floor(localPos.y / tileSize);

    // --- BOUNDARY CHECK ---
    // Get current width/height from the ref
    const { w, h } = stateRef.current;

    // If outside the maze grid, clear highlight and stop
    if (x < 0 || x >= w || y < 0 || y >= h) {
      hoverLayer.clear();
      return;
    }

    // Get color for current tool
    const color = TOOL_COLORS[currentTool];

    // Draw highlight square
    hoverLayer.clear();
    hoverLayer.rect(x * tileSize, y * tileSize, tileSize, tileSize);
    hoverLayer.fill({ color, alpha: 0.5 });
  };

  const handleLeave = () => {
    hoverLayer.clear();
  };

  viewport.on("pointermove", handleMove);
  viewport.on("pointerleave", handleLeave);

  return () => {
    viewport.off("pointermove", handleMove);
    viewport.off("pointerleave", handleLeave);
  };
};
