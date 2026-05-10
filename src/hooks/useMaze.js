import { useState, useCallback, useRef } from "react";

export const useMaze = (initial = { w: 31, h: 31 }) => {
  const [mazeData, setMazeData] = useState({
    w: initial.w,
    h: initial.h,
    grid: new Uint8Array(initial.w * initial.h),
  });

  const checkpoint = useRef(new Uint8Array(mazeData.grid));

  const setGrid = useCallback((newData) => {
    setMazeData((prev) => {
      const w = (typeof newData.w === "number" ? newData.w : prev.w) | 1;
      const h = (typeof newData.h === "number" ? newData.h : prev.h) | 1;
      const grid = newData.grid || new Uint8Array(w * h);

      checkpoint.current = new Uint8Array(grid);

      return { w, h, grid };
    });
  }, []);

  const updateGrid = useCallback((newGrid) => {
    setMazeData((prev) => ({ ...prev, grid: newGrid }));
  }, []);

  const saveGrid = useCallback(() => {
    setMazeData((prev) => {
      checkpoint.current = new Uint8Array(prev.grid);
      return prev;
    });
  }, []);

  const revertGrid = useCallback(() => {
    setMazeData((prev) => ({
      ...prev,
      grid: new Uint8Array(checkpoint.current),
    }));
  }, []);

  return {
    state: mazeData,
    actions: {
      setGrid,
      updateGrid,
      saveGrid,
      revertGrid,
    },
  };
};
