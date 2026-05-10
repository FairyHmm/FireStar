import { useState, useCallback, useEffect, useRef } from "react";
import { ALGORITHMS } from "../utils/generator/index";

export const useDesign = ({ maze }) => {
  const [activeTool, setActiveTool] = useState("wall");
  const [genAlgoKey, setGenAlgoKey] = useState("dfs");

  const lastState = useRef({ w: 0, h: 0, algo: "" });

  const handleGenerate = useCallback(() => {
    const algo = ALGORITHMS[genAlgoKey]?.fn;
    if (!algo) return alert("Algorithm not found");

    const newGrid = algo(maze.state.h, maze.state.w);
    maze.actions.updateGrid(newGrid);
  }, [genAlgoKey, maze]);

  // --- AUTOMATIC REGENERATION ---
  useEffect(() => {
    const { w, h } = maze.state;
    const { w: lastW, h: lastH, algo: lastAlgo } = lastState.current;

    if (w !== lastW || h !== lastH || genAlgoKey !== lastAlgo) {
      lastState.current = { w, h, algo: genAlgoKey };
      handleGenerate();
    }
  }, [maze.state.w, maze.state.h, genAlgoKey, handleGenerate]);

  const handleReset = useCallback(() => {
    maze.actions.revertToCheckpoint();
  }, [maze]);

  return {
    activeTool,
    setActiveTool,
    genAlgoKey,
    setGenAlgoKey,
    handleGenerate,
    handleReset,
  };
};
