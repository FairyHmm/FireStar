import { CELL, tileSize } from "../utils/constants";

export const attachDrawListener = (bgLayer, toolRef, stateRef, setMazeData) => {
  const handleDraw = (e) => {
    // Only draw on left click
    if (e.button !== 0)
      return;

    const { grid: currentGrid, w, h } = stateRef.current;
    if (currentGrid.length === 0) return;

    const localPos = bgLayer.toLocal(e.global);
    const x = Math.floor(localPos.x / tileSize);
    const y = Math.floor(localPos.y / tileSize);

    if (x < 0 || x >= w || y < 0 || y >= h) return;

    const index = y * w + x;
    const val = currentGrid[index];
    const currentTool = toolRef.current;

    // Cannot place Person/Fire on top of a Wall
    if ((currentTool === 'person' || currentTool === 'fire') && (val & CELL.WALL)) {
      return;
    }

    // Create a copy of the grid
    const newGrid = new Uint8Array(currentGrid);

    if (currentTool === 'person') {
      for (let i = 0; i < w * h; i++)
        if (newGrid[i] & CELL.PERSON)
          newGrid[i] &= ~CELL.PERSON;
      newGrid[index] |= CELL.PERSON;
    }
    else if (currentTool === 'wall')
      newGrid[index] = CELL.WALL;
    else if (currentTool === 'tile')
      newGrid[index] = CELL.TILE;
    else if (currentTool === 'fire')
      newGrid[index] |= CELL.FIRE_CURRENT;

    setMazeData((prev) => ({ ...prev, grid: newGrid }));
  };

  bgLayer.on('pointerdown', handleDraw);

  return () => {
    bgLayer.off('pointerdown', handleDraw);
  };
};
