import { useState, useRef, useEffect, useCallback } from "react";

export const usePlayback = ({
  interval,
  onTick, // Function to call every step
  onReset, // Function to call when reset is clicked
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const tickRef = useRef(0);

  // --- ACTIONS ---
  const play = useCallback(() => setIsPlaying(true), []);

  const pause = useCallback(() => setIsPlaying(false), []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    tickRef.current = 0;
    if (onReset) onReset();
  }, [onReset]);

  // --- TIMER LOOP ---
  useEffect(() => {
    if (!isPlaying) return;

    const id = setInterval(() => {
      tickRef.current++;
      if (onTick) onTick(tickRef.current);
    }, interval);

    return () => clearInterval(id);
  }, [isPlaying, interval, onTick]);

  return {
    isPlaying,
    tickRef,
    play,
    pause,
    reset,
  };
};
