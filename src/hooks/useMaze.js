import { useState, useCallback, useRef } from "react";

export const useMaze = (initial = { w: 31, h: 31 }) => {
  const [mazeData, setMazeData] = useState({
    w: initial.w,
    h: initial.h,
    grid: new Uint8Array(initial.w * initial.h),
  });

  // The "Design Mode" source of truth for reverts
  const checkpoint = useRef(new Uint8Array(mazeData.grid));

  const setGrid = useCallback((newData, saveCheckpoint = true) => {
    setMazeData((prev) => {
      // Use provided values or fall back to previous state
      const w = (newData.w !== undefined ? newData.w : prev.w) | 1;
      const h = (newData.h !== undefined ? newData.h : prev.h) | 1;

      // If a grid is provided, use it; otherwise, if dimensions changed, create new blank
      let grid = newData.grid;
      if (!grid) {
        grid = new Uint8Array(w * h);
      }

      if (saveCheckpoint) {
        checkpoint.current = new Uint8Array(grid);
      }

      return { w, h, grid };
    });
  }, []);

  const updateCell = useCallback((idx, value) => {
    setMazeData((prev) => {
      const nextGrid = new Uint8Array(prev.grid);
      nextGrid[idx] = value;
      return { ...prev, grid: nextGrid };
    });
  }, []);

  const revert = useCallback(() => {
    setMazeData((prev) => ({
      ...prev,
      grid: new Uint8Array(checkpoint.current),
    }));
  }, []);

  return {
    state: mazeData,
    actions: {
      setGrid,
      updateCell,
      revert,
    },
  };
};
