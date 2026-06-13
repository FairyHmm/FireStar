import { Modal, Text, Button, Grid } from "@mantine/core";
import MetricCard from "./MetricCard";

const STATUS_CONFIG = {
  error: { color: "orange", title: "⚠️ Lỗi cấu hình" },
  won: { color: "teal", title: "🎉 Bạn đã an toàn!" },
  lost: { color: "red", title: "🔥 Bạn đã bị lửa thiêu rụi!" },
};

export default function SimulationResultModal({ opened, onClose, data }) {
  const status = STATUS_CONFIG[data?.status] ?? STATUS_CONFIG.error;

  const METRICS = data
    ? [
        {
          key: "time",
          label: "Thời gian",
          color: "var(--color-primary)",
          primary: data.status === "won" ? data.pathLength : data.simTime,
          secondary: "tick",
        },
        {
          key: "algo",
          label: "Thuật toán",
          color: "var(--color-danger)",
          primary: data.algorithmName,
        },
        {
          key: "coverage",
          label: "Diện tích đã quét",
          color: "var(--color-warning)",
          primary: data.nodesExplored,
          secondaryRaw: data.walkableCell,
          secondaryTemplate: (val) => `/ ${val} ô trống đồ thị`,
          ring: Math.round((data.nodesExplored / data.walkableCell) * 100) || 0,
        },
        {
          key: "efficiency",
          label: "Hiệu suất tìm đường",
          color: "var(--color-success)",
          primary: data.pathLength,
          secondaryRaw: data.nodesExplored,
          secondaryTemplate: (val) => `/ ${val} số ô đã duyệt`,
          ring: Math.round((data.pathLength / data.nodesExplored) * 100) || 0,
          hide: data.status !== "won",
        },
      ]
    : [];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      withCloseButton={false}
      title={
        <Text fw={700} size="xl" c={status.color}>
          {status.title}
        </Text>
      }
      transitionProps={{ transition: "scale" }}
      overlayProps={{ backgroundOpacity: 0.4, blur: 4 }}
      styles={{
        content: { backgroundColor: "var(--color-fg)" },
        header: { backgroundColor: "var(--color-fg)" },
        title: { width: "100%", textAlign: "center" },
      }}
      radius="lg"
      size="lg"
    >
      {data && (
        <Grid grow>
          {data.status === "error" ? (
            <Grid.Col span={12}>
              <Text ta="center" c="var(--color-text-muted)">
                {data.message}
              </Text>
            </Grid.Col>
          ) : (
            METRICS.filter((m) => !m.hide).map((metric) => (
              <Grid.Col key={metric.key} span={{ base: 12, sm: 6 }}>
                <MetricCard metric={metric} isOpened={opened} />
              </Grid.Col>
            ))
          )}
          <Grid.Col span={12}>
            <Button fullWidth onClick={onClose} color={status.color}>
              Xác nhận
            </Button>
          </Grid.Col>
        </Grid>
      )}
    </Modal>
  );
}
