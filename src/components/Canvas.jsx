import { Center, Box } from "@mantine/core";
import { useCanvas } from "../hooks/useCanvas";

export default function Canvas(props) {
  const containerRef = useCanvas(props);

  return (
    <Center>
      <Box ref={containerRef} />
    </Center>
  );
}
