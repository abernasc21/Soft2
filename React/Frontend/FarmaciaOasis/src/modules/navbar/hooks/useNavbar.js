import { useState, useEffect } from 'react';

/**
 * Hook personalizado para gestionar el estado del menú de navegación
 * Controla apertura, cierre y efectos secundarios como el scroll del body
 */
export const useNavbar = () => {
  const [esMenuAbierto, setEsMenuAbierto] = useState(false);

  /**
   * Abre el menú y deshabilita el scroll del body
   */
  const abrirMenu = () => {
    setEsMenuAbierto(true);
    document.body.style.overflow = 'hidden';
  };

  /**
   * Cierra el menú y restaura el scroll del body
   */
  const cerrarMenu = () => {
    setEsMenuAbierto(false);
    document.body.style.overflow = 'unset';
  };

  /**
   * Alterna entre abrir y cerrar el menú
   */
  const toggleMenu = () => {
    if (esMenuAbierto) {
      cerrarMenu();
    } else {
      abrirMenu();
    }
  };

  /**
   * Efecto para cerrar el menú con la tecla Escape
   * Se ejecuta una vez al montar el componente
   */
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        cerrarMenu();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return {
    esMenuAbierto,
    abrirMenu,
    cerrarMenu,
    toggleMenu
  };
};