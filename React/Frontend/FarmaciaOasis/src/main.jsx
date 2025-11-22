// main.jsx o index.jsx - ARCHIVO PRINCIPAL
import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import App from './App';

// IMPORTAR ESTILOS DE MANTINE
import '@mantine/core/styles.css';

//IMPORTAR FUENTE
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/700.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <App />
    </MantineProvider>
  </React.StrictMode>
);