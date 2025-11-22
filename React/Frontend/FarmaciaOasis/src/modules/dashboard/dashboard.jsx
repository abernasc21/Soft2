import { useState } from 'react';
import { useDashboard } from './hooks/useDashboard';
import { 
  Container, 
  Grid, 
  Group, 
  Button, 
  LoadingOverlay,
  Alert
} from '@mantine/core';
import { useMediaQuery } from 'react-responsive';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import ProductosBajosModal from './components/ProductosBajosModal';
import ProductosVencerModal from './components/ProductosVencerModal';
import VentasChart from './components/VentasChart';
import TopProductos from './components/TopProductos';
import './dashboard.css';

/**
 * Componente principal del Dashboard
 * Integra todos los componentes y maneja el estado global
 */
function Dashboard() {
  const {
    metricas,
    productosBajos,
    productosPorVencer,
    ventasMensuales,
    topProductos,
    loading,
    error,
    calcularPorcentaje,
    determinarTendencia
  } = useDashboard();

  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  
  const [mostrarBajos, setMostrarBajos] = useState(false);
  const [mostrarVencer, setMostrarVencer] = useState(false);

  // Estados de carga y error
  if (loading) {
    return (
      <Container size="xl" py="md">
        <LoadingOverlay visible />
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="xl" py="md">
        <Alert color="red" title="Error" variant="filled">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container 
      size={isMobile ? "sm" : isTablet ? "md" : "xl"}
      py="md" 
      className="dashboard-main-container"
    >
      {/* Header con notificaciones */}
      <Header 
        productosBajos={productosBajos}
        productosPorVencer={productosPorVencer}
      />

      {/* Grid de métricas principales */}
      <Grid mt="xl">
        <Grid.Col span={isMobile ? 12 : isTablet ? 6 : 4}>
          <MetricCard
            valor={metricas.totalHoy}
            etiqueta="Total de Hoy"
            sufijo="Bs"
            color="#034C8C"
            porcentaje={calcularPorcentaje(metricas.totalHoy, metricas.totalAyer)}
            tendencia={determinarTendencia(metricas.totalHoy, metricas.totalAyer)}
          />
        </Grid.Col>
        <Grid.Col span={isMobile ? 12 : isTablet ? 6 : 4}>
          <MetricCard
            valor={metricas.productosVendidos}
            etiqueta="Productos Vendidos"
            color="#04BFBF"
            porcentaje={calcularPorcentaje(metricas.productosVendidos, metricas.productosAyer)}
            tendencia={determinarTendencia(metricas.productosVendidos, metricas.productosAyer)}
          />
        </Grid.Col>
        <Grid.Col span={isMobile ? 12 : isTablet ? 6 : 4}>
          <MetricCard
            valor={metricas.ventasHoy}
            etiqueta="Ventas Hoy"
            color="#ABB4B2"
            porcentaje={calcularPorcentaje(metricas.ventasHoy, metricas.ventasAyer)}
            tendencia={determinarTendencia(metricas.ventasHoy, metricas.ventasAyer)}
          />
        </Grid.Col>
      </Grid>

      {/* Sección de gráfica y ranking de productos */}
      <Grid mt="xl">
        <Grid.Col span={{ base: 12, lg: isMobile ? 12 : isTablet ? 8 : 8 }}>
          <VentasChart data={ventasMensuales} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: isMobile ? 12 : isTablet ? 4 : 4 }}>
          <TopProductos productos={topProductos} />
        </Grid.Col>
      </Grid>

      {/* Botones para abrir modales de alertas */}
      <Group 
        className="dashboard-buttons-container" 
        mt="xl" 
        justify="center"
        direction={isMobile ? "column" : "row"}
        gap={isMobile ? "md" : "xl"}
      >
        <Button 
          size={isMobile ? "sm" : "md"}
          variant="gradient"
          gradient={{ from: 'blue', to: 'cyan', deg: 135 }}
          leftSection="⚠️"
          onClick={() => setMostrarBajos(true)}
          className="dashboard-button"
          fullWidth={isMobile}
          disabled={productosBajos.length === 0}
        >
          {isMobile ? 'STOCK BAJO' : `PRODUCTOS POR ACABARSE (${productosBajos.length})`}
        </Button>
        
        <Button 
          size={isMobile ? "sm" : "md"}
          variant="gradient"
          gradient={{ from: 'blue', to: 'cyan', deg: 135 }}
          leftSection="📅"
          onClick={() => setMostrarVencer(true)}
          className="dashboard-button"
          fullWidth={isMobile}
          disabled={productosPorVencer.length === 0}
        >
          {isMobile ? 'POR VENCER' : `PRODUCTOS POR VENCER (${productosPorVencer.length})`}
        </Button>
      </Group>

      {/* Modales para detalles de productos */}
      <ProductosBajosModal
        productos={productosBajos}
        opened={mostrarBajos}
        onClose={() => setMostrarBajos(false)}
      />

      <ProductosVencerModal
        productos={productosPorVencer}
        opened={mostrarVencer}
        onClose={() => setMostrarVencer(false)}
      />
    </Container>
  );
}

export default Dashboard;