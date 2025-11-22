import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

const inventarioService = {
        // GET todos los productos
        obtenerProductos: async () => {
            try {
            const response = await axios.get(`${API_URL}/productos`);
            return response.data.data;
            } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
            }
        },
        // GET producto por ID
        obtenerProducto: async (id) => {
            try {
            const response = await axios.get(`${API_URL}/productos/${id}`);
            return response.data.data;
            } catch (error) {
            console.error('Error al obtener producto:', error);
            throw error;
            }
        },
        // POST crear producto
        crearProducto: async (productoData) => {
            try {
            const response = await axios.post(`${API_URL}/productos`, productoData);
            return response.data.data;
            } catch (error) {
            console.error('Error al crear producto:', error);
            throw error;
            }
        },
        // PUT actualizar producto
        actualizarProducto: async (id, productoData) => {
            try {
            const response = await axios.put(`${API_URL}/productos/${id}`, productoData);
            return response.data.data;
            } catch (error) {
            console.error('Error al actualizar producto:', error);
            throw error;
            }
        },
        // DELETE producto (eliminación suave)
        eliminarProducto: async (id) => {
            try {
            const response = await axios.delete(`${API_URL}/productos/${id}`);
            return response.data.data;
            } catch (error) {
            console.error('Error al eliminar producto:', error);
            throw error;
            }
        },
        // GET todos los laboratorios
        // POST crear laboratorio
        crearLaboratorio: async (laboratorioData) => {
            try {
            // Mapear 'nombre' a 'nombre_labo' para la base de datos
            const datosParaBackend = {
                nombre_labo: laboratorioData.nombre,
                direccion: laboratorioData.direccion
            };
            
            const response = await axios.post(`${API_URL}/laboratorios`, datosParaBackend);
            return response.data.data;
            } catch (error) {
            console.error('Error al crear laboratorio:', error);
            throw error;
            }
        },
        // GET todos los laboratorios
        obtenerLaboratorios: async () => {
            try {
            const response = await axios.get(`${API_URL}/laboratorios`);
            // Mapear los datos de la base de datos al formato del frontend
            return response.data.data.map(lab => ({
                id: lab.id_lab,
                nombre: lab.nombre_labo, // Mapear nombre_labo a nombre
                direccion: lab.direccion
            }));
            } catch (error) {
            console.error('Error al obtener laboratorios:', error);
            throw error;
            }
        }
};

export default inventarioService;
