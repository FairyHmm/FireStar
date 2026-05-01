import { Group, Button } from "@mantine/core";

export default function SimControls({ isPlaying, onPlayPause, onReset }) {
  return (
    <Group>
      <Button
        color={isPlaying ? "red" : "teal"}
        onClick={onPlayPause}
        size="sm"
      >
        {isPlaying ? "⏸ Tạm dừng" : "▶ Bắt đầu chạy"}
      </Button>
      <Button variant="default" onClick={onReset} size="sm">
        🔄 Đặt lại
      </Button>
    </Group>
  );
}
