import { useState } from 'react';
import ventasService from '../services/VentasServices';
import clienteService from '../services/clienteService';
import { saleSound } from '../utils/sounds'; 


export const useCarrito = (productos, actualizarStockProducto, recargarProductos) => {
  const [carrito, setCarrito] = useState([]);
  const [descuentoCliente, setDescuentoCliente] = useState(0);

  const hayStockDisponible = (producto, cantidadDeseada = 1) => {
    const productoEnInventario = productos.find(p => p.id === producto.id);
    const cantidadEnCarrito = carrito.find(item => item.id === producto.id)?.cantidad || 0;
    const stockDisponible = (productoEnInventario?.stock || 0) - cantidadEnCarrito;
    return stockDisponible >= cantidadDeseada;
  };

  const obtenerStockDisponible = (productoId) => {
    const productoEnInventario = productos.find(p => p.id === productoId);
    const cantidadEnCarrito = carrito.find(item => item.id === productoId)?.cantidad || 0;
    return (productoEnInventario?.stock || 0) - cantidadEnCarrito;
  };
 
  const agregarAlCarrito = (producto) => {
    const stockDisponible = obtenerStockDisponible(producto.id);
    
    if (stockDisponible < 1) {
      
      return;
    }

    setCarrito(prev => {
      const existe = prev.find(item => item.id === producto.id);
      if (existe) {
        const nuevoStockDisponible = obtenerStockDisponible(producto.id);
        if (nuevoStockDisponible < 1) {
      
          return prev;
        }
        return prev.map(item =>
          item.id === producto.id 
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const modificarCantidad = (id, cambio) => {
    setCarrito(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nuevaCantidad = item.cantidad + cambio;
          
          if (nuevaCantidad < 1) return null;
          
          const stockDisponible = obtenerStockDisponible(id);
          const producto = productos.find(p => p.id === id);
          
          if (nuevaCantidad > (item.cantidad) && stockDisponible < 1) {
            
            return item;
          }
          
          return { ...item, cantidad: nuevaCantidad };
        }
        return item;
      }).filter(Boolean)
    );
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(prev => prev.filter(item => item.id !== id));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    setDescuentoCliente(0);
  };

  // ✅ NUEVO: Función para actualizar el descuento
  const actualizarDescuento = (porcentajeDescuento) => {
    setDescuentoCliente(parseFloat(porcentajeDescuento) || 0);
  };

  const realizarVenta = async (datosCliente) => {
    try {
      // ✅ BUSCAR O CREAR CLIENTE (automáticamente reactiva si está inactivo)
      let idCliente = null;
      let clienteReactivado = false;
      let porcentajeDescuento = 0;
      
      if (datosCliente.ci_nit && datosCliente.ci_nit !== '00000') {
        // ✅ Verificar si el cliente existe y está inactivo
        const clienteExistente = await clienteService.obtenerClientePorCI(datosCliente.ci_nit);
        if (clienteExistente) {
          porcentajeDescuento = clienteExistente.descuento || 0;
          
          if (clienteExistente.estado === 'inactivo') {
            clienteReactivado = true;
          }
        }
        
        idCliente = await clienteService.buscarOCrearCliente(
          datosCliente.nombre,
          datosCliente.ci_nit,
          porcentajeDescuento
        );
      }

      // Preparar datos para el backend
      const ventaData = {
        cliente: idCliente,
        metodo_pago: datosCliente.metodo_pago,
        productos: carrito.map(item => ({
          id: item.id,
          cantidad: item.cantidad,
          precio: item.precio_venta
        }))
      };

      // Llamar al servicio
      const resultado = await ventasService.crearVenta(ventaData);
          saleSound.play();

      
      const ventaCompleta = {
        ...resultado,
        datosCliente: datosCliente,
        clienteReactivado: clienteReactivado,
        productosVendidos: carrito.map(item => ({
          ...item,
          subtotal: item.precio_venta * item.cantidad
        })),
        total: resultado.total,
        total_sin_descuento: resultado.total_sin_descuento,
        descuento_aplicado: resultado.descuento_aplicado,
        porcentaje_descuento: resultado.porcentaje_descuento
      };
      
      // Recargar productos desde la base de datos
      if (recargarProductos) {
        await recargarProductos();
      }
      
      // Vaciar carrito después de venta exitosa
      vaciarCarrito();
      
      return ventaCompleta;
      
    } catch (error) {
      if (error.message.includes('stock') || error.message.includes('Stock')) {
        if (recargarProductos) {
          await recargarProductos();
        }
      }
      
      throw error;
    }
  };

  // ✅ ACTUALIZADO: Calcular totales con descuento
  const totalSinDescuento = carrito.reduce((total, item) => total + (item.precio_venta * item.cantidad), 0);
  const montoDescuento = totalSinDescuento * (descuentoCliente / 100);
  const totalConDescuento = totalSinDescuento - montoDescuento;

  return {
    carrito,
    descuentoCliente,
    agregarAlCarrito,
    modificarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    realizarVenta,
    actualizarDescuento,
    totalVenta: totalConDescuento,
    totalSinDescuento,
    montoDescuento,
    hayStockDisponible, 
    obtenerStockDisponible 
  };
};