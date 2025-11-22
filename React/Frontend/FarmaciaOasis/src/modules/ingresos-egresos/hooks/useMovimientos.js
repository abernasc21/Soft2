import { useState, useEffect } from 'react';
import IngresosEgresosService from '../services/ingresos-egresosService';

/**
 * Hook personalizado para gestionar movimientos de stock
 * Proporciona funcionalidades de carga, búsqueda y estado de movimientos
 */
export const useMovimientos = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarMovimientos = async () => {
    try {
      console.log('Cargando movimientos...');
      setLoading(true);
      setError(null);

      const datos = await IngresosEgresosService.obtenerHistorialCompleto();
      
      setMovimientos(datos);
      
    } catch (err) {
      console.error(' Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMovimientos();
  }, []);

  /**
   * Filtra movimientos por término de búsqueda
   * Busca en nombre, lote y laboratorio
   */
  const buscarMovimientos = (terminoBusqueda) => {
    if (!terminoBusqueda) return movimientos;
    
    const termino = terminoBusqueda.toLowerCase().trim();
    return movimientos.filter(movimiento =>
      movimiento.nombre.toLowerCase().includes(termino) ||
      movimiento.lote.toLowerCase().includes(termino) ||
      (movimiento.laboratorio && movimiento.laboratorio.toLowerCase().includes(termino))
    );
  };

  return {
    movimientos,
    loading,
    error,
    refetch: cargarMovimientos,
    buscarMovimientos
  };
};