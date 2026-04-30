import { FLAGS } from '../utils/mazeCore';

export const attachDrawListener = (gfx, toolRef, stateRef, setMazeData) => {
  const handleDraw = (e) => {
    const { grid: currentGrid, w, h } = stateRef.current;
    if (currentGrid.length === 0) return;

    const localPos = gfx.toLocal(e.global);
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
      for (let i = 0; i < w * h; i++) {
        if (newGrid[i] === FLAGS.PERSON) newGrid[i] = FLAGS.TILE;
      }
      newGrid[index] = FLAGS.PERSON;
    } else if (currentTool === 'wall') {
      newGrid[index] = FLAGS.WALL;
    } else if (currentTool === 'tile') {
      newGrid[index] = FLAGS.TILE;
    } else if (currentTool === 'fire') {
      newGrid[index] = FLAGS.FIRE_CURRENT;
    }

    setMazeData((prev) => ({ ...prev, grid: newGrid }));
  };

  gfx.on('pointerdown', handleDraw);

  // Return a cleanup function to remove the listener
  return () => {
    gfx.off('pointerdown', handleDraw);
  };
};
