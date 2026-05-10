import { Group } from "@mantine/core";
import AlgorithmPicker from "./AlgorithmPicker";
import PlaybackControls from "./PlaybackControls";
import SpeedSlider from "./SpeedSlider";

export default function SimulationTools({ simulation }) {
  return (
    <Group justify="space-between">
      <AlgorithmPicker
        algo={simulation.algoKey}
        setAlgo={simulation.setAlgoKey}
      />
      <PlaybackControls
        isPlaying={simulation.isPlaying}
        onPlayPause={simulation.togglePlay}
        onReset={simulation.reset}
      />
      <SpeedSlider
        speed={simulation.speed}
        setSpeed={simulation.setSpeed}
      />
    </Group>
  );
}
