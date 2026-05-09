import { Transition } from "@mantine/core";
import classes from "../styles/components/toolbar.module.css";
import DesignTools from "./design/DesignTools";
import SimulationTools from "./simulation/SimulationTools";

export default function Toolbar({ mode, designProps, simulationProps }) {
  return (
    <div className={classes.toolbar}>
      <Transition
        mounted={mode === "design"}
        transition="fade-right"
        duration={500}
        timingFunction="ease"
      >
        {(styles) => (
          <div style={styles} className={classes.panel}>
            <DesignTools {...designProps} />
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
          <div style={styles} className={classes.panel}>
            <SimulationTools {...simulationProps} />
          </div>
        )}
      </Transition>
    </div>
  );
}
