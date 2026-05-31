import { Button } from "@mantine/core";

export default function SimControls({ isPlaying, onPlayPause, onReset }) {
  return (
    <Button.Group>
      <Button
        color={
          isPlaying ? "var(--color-warning-bg)" : "var(--color-success-bg)"
        }
        onClick={onPlayPause}
        style={{ width: 120, transition: "all 0.2s ease" }}
      >
        {isPlaying ? "⏸️ Dừng" : "▶️ Chạy"}
      </Button>

      <Button
        color="var(--color-incomplete-bg)"
        onClick={onReset}
        style={{ width: 120, transition: "all 0.2s ease" }}
      >
        🔄 Đặt lại
      </Button>
    </Button.Group>
  );
}
