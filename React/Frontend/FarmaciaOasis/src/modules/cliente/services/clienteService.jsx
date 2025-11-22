import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

const clienteService = {
  // GET todos los clientes
  obtenerClientes: async () => {
    try {
      const response = await axios.get(`${API_URL}/clientes`);
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      throw error;
    }
  },

  // GET cliente por ID
  obtenerCliente: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/clientes/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener cliente:', error);
      throw error;
    }
  },

  // POST crear cliente
  crearCliente: async (clienteData) => {
    try {
      const response = await axios.post(`${API_URL}/clientes`, clienteData);
      return response.data.data;
    } catch (error) {
      console.error('Error al crear cliente:', error);
      throw error;
    }
  },

  // PUT actualizar cliente
  actualizarCliente: async (id, clienteData) => {
    try {
      const response = await axios.put(`${API_URL}/clientes/${id}`, clienteData);
      return response.data.data;
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      throw error;
    }
  },

  // DELETE cliente (eliminación suave)
  eliminarCliente: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/clientes/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      throw error;
    }
  }
};

export default clienteService;