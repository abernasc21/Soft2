import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

/**
 * Servicio para gestionar operaciones CRUD de proveedores
 * Conecta con la API backend para todas las operaciones de proveedores
 */
const proveedorService = {
  /**
   * Obtiene todos los proveedores del sistema
   * @returns {Promise<Array>} Lista de proveedores
   */
  obtenerProveedores: async () => {
    try {
      const response = await axios.get(`${API_URL}/proveedores`);
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      throw error;
    }
  },

  /**
   * Obtiene un proveedor específico por su ID
   */
  obtenerProveedor: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/proveedores/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener proveedor:', error);
      throw error;
    }
  },

  /**
   * Crea un nuevo proveedor en el sistema
   */
  crearProveedor: async (proveedorData) => {
    try {
      const response = await axios.post(`${API_URL}/proveedores`, proveedorData);
      return response.data.data;
    } catch (error) {
      console.error('Error al crear proveedor:', error);
      throw error;
    }
  },

  /**
   * Actualiza los datos de un proveedor existente
   */
  actualizarProveedor: async (id, proveedorData) => {
    try {
      const response = await axios.put(`${API_URL}/proveedores/${id}`, proveedorData);
      return response.data.data;
    } catch (error) {
      console.error('Error al actualizar proveedor:', error);
      throw error;
    }
  },

  /**
   * Elimina un proveedor (eliminación suave)
  
   */
  eliminarProveedor: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/proveedores/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
      throw error;
    }
  }
};

export default proveedorService;