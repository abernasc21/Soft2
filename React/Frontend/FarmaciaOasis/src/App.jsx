import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppShell } from '@mantine/core';
import Layout from './modules/navbar/navbar';
import Dashboard from './modules/dashboard/Dashboard';
import Inventario from './modules/inventario-ventas/inventario';
import HistorialVentas from './modules/historial-ventas/historial-ventas';
import IngresosEgresos from './modules/ingresos-egresos/ingresos-egresos';
import { ClientePage } from './modules/cliente/cliente';
import { ProveedorPage } from './modules/proveedor/proveedor';

function App() {
  return (
    <Router>
      <AppShell header={{ height: 'max-height' }}>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/historial-ventas" element={<HistorialVentas />} />
            <Route path="/ingresos-egresos" element={<IngresosEgresos />} />
            <Route path="/clientes" element={<ClientePage />} />
            <Route path="/proveedores" element={<ProveedorPage />} />
          </Routes>
        </Layout>
      </AppShell>
    </Router>
  );
}

export default App;