// services/dashboardService.js
import axios from 'axios';

const API_BASE = 'http://localhost:4000/api';

/**
 * Servicio para todas las consultas del dashboard a la API
 */
export const dashboardService = {
  /**
   * Obtiene métricas del día actual vs día anterior
   */
  async obtenerMetricasHoy() {
    try {
      const response = await axios.get(`${API_BASE}/dashboard/metricas-hoy`);
      return response.data.data || {
        totalHoy: 0,
        totalAyer: 0,
        productosHoy: 0,
        productosAyer: 0,
        ventasHoy: 0,
        ventasAyer: 0
      };
    } catch (error) {
      console.error('Error obteniendo métricas:', error);
      return {
        totalHoy: 0,
        totalAyer: 0,
        productosHoy: 0,
        productosAyer: 0,
        ventasHoy: 0,
        ventasAyer: 0
      };
    }
  },

  /**
   * Obtiene productos con stock bajo (stock ≤ 10 unidades)
   */
  async obtenerProductosStockBajo() {
    try {
      const response = await axios.get(`${API_BASE}/dashboard/productos-stock-bajo`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error obteniendo productos stock bajo:', error);
      return [];
    }
  },

  /**
   * Obtiene productos próximos a vencer (≤ 30 días restantes)
   */
  async obtenerProductosPorVencer() {
    try {
      const response = await axios.get(`${API_BASE}/dashboard/productos-por-vencer`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error obteniendo productos por vencer:', error);
      return [];
    }
  },

  /**
   * Obtiene datos de ventas mensuales para gráficas
   */
  async obtenerVentasMensuales() {
    try {
      const response = await axios.get(`${API_BASE}/dashboard/ventas-mensuales`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error obteniendo ventas mensuales:', error);
      return [];
    }
  },

  /**
   * Obtiene ranking de productos más vendidos
   */
  async obtenerTopProductos() {
    try {
      const response = await axios.get(`${API_BASE}/dashboard/top-productos`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error obteniendo top productos:', error);
      return [];
    }
  }
};