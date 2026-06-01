import { SimpleGrid } from "@mantine/core";
import AlgorithmPicker from "./AlgorithmPicker";
import PlaybackControls from "./PlaybackControls";
import SpeedSlider from "./SpeedSlider";

export default function SimulationTools({ simulation }) {
  return (
    <SimpleGrid
      cols={{ base: 1, xs: 2, md: 4 }}
      style={{
        justifyItems: "center",
        alignItems: "end",
      }}
    >
      <AlgorithmPicker
        algoKey={simulation.algoKey}
        setAlgoKey={simulation.setAlgoKey}
      />

      <PlaybackControls
        isPlaying={simulation.isPlaying}
        onPlayPause={simulation.togglePlay}
        onReset={simulation.reset}
      />

      <SpeedSlider
        label="Tốc độ lửa lan"
        value={simulation.fireSpeed}
        onChange={simulation.setFireSpeed}
        min={0.05}
        max={5}
        step={0.05}
        unit="×"
        variant="fire"
        marks={[{ value: 0.1 }, { value: 1 }, { value: 2.5 }, { value: 5 }]}
      />

      <SpeedSlider
        label="Tốc độ mô phỏng"
        value={simulation.simSpeed}
        onChange={simulation.setSimSpeed}
        min={5}
        max={300}
        step={5}
        unit="ms"
        variant="sim"
        marks={[{ value: 5 }, { value: 75 }, { value: 150 }, { value: 300 }]}
      />
    </SimpleGrid>
  );
}
