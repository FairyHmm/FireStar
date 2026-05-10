import { MantineProvider, createTheme } from "@mantine/core";
import ModeManager from "./components/ModeManager";
import "@mantine/core/styles.css";
import "./theme.css";

const theme = createTheme({
  primaryColor: "violet",
});

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <ModeManager />
    </MantineProvider>
  );
}
