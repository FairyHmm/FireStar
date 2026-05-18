import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { initialiseSimulation } from "../utils/simulation/initialiser";
import { calculateGridAtTick } from "../utils/simulation/runner";
import { ALGORITHMS } from "../utils/solver/index";

export const useSimulation = ({ maze }) => {
  const [algoKey, setAlgoKey] = useState("bfs");
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const planRef = useRef(null);
  const tickRef = useRef(0);

  const algoFn = useMemo(() => {
    const config = ALGORITHMS[algoKey];
    return config?.fn || null;
  }, [algoKey]);

  // --- LOGIC: Prepare simulation plan ---
  const preparePlan = useCallback(() => {
    try {
      const { grid, w, h } = maze.state;
      const plan = initialiseSimulation(grid, w, h, algoFn, speed);
      planRef.current = plan;

      // Tell maze to save its current state so we can revert later
      maze.actions.saveGrid();
      return true;
    } catch (error) {
      alert(error.message);
      return false;
    }
  }, [maze, algoFn]);

  // --- LOGIC: Calculate Grid at specific Tick ---
  const handleTick = useCallback(
    (tick) => {
      if (!planRef.current) return;

      const { w, h } = maze.state;
      
      const nextGrid = calculateGridAtTick(
        planRef.current,
        tick,
        w,
        h
      );

      maze.actions.updateGrid(nextGrid);
    },
    [maze],
  );

  // --- PLAYBACK CONTROLS ---
  const play = useCallback(() => {
    // If no plan exists, initialize it on play
    if (!planRef.current) {
      const success = preparePlan();
      if (!success) return;
    }
    setIsPlaying(true);
  }, [preparePlan]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    isPlaying ? pause() : play();
  }, [isPlaying, play, pause]);

  const reset = useCallback(() => {
    setIsPlaying(false);
    tickRef.current = 0;

    if (planRef.current) {
      // Revert maze to state before simulation started
      maze.actions.revertGrid();
      planRef.current = null;
    }
  }, [maze]);

  // --- TIMER LOOP ---
  useEffect(() => {
    if (!isPlaying) return;

    const id = setInterval(() => {
      tickRef.current++;
      handleTick(tickRef.current);
    }, 50);

    return () => clearInterval(id);
  }, [isPlaying, speed, handleTick]);

  return {
    algoKey,
    setAlgoKey,
    isPlaying,
    speed,
    setSpeed,
    togglePlay,
    reset,
  };
};
