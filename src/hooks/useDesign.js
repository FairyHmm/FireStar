import { useState, useCallback, useEffect, useRef } from "react";
import { ALGORITHMS } from "../utils/generator/index";

export const useDesign = ({ mazeData, updateGrid }) => {
  const [activeTool, setActiveTool] = useState("wall");
  const [genAlgoKey, setGenAlgoKey] = useState("dfs");

  // Track state to prevent infinite loops from the updateGrid/updateGrid calls
  const lastState = useRef({ w: 0, h: 0, algo: "" });

  const handleGenerate = useCallback(() => {
    const algo = ALGORITHMS[genAlgoKey]?.fn;
    if (!algo) return alert("Algorithm not found");

    const newGrid = algo(mazeData.h, mazeData.w);
    updateGrid(newGrid);
  }, [genAlgoKey, mazeData.w, mazeData.h, updateGrid]);

  // --- AUTOMATIC REGENERATION ---
  useEffect(() => {
    handleGenerate();
  }, [mazeData.w, mazeData.h, genAlgoKey, handleGenerate]);

  return {
    activeTool,
    setActiveTool,
    genAlgoKey,
    setGenAlgoKey,
    handleGenerate,
  };
};
