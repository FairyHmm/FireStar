import { Button, Group } from "@mantine/core";

export default function SimControls({ isPlaying, onPlayPause, onReset }) {
  return (
    <Group justify="center" my="md">
      <Button.Group>
        <Button
          color={isPlaying ? "orange" : "teal"}
          onClick={onPlayPause}
          style={{ width: 120 }}
        >
          {isPlaying ? "⏸️ Pause" : "▶️ Run"}
        </Button>

        <Button onClick={onReset}>🔄 Reset</Button>
      </Button.Group>
    </Group>
  );
}
