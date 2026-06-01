import { useState, useEffect } from "react";
import { Modal, Stack, Text, Group, Button } from "@mantine/core";

const STATUS_CONFIG = {
  error: { color: "orange", title: "⚠️ Lỗi cấu hình" },
  won: { color: "teal", title: "🎉 Bạn đã an toàn!" },
  lost: { color: "red", title: "🔥 Bạn đã bị lửa thiêu rụi!" },
};

export default function SimulationResultModal({ opened, onClose, data }) {
  const [activeData, setActiveData] = useState(data);

  useEffect(() => {
    if (data) setActiveData(data);
  }, [data]);

  const currentData = data ?? activeData;
  const { color = "orange", title = "" } =
    STATUS_CONFIG[currentData?.status] ?? {};

  const message =
    currentData?.status === "error"
      ? currentData.message
      : currentData
        ? `⏱ Thời gian: ${currentData.simTime} tick
🔍 Số ô đã duyệt: ${currentData.nodesExplored} ô`
        : "";

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      title={
        <Text fw={700} size="lg">
          {title}
        </Text>
      }
      transitionProps={{ transition: "scale" }}
      overlayProps={{ backgroundOpacity: 0.4, blur: 4 }}
      styles={{
        content: { backgroundColor: "var(--color-fg)" },
        header: { backgroundColor: "var(--color-fg)" },
      }}
    >
      <Stack>
        <Text
          size="sm"
          c="var(--color-text)"
          style={{ whiteSpace: "pre-line" }}
        >
          {message}
        </Text>

        <Group justify="flex-end">
          <Button color={color} onClick={onClose}>
            Xác nhận
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
