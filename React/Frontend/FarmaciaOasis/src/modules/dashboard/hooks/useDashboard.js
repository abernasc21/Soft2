import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';

/**
 * Hook personalizado para gestionar todos los datos del dashboard
 */
export const useDashboard = () => {
  const [metricas, setMetricas] = useState({
    totalHoy: 0,
    productosVendidos: 0,
    ventasHoy: 0,
    totalAyer: 0,
    productosAyer: 0,
    ventasAyer: 0
  });
  const [productosBajos, setProductosBajos] = useState([]);
  const [productosPorVencer, setProductosPorVencer] = useState([]);
  const [ventasMensuales, setVentasMensuales] = useState([]);
  const [topProductos, setTopProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Calcula el porcentaje de cambio entre hoy y ayer
   */
  const calcularPorcentaje = (valorHoy, valorAyer) => {
    if (valorAyer === 0) return valorHoy > 0 ? '+100%' : '0%';
    const diferencia = valorHoy - valorAyer;
    const porcentaje = (diferencia / valorAyer) * 100;
    return porcentaje > 0 ? `+${porcentaje.toFixed(1)}%` : `${porcentaje.toFixed(1)}%`;
  };

  /**
   * Determina si la tendencia es positiva (up) o negativa (down)
   */
  const determinarTendencia = (valorHoy, valorAyer) => {
    return valorHoy >= valorAyer ? 'up' : 'down';
  };

  useEffect(() => {
    /**
     * Carga todos los datos del dashboard en paralelo
     */
    const cargarDatos = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [
          metricasData,
          productosBajosData,
          productosVencerData,
          ventasMensualesData,
          topProductosData
        ] = await Promise.all([
          dashboardService.obtenerMetricasHoy(),
          dashboardService.obtenerProductosStockBajo(),
          dashboardService.obtenerProductosPorVencer(),
          dashboardService.obtenerVentasMensuales(),
          dashboardService.obtenerTopProductos()
        ]);

        setMetricas({
          totalHoy: metricasData.totalHoy || 0,
          productosVendidos: metricasData.productosHoy || 0,
          ventasHoy: metricasData.ventasHoy || 0,
          totalAyer: metricasData.totalAyer || 0,
          productosAyer: metricasData.productosAyer || 0,
          ventasAyer: metricasData.ventasAyer || 0
        });
        
        setProductosBajos(productosBajosData || []);
        setProductosPorVencer(productosVencerData || []);
        setVentasMensuales(ventasMensualesData || []);
        setTopProductos(topProductosData || []);
        
      } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
        setError('Error al cargar los datos del dashboard');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();

    // Recargar datos automáticamente cada 5 minutos
    const intervalo = setInterval(cargarDatos, 300000);
    return () => clearInterval(intervalo);
  }, []);

  return {
    metricas,
    productosBajos,
    productosPorVencer,
    ventasMensuales,
    topProductos,
    loading,
    error,
    calcularPorcentaje,
    determinarTendencia
  };
};