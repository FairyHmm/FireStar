import { Box } from "@mantine/core";
import { useCanvas } from "../hooks/useCanvas";

export default function Canvas(props) {
  const containerRef = useCanvas(props);

  return <Box ref={containerRef} />;
}
