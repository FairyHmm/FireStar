import { Group } from "@mantine/core";
import AlgorithmPicker from "./AlgorithmPicker";
import PlaybackControls from "./PlaybackControls";
import SpeedSlider from "./SpeedSlider";

export default function SimulationTools({
  algoKey,
  setAlgoKey,
  isPlaying,
  togglePlay,
  reset,
  speed,
  setSpeed,
}) {
  return (
    <Group justify="space-between">
      <AlgorithmPicker algo={algoKey} setAlgo={setAlgoKey} />
      <PlaybackControls
        isPlaying={isPlaying}
        onPlayPause={togglePlay}
        onReset={reset}
      />
      <SpeedSlider speed={speed} setSpeed={setSpeed} />
    </Group>
  );
}
