import { useState, useCallback } from "react";
import { ALGORITHMS } from "../utils/generator/index";

export const useDesign = ({ mazeData, setMazeData }) => {
const [activeTool, setActiveTool] = useState("wall");
  const [genAlgoKey, setGenAlgoKey] = useState("dfs");

  // Helper to update grid while ensuring odd dimensions
  const updateMaze = useCallback((w, h, gridFactory) => {
    const width = w | 1;
    const height = h | 1;
    setMazeData({
      w: width,
      h: height,
      grid: gridFactory(width, height)
    });
  }, [setMazeData]);

  const handleGenerate = useCallback(() => {
    const algo = ALGORITHMS[genAlgoKey]?.fn;
    if (!algo) return alert("Algorithm not found");

    updateMaze(mazeData.w, mazeData.h, (w, h) => algo(h, w));
  }, [genAlgoKey, mazeData.w, mazeData.h, updateMaze]);

  const handleReset = useCallback(() => {
    updateMaze(mazeData.w, mazeData.h, (w, h) => new Uint8Array(w * h));
  }, [mazeData.w, mazeData.h, updateMaze]);

  return {
    activeTool,
    setActiveTool,
    genAlgoKey,
    setGenAlgoKey,
    handleGenerate,
    handleReset,
  };
};
