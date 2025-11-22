import { Table, Badge, Paper, ScrollArea, Box } from '@mantine/core';
import { useState } from 'react';

/**
 * Componente para mostrar lista de movimientos de stock
 * Muestra cambios en inventario con indicadores visuales de ingreso/egreso
 */
function MovimientosList({ movimientos }) {
  /**
   * Calcula la diferencia entre stock nuevo y antiguo
   */
  const calcularMovimiento = (stockAntiguo, stockNuevo) => {
    return stockNuevo - stockAntiguo;
  };

  /**
   * Determina el tipo de movimiento (ingreso, egreso o sin cambio)
   */
  const getTipoMovimiento = (stockAntiguo, stockNuevo) => {
    const movimiento = stockNuevo - stockAntiguo;
    if (movimiento > 0) return 'ingreso';
    if (movimiento < 0) return 'egreso';
    return 'sin-cambio';
  };

  /**
   * Asigna colores a los badges según el tipo de movimiento
   */
  const getBadgeColor = (tipo) => {
    const colores = {
      'ingreso': 'green',
      'egreso': 'red',
      'sin-cambio': 'gray'
    };
    return colores[tipo] || 'gray';
  };

  /**
   * Retorna iconos para representar visualmente el movimiento
   */
  const getIconoMovimiento = (tipo) => {
    const iconos = {
      'ingreso': '↑',
      'egreso': '↓',
      'sin-cambio': '='
    };
    return iconos[tipo];
  };

  // Estado vacío - sin movimientos
  if (movimientos.length === 0) {
    return (
      <Paper p="lg" withBorder radius="lg" shadow="md">
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#6c757d',
          fontStyle: 'italic'
        }}>
          <p>No hay movimientos registrados.</p>
        </div>
      </Paper>
    );
  }

  /**
   * Genera las filas de la tabla con datos de movimientos
   */
  const filas = movimientos.map((movimiento) => {
    const tipo = getTipoMovimiento(movimiento.stock_antiguo, movimiento.stock_nuevo);
    const cantidadMovimiento = calcularMovimiento(movimiento.stock_antiguo, movimiento.stock_nuevo);
    
    return (
      <Table.Tr key={movimiento.id}>
        <Table.Td>PROOD {movimiento.id_producto}</Table.Td>
        <Table.Td>{movimiento.nombre}</Table.Td>
        <Table.Td>{movimiento.presentacion}</Table.Td>
        <Table.Td>{movimiento.medida}</Table.Td>
        <Table.Td>{movimiento.lote}</Table.Td>
        <Table.Td>{movimiento.precio_venta.toFixed(2)} Bs</Table.Td>
        <Table.Td>{movimiento.stock_antiguo}</Table.Td>
        <Table.Td>{movimiento.stock_nuevo}</Table.Td>
        <Table.Td>
          {/* Badge con color e icono según tipo de movimiento */}
          <Badge 
            color={getBadgeColor(tipo)} 
            variant="light" 
            size="sm"
            leftSection={getIconoMovimiento(tipo)}
          >
            {Math.abs(cantidadMovimiento)}
          </Badge>
        </Table.Td>
        <Table.Td>
          {/* Ajuste de fecha sumando 1 día */}
          {(() => {
            const fecha = new Date(movimiento.fecha);
            fecha.setDate(fecha.getDate() + 1);
            return fecha.toLocaleDateString('es-ES');
          })()}
        </Table.Td>
        <Table.Td>{movimiento.hora}</Table.Td>
        <Table.Td>{movimiento.laboratorio}</Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Paper withBorder radius="lg" shadow="sm">
      {/* Contenedor scrollable para la tabla */}
      <Box style={{ height: '200px' }}>
        <ScrollArea h={200} scrollbarSize={6}>
          <Table verticalSpacing="sm" striped highlightOnHover>
            {/* Encabezados de la tabla */}
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID Producto</Table.Th>
                <Table.Th>Nombre</Table.Th>
                <Table.Th>Presentación</Table.Th>
                <Table.Th>Medida</Table.Th>
                <Table.Th>Lote</Table.Th>
                <Table.Th>Precio Venta</Table.Th>
                <Table.Th>Stock Antiguo</Table.Th>
                <Table.Th>Stock Nuevo</Table.Th>
                <Table.Th>Movimiento</Table.Th>
                <Table.Th>Fecha</Table.Th>
                <Table.Th>Hora</Table.Th>
                <Table.Th>Laboratorio</Table.Th>
              </Table.Tr>
            </Table.Thead>
            
            {/* Cuerpo de la tabla con filas de movimientos */}
            <Table.Tbody>{filas}</Table.Tbody>
          </Table>
        </ScrollArea>
      </Box>
    </Paper>
  );
}

export default MovimientosList;