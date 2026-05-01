import { useState, useRef, useCallback, useMemo } from "react";
import { initialiseSimulation } from "../utils/simulation/initialiser";
import { calculateGridAtTick } from "../utils/simulation/runner";
import { ALGORITHMS } from "../utils/solver/index";

export const useSimulation = ({ mazeData, setMazeData }) => {
  // --- SIMULATION STATE ---
  const [algoKey, setAlgoKey] = useState("bfs");
  const planRef = useRef(null);

  const algoFn = useMemo(() => {
    const config = ALGORITHMS[algoKey];
    return config?.fn || null;
  }, [algoKey]);

  // --- LOGIC: Initialise (Calculate Plan) ---
  const preparePlan = useCallback(() => {
    try {
      const { grid, w, h } = mazeData;
      const plan = initializeSimulation(grid, w, h, algoFn);
      planRef.current = plan;
      return true;
    } catch (error) {
      alert(error.message);
      return false;
    }
  }, [mazeData, algoFn]);

  // --- LOGIC: Handle Reset ---
  const handleReset = useCallback(() => {
    if (planRef.current) {
      setMazeData((prev) => ({
        ...prev,
        grid: new Uint8Array(planRef.current.originalGrid),
      }));
      planRef.current = null;
    }
  }, [setMazeData]);

  // --- LOGIC: Calculate Grid at specific Tick ---
  const handleTick = useCallback(
    (tick) => {
      // If no plan, initialise on first tick
      if (tick === 0 && !planRef.current) {
        const success = preparePlan();
        if (!success) return;
      }

      if (!planRef.current) return;

      const { w, h } = mazeData;
      const { originalGrid, fireTime, path } = planRef.current;

      const nextGrid = calculateGridAtTick(
        originalGrid,
        fireTime,
        path,
        tick,
        w,
        h,
      );

      setMazeData((prev) => ({ ...prev, grid: nextGrid }));
    },
    [mazeData, preparePlan, setMazeData],
  );

  return {
    algoKey,
    setAlgoKey,
    handleTick,
    handleReset,
  };
};
