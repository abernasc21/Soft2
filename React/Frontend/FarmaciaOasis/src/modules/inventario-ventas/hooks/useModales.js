import { useState } from 'react';

export const useModales = () => {
  const [modalProducto, setModalProducto] = useState({
    abierto: false,
    producto: null
  });
  
  const [modalLaboratorio, setModalLaboratorio] = useState(false);

  const abrirModalProducto = (producto = null) => {
    setModalProducto({ 
      abierto: true,
      producto
    });
  };

  const cerrarModalProducto = () => {
    setModalProducto({ 
      abierto: false,
      producto: null
    });
  };

  const abrirModalLaboratorio = () => setModalLaboratorio(true);
  const cerrarModalLaboratorio = () => setModalLaboratorio(false);

  return {
    modalProducto,
    modalLaboratorio,
    
    abrirModalProducto,
    cerrarModalProducto,
    abrirModalLaboratorio,
    cerrarModalLaboratorio
  };
};