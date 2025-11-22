import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

const ventasService = {
  // Crear nueva venta
  
  crearVenta: async (ventaData) => {
    try {
      const response = await axios.post(`${API_URL}/ventas`, ventaData);
      return response.data.data;
    } catch (error) {
      console.error('Error al crear venta:', error);
      
      // ✅ Mejor manejo de errores
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error('Error al procesar la venta. Intente nuevamente.');
      }
    }
  },

  // Obtener todas las ventas
  obtenerVentas: async () => {
    try {
      const response = await axios.get(`${API_URL}/ventas`);
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener ventas:', error);
      throw error;
    }
  },  

  // Obtener detalles de una venta específica
  obtenerVenta: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/ventas/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener venta:', error);
      throw error;
    }
  }
};

export default ventasService;