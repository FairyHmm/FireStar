import { SimpleGrid, Transition } from "@mantine/core";
import DesignTools from "./design/DesignTools";
import SimulationTools from "./simulation/SimulationTools";

export default function Toolbar({
  mode,
  design,
  simulation,
  mazeState,
  setMazeData,
}) {
  return (
    <SimpleGrid
      style={{
        display: "grid",
        gridTemplateAreas: `"stack"`,
        backgroundColor: "var(--color-fg)",
        borderRadius: "8px",
        padding: "1rem",
        overflow: "hidden",
        minHeight: "112px",
        alignItems: "center",
      }}
    >
      <Transition
        mounted={mode === "design"}
        transition="fade-right"
        duration={500}
        timingFunction="ease"
      >
        {(styles) => (
          <div style={{ gridArea: "stack", ...styles }}>
            <DesignTools
              {...design}
              mazeData={mazeState}
              setMazeData={setMazeData}
            />
          </div>
        )}
      </Transition>

      <Transition
        mounted={mode === "simulation"}
        transition="fade-left"
        duration={500}
        timingFunction="ease"
      >
        {(styles) => (
          <div style={{ gridArea: "stack", ...styles }}>
            <SimulationTools {...simulation} />
          </div>
        )}
      </Transition>
    </SimpleGrid>
  );
}
