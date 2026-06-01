import { Box, Transition } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import DesignTools from "./design/DesignTools";
import SimulationTools from "./simulation/SimulationTools";

export default function Toolbar({
  mode,
  design,
  simulation,
  mazeState,
  setMazeData,
}) {
  const { ref, height } = useElementSize();

  const isDesign = mode === "design";
  const isSim = mode === "simulation";

  return (
    <Box
      bg="var(--color-fg)"
      p="md"
      style={{
        borderRadius: "8px",
        overflow: "hidden",
        height: height > 0 ? `${height}px` : "auto",
        boxSizing: "content-box",
        transition: "height 0.35s ease-in-out",
      }}
    >
      <div
        ref={ref}
        style={{
          width: "100%",
          display: "grid",
          gridTemplateAreas: '"stack"',
        }}
      >
        <Transition mounted={isDesign} transition="fade-right" duration={350}>
          {(styles) => (
            <div style={{ gridArea: "stack", ...styles }}>
              <DesignTools
                design={design}
                mazeData={mazeState}
                setMazeData={setMazeData}
              />
            </div>
          )}
        </Transition>

        <Transition mounted={isSim} transition="fade-left" duration={350}>
          {(styles) => (
            <div style={{ gridArea: "stack", ...styles }}>
              <SimulationTools simulation={simulation} />
            </div>
          )}
        </Transition>
      </div>
    </Box>
  );
}
