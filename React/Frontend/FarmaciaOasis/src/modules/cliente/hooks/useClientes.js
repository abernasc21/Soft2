import { useState, useMemo, useEffect } from 'react';
import clienteService from '../services/clienteService';

/**
 * Hook personalizado para la gestión completa de clientes
 * Maneja estado, búsqueda, CRUD y lógica de negocio
 */
export function useClientes() {
  const [clientes, setClientes] = useState([]);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [clienteAEliminar, setClienteAEliminar] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [cargando, setCargando] = useState(false);

  // Cargar clientes al inicializar el hook
  useEffect(() => {
    cargarClientes();
  }, []);

  /**
   * Carga todos los clientes desde el servicio
   */
  const cargarClientes = async () => {
    setCargando(true);
    try {
      const datos = await clienteService.obtenerClientes();
      setClientes(datos);
    } catch (error) {
      console.error('Error cargando clientes:', error);
    } finally {
      setCargando(false);
    }
  };

  // Filtrar solo clientes ACTIVOS para mostrar
  const clientesActivos = useMemo(() => {
    return clientes.filter(cliente => cliente.estado === 'activo');
  }, [clientes]);

  /**
   * Filtra clientes por término de búsqueda
   * Busca en nombre y CI/NIT de clientes activos
   */
  const clientesFiltrados = useMemo(() => {
    if (!busqueda.trim()) return clientesActivos;
    
    const termino = busqueda.toLowerCase();
    return clientesActivos.filter(cliente => 
      cliente.nombre.toLowerCase().includes(termino) ||
      (cliente.ci_nit && cliente.ci_nit.toLowerCase().includes(termino))
    );
  }, [clientesActivos, busqueda]);

  /**
   * Prepara resultados para el componente de búsqueda
   * Formatea los datos para mostrar en sugerencias
   */
  const resultadosBusqueda = useMemo(() => {
    if (!busqueda.trim()) return [];

    return clientesFiltrados.map(cliente => ({
      id: cliente.cod_cli,
      label: cliente.nombre,
      category: 'Cliente',
      nombre: cliente.nombre,
      ci_nit: cliente.ci_nit,
      data: cliente
    }));
  }, [clientesFiltrados, busqueda]);

  /**
   * Maneja la selección de un resultado de búsqueda
   * Abre el formulario de edición para el cliente seleccionado
   */
  const manejarSeleccionResultado = (resultado) => {
    const clienteEncontrado = clientes.find(c => c.cod_cli === resultado.id);
    if (clienteEncontrado) {
      abrirEditarCliente(clienteEncontrado);
    }
  };

  /**
   * Busca clientes inactivos por CI/NIT
   * Usado para detectar reactivaciones
   */
  const buscarClienteInactivoPorCI = (ci_nit) => {
    return clientes.find(cliente => 
      cliente.ci_nit === ci_nit && cliente.estado === 'inactivo'
    );
  };

  /**
   * Crea un nuevo cliente o reactiva uno existente
   * Detecta clientes inactivos con el mismo CI/NIT
   */
  const crearCliente = async (nuevoCliente) => {
    try {
      // Buscar si existe cliente inactivo con mismo CI/NIT
      const clienteInactivo = buscarClienteInactivoPorCI(nuevoCliente.ci_nit);
      
      if (clienteInactivo) {
        // Reactivar el cliente existente
        const clienteReactivado = await clienteService.actualizarCliente(
          clienteInactivo.cod_cli, 
          {
            nombre: nuevoCliente.nombre,
            ci_nit: nuevoCliente.ci_nit,
            descuento: nuevoCliente.descuento,
            estado: 'activo'
          }
        );
        
        setClientes(prev => prev.map(c => 
          c.cod_cli === clienteInactivo.cod_cli ? clienteReactivado : c
        ));
        setMostrarForm(false);
        return clienteReactivado;
      } else {
        // Crear nuevo cliente
        const clienteCreado = await clienteService.crearCliente(nuevoCliente);
        setClientes(prev => [...prev, clienteCreado]);
        setMostrarForm(false);
        return clienteCreado;
      }
    } catch (error) {
      console.error('Error creando cliente:', error);
      throw error;
    }
  };

  /**
   * Actualiza los datos de un cliente existente
   */
  const actualizarCliente = async (clienteActualizado) => {
    try {
      const resultado = await clienteService.actualizarCliente(
        clienteActualizado.cod_cli, 
        {
          nombre: clienteActualizado.nombre,
          ci_nit: clienteActualizado.ci_nit,
          descuento: clienteActualizado.descuento,
          estado: clienteActualizado.estado
        }
      );
      
      setClientes(prev => prev.map(c => 
        c.cod_cli === clienteActualizado.cod_cli ? resultado : c
      ));
      
      setMostrarForm(false);
      setClienteEditando(null);
      return true;
    } catch (error) {
      console.error('Error actualizando cliente:', error);
      throw error;
    }
  };

  /**
   * Elimina un cliente cambiando su estado a inactivo
   * Implementa eliminación lógica (soft delete)
   */
  const eliminarCliente = async (id) => {
    try {
      await clienteService.eliminarCliente(id);
      
      // Actualizar estado localmente 
      setClientes(prev => prev.map(c => 
        c.cod_cli === id ? { ...c, estado: 'inactivo' } : c
      ));
      
      setMostrarConfirmacion(false);
      setClienteAEliminar(null);
      return true;
    } catch (error) {
      console.error('Error eliminando cliente:', error);
      throw error;
    }
  };

  /**
   * Inicia el proceso de eliminación mostrando confirmación
   */
  const solicitarEliminacion = (cliente) => {
    setClienteAEliminar(cliente);
    setMostrarConfirmacion(true);
  };

  /**
   * Cancela el proceso de eliminación
   */
  const cancelarEliminacion = () => {
    setMostrarConfirmacion(false);
    setClienteAEliminar(null);
  };

  /**
   * Abre el formulario en modo edición
   */
  const abrirEditarCliente = (cliente) => {
    setClienteEditando(cliente);
    setMostrarForm(true);
  };

  // Retornar estado y funciones para el componente
  return {
    clientes: clientesFiltrados,
    clienteEditando,
    mostrarForm,
    busqueda,
    cargando,
    setBusqueda,
    resultadosBusqueda,
    clienteAEliminar,
    mostrarConfirmacion,
    setClienteEditando,
    setMostrarForm,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
    solicitarEliminacion,
    cancelarEliminacion,
    manejarSeleccionResultado,
    abrirEditarCliente,
    recargarClientes: cargarClientes
  };
}