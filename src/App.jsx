import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import ModeManager from './components/ModeManager';
import '@mantine/core/styles.css';
import './styles/theme.css';

const theme = createTheme({
  primaryColor: 'violet',
});

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <div>
        <ModeManager />
      </div>
    </MantineProvider>
  );
}
