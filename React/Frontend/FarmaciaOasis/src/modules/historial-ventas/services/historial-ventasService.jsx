//src/modules/historial-ventas/services/historial-ventasService.jsx
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';  

/**
 * Servicio para gestionar las operaciones del historial de ventas
 * Proporciona métodos para obtener y filtrar datos de ventas
 */
const HistorialVentasService = {
  /**
   * Obtiene todas las ventas con detalles completos
   * Incluye información de productos y clientes
   */
  obtenerVentasDetalle: async () => {
    try {
      const response = await axios.get(`${API_URL}/ventas`);
      console.log('Respuesta completa del backend:', response);
      
      // Maneja diferentes estructuras de respuesta del backend
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      }
      return response.data;
    } catch (error) {
      console.error("Error al obtener ventas:", error);
      throw error;
    }
  },

  /**
   * Función alternativa para obtener ventas
   * Puede usarse como backup o para endpoints diferentes
   */
  obtenerVentas: async () => {
    try {
      const response = await axios.get(`${API_URL}/ventas-detalle`);
      console.log('Datos de ventas obtenidos:', response.data);
      
      // Maneja diferentes estructuras de respuesta
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      }
      return response.data;
    } catch (error) {
      console.error("Error al obtener ventas:", error);
      throw error;
    }
  },

  /**
   * Filtra ventas por ID de cliente específico
   */
  obtenerVentasPorCliente: async (id_cliente) => {
    try {
      const response = await axios.get(`${API_URL}/ventas-detalle`);
      const ventas = response.data.data || response.data;
      return ventas.filter(v => v.id_cliente === id_cliente);
    } catch (error) {
      console.error("Error al filtrar ventas por cliente:", error);
      throw error;
    }
  },

  /**
   * Filtra ventas por rango de fechas
   */
  obtenerVentasPorFecha: async (fechaInicio, fechaFin) => {
    try {
      const response = await axios.get(`${API_URL}/ventas-detalle`);
      const ventas = response.data.data || response.data;
      return ventas.filter(v => v.fecha >= fechaInicio && v.fecha <= fechaFin);
    } catch (error) {
      console.error("Error al filtrar ventas por fecha:", error);
      throw error;
    }
  }
};

export default HistorialVentasService;