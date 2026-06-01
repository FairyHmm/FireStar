import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { initialiseSimulation } from "../utils/simulation/initialiser";
import { calculateGridAtTick } from "../utils/simulation/runner";
import { ALGORITHMS } from "../utils/solver/index";

export const useSimulation = ({ maze, onSimulationEnd }) => {
  const [algoKey, setAlgoKey] = useState("bfs");
  const [isPlaying, setIsPlaying] = useState(false);
  const [fireSpeed, setFireSpeed] = useState(1);
  const [simSpeed, setSimSpeed] = useState(20);

  const planRef = useRef(null);
  const tickRef = useRef(0);

  const algoFn = useMemo(() => {
    const config = ALGORITHMS[algoKey];
    return config?.fn || null;
  }, [algoKey]);

  const preparePlan = useCallback(() => {
    try {
      const { grid, w, h } = maze.state;
      const plan = initialiseSimulation(grid, w, h, algoFn, fireSpeed);
      planRef.current = plan;

      maze.actions.saveGrid();
      return true;
    } catch (error) {
      if (onSimulationEnd) {
        onSimulationEnd({ status: "error", message: error.message });
      } else {
        alert(error.message);
      }
      return false;
    }
  }, [maze, algoFn, fireSpeed, onSimulationEnd]);

  const handleTick = useCallback(
    (tick) => {
      if (!planRef.current) return;
      const { w, h } = maze.state;

      // Bóc tách dữ liệu trả về từ Runner
      const { newGrid, isFinished, status, simTime } = calculateGridAtTick(
        planRef.current,
        tick,
        w,
        h
      );

      maze.actions.updateGrid(newGrid);

      // NẾU MÔ PHỎNG KẾT THÚC
      if (isFinished) {
        setIsPlaying(false); // Dừng vòng lặp

        const nodesExplored = planRef.current.visitedNodesInOrder.length;

        // Bắn dữ liệu thô ra ngoài thông qua callback
        if (onSimulationEnd) {
          onSimulationEnd({
            status,
            simTime,
            nodesExplored,
          });
        }
      }
    },
    [maze, onSimulationEnd],
  );

  const play = useCallback(() => {
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
      maze.actions.revertGrid();
      planRef.current = null;
    }
  }, [maze]);

  useEffect(() => {
    if (!isPlaying) return;

    const id = setInterval(() => {
      tickRef.current++;
      handleTick(tickRef.current);
    }, simSpeed);

    return () => clearInterval(id);
  }, [isPlaying, handleTick, simSpeed]);

  return {
    algoKey,
    setAlgoKey,
    isPlaying,
    fireSpeed,
    setFireSpeed,
    simSpeed,
    setSimSpeed,
    togglePlay,
    reset,
  };
};
