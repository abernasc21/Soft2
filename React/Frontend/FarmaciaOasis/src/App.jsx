import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '@mantine/core';
import Layout from './modules/navbar/navbar';
import Inventario from './modules/inventario-ventas/inventario';
import HistorialVentas from './modules/historial-ventas/historial-ventas';
import { ClientePage } from './modules/cliente/cliente';
import Login from './modules/login/Login';
import { useState, useEffect } from "react";

function App() {
  const [log, setLog] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem("usuario");
    if (u) setLog(true);
  }, []);

  if (!log) {
    return <Login onLogin={() => setLog(true)} />;
  }

  return (
    <Router>
      <AppShell header={{ height: 'max-height' }}>
        <Layout>
          <Routes>
            <Route path="/" element={<Inventario />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/historial-ventas" element={<HistorialVentas />} />
            <Route path="/clientes" element={<ClientePage />} />

            {/* Redirige rutas inexistentes */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </AppShell>
    </Router>
  );
}

export default App;
