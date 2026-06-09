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

  const renderContent = () => {
    if (!currentData) return null;

    if (currentData.status === "error") {
      return (
        <Text size="sm" c="var(--color-text)" ta="center" style={{ whiteSpace: "pre-line" }}>
          {currentData.message}
        </Text>
      );
    }

    return (
      <Stack align="center" gap={32} py="sm">
        {/* KHỐI THỜI GIAN */}
        <Stack align="center" gap={8}>
          <Text size="sm" fw={700} c="var(--color-text-muted)" tt="uppercase" lts={1}>
            Thời gian ⏱ 
          </Text>
          <Group gap="sm" align="center">
            <Text 
              fz={64} 
              fw={900} 
              c="var(--color-warning)" 
              lh={1} 
              style={{ textShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
            >
              {currentData.simTime}
            </Text>
            <Text 
              fz="sm" 
              fw={800} 
              c="var(--color-warning)" 
              bg="var(--color-bg)" 
              px="md" 
              py={6} 
              style={{ borderRadius: "100px", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)" }}
              tt="uppercase" 
              lts={2}
            >
              Tick
            </Text>
          </Group>
        </Stack>

        {/* KHỐI SỐ Ô ĐÃ DUYỆT */}
        <Stack align="center" gap={8}>
          <Text size="sm" fw={700} c="var(--color-text-muted)" tt="uppercase" lts={1}>
            Số ô đã duyệt 🔍 
          </Text>
          <Group gap="sm" align="center">
            <Text 
              fz={64} 
              fw={900} 
              c="var(--color-incomplete)" 
              lh={1} 
              style={{ textShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
            >
              {currentData.nodesExplored}
            </Text>
            <Text 
              fz="sm" 
              fw={800} 
              c="var(--color-incomplete)" 
              bg="var(--color-bg)" 
              px="md" 
              py={6} 
              style={{ borderRadius: "100px", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)" }}
              tt="uppercase" 
              lts={2}
            >
              Ô
            </Text>
          </Group>
        </Stack>
      </Stack>
    );
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      title={
        <Text 
          fw={900} 
          fz={28} 
          c={color} 
          ta="center" 
          style={{ 
            width: "100%", 
            letterSpacing: "0.5px",
            textShadow: "0 2px 8px rgba(0,0,0,0.2)"
          }}
        >
          {title}
        </Text>
      }
      transitionProps={{ transition: "scale" }}
      overlayProps={{ backgroundOpacity: 0.4, blur: 4 }}
      styles={{
        content: { backgroundColor: "var(--color-fg)" },
        header: { backgroundColor: "var(--color-fg)" },
        title: { width: "100%", textAlign: "center" }
      }}
    >
      <Stack gap="xl">
        {renderContent()}

        <Button 
          color={color} 
          onClick={onClose} 
          size="md" 
          radius="md" 
          fullWidth
        >
          Xác nhận
        </Button>
      </Stack>
    </Modal>
  );
}