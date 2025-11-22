import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

const IngresosEgresosService = {
  // Obtener todo el historial
  obtenerHistorialCompleto: async () => {
    try {
      console.log('Obteniendo historial completo...');
      const response = await axios.get(`${API_URL}/historial/ingresos-egresos`);
      
      if (response.data && response.data.data) {
        console.log(` ${response.data.data.length} movimientos recibidos`);
        return response.data.data;
      }
      
      console.warn('No se recibieron datos');
      return [];
    } catch (error) {
      console.error(' Error al obtener historial:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.error || 'Error al cargar el historial');
    }
  },

  // Obtener por fechas
  obtenerHistorialPorFecha: async (fechaInicio, fechaFin) => {
    try {
      console.log(`Obteniendo historial para ${fechaInicio} - ${fechaFin}`);
      const response = await axios.get(`${API_URL}/historial/ingresos-egresos/por-fecha`, {
        params: { fechaInicio, fechaFin }
      });
      
      if (response.data && response.data.data) {
        console.log(` ${response.data.data.length} movimientos filtrados`);
        return response.data.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error al filtrar por fecha:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Error al filtrar por fecha');
    }
  },

  // Obtener estadísticas
  obtenerEstadisticas: async (fechaInicio = null, fechaFin = null) => {
    try {
      const params = {};
      if (fechaInicio && fechaFin) {
        params.fechaInicio = fechaInicio;
        params.fechaFin = fechaFin;
      }
      
      const response = await axios.get(`${API_URL}/historial/ingresos-egresos/estadisticas`, {
        params
      });
      
      return response.data.data;
    } catch (error) {
      console.error(' Error al obtener estadísticas:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Error al obtener estadísticas');
    }
  },

  // Buscar por producto
  obtenerPorProducto: async (nombreProducto) => {
    try {
      const response = await axios.get(`${API_URL}/historial/ingresos-egresos/producto/${nombreProducto}`);
      return response.data.data;
    } catch (error) {
      console.error(' Error al buscar por producto:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Error al buscar por producto');
    }
  }
};

export default IngresosEgresosService;