import { useState, useMemo, useEffect } from 'react';
import proveedorService from '../services/proveedorService';

/**
 * Hook personalizado para la gestión completa de proveedores
 * Maneja estado, búsqueda, CRUD y lógica de negocio
 */
export function useProveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [proveedorEditando, setProveedorEditando] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);

  // Cargar proveedores al inicializar el hook
  useEffect(() => {
    cargarProveedores();
  }, []);

  /**
   * Carga todos los proveedores desde el servicio
   */
  const cargarProveedores = async () => {
    setCargando(true);
    try {
      const datos = await proveedorService.obtenerProveedores();
      setProveedores(datos);
    } catch (error) {
      console.error('Error cargando proveedores:', error);
    } finally {
      setCargando(false);
    }
  };

  /**
   * Filtra proveedores por término de búsqueda
   * Busca en nombre, teléfono y concepto
   */
  const proveedoresFiltrados = useMemo(() => {
    if (!busqueda.trim()) return proveedores;

    const termino = busqueda.toLowerCase();
    return proveedores.filter(proveedor =>
      proveedor.nombre.toLowerCase().includes(termino) ||
      (proveedor.telefono && proveedor.telefono.toLowerCase().includes(termino)) ||
      (proveedor.concepto && proveedor.concepto.toLowerCase().includes(termino))
    );
  }, [proveedores, busqueda]);

  /**
   * Prepara resultados para el componente de búsqueda
   * Formatea los datos para mostrar en sugerencias
   */
  const resultadosBusqueda = useMemo(() => {
    if (!busqueda.trim()) return [];

    return proveedoresFiltrados.map(proveedor => ({
      id: proveedor.id_proveedor,
      label: proveedor.nombre,
      category: 'Proveedor',
      telefono: proveedor.telefono,
      concepto: proveedor.concepto,
      data: proveedor
    }));
  }, [proveedoresFiltrados, busqueda]);

  /**
   * Crea un nuevo proveedor en el sistema
   */
  const crearProveedor = async (nuevoProveedor) => {
    try {
      const proveedorCreado = await proveedorService.crearProveedor(nuevoProveedor);
      setProveedores(prev => [...prev, proveedorCreado]);
      setMostrarForm(false);
      return proveedorCreado;
    } catch (error) {
      console.error('Error creando proveedor:', error);
      throw error;
    }
  };

  /**
   * Actualiza los datos de un proveedor existente
   */
  const actualizarProveedor = async (proveedorActualizado) => {
    try {
      const resultado = await proveedorService.actualizarProveedor(
        proveedorActualizado.id_proveedor,
        {
          nombre: proveedorActualizado.nombre,
          telefono: proveedorActualizado.telefono,
          cantidad: proveedorActualizado.cantidad,
          concepto: proveedorActualizado.concepto,
          precio_unitario: proveedorActualizado.precio_unitario,
          precio_total: proveedorActualizado.precio_total
        }
      );

      // Actualizar estado local con el proveedor modificado
      setProveedores(prev =>
        prev.map(p =>
          p.id_proveedor === proveedorActualizado.id_proveedor ? resultado : p
        )
      );

      setMostrarForm(false);
      setProveedorEditando(null);
      return true;
    } catch (error) {
      console.error('Error actualizando proveedor:', error);
      throw error;
    }
  };

  /**
   * Maneja la selección de un resultado de búsqueda
   * Abre el formulario de edición para el proveedor seleccionado
   */
  const manejarSeleccionResultado = (resultado) => {
    const proveedorEncontrado = proveedores.find(p => p.id_proveedor === resultado.id);
    if (proveedorEncontrado) {
      abrirEditarProveedor(proveedorEncontrado);
    }
  };

  /**
   * Abre el formulario en modo edición
   */
  const abrirEditarProveedor = (proveedor) => {
    setProveedorEditando(proveedor);
    setMostrarForm(true);
  };

  // Retornar estado y funciones para el componente
  return {
    proveedores: proveedoresFiltrados,
    proveedoresOriginales: proveedores,
    proveedorEditando,
    mostrarForm,
    busqueda,
    cargando,
    setBusqueda,
    resultadosBusqueda,
    setProveedorEditando,
    setMostrarForm,
    crearProveedor,
    actualizarProveedor,
    manejarSeleccionResultado,
    abrirEditarProveedor,
    recargarProveedores: cargarProveedores
  };
}