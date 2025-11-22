import { IconAlertTriangle,
  IconPackage, 
  IconCheck, 
  IconX } from '@tabler/icons-react';
import { Modal,
  Table,
  Badge,
  Text, 
  Group, 
  Paper, 
  Title, 
  Alert, 
  ScrollArea, 
  Box, 
  ActionIcon } from '@mantine/core';

/**
 * Componente para mostrar lista de ventas en formato tabla
 * Incluye colores para métodos de pago y diseño responsive
 */
function VentasList({ ventas }) {
  /**
   * Asigna colores a los métodos de pago para los badges
   */
  const getBadgeColor = (metodo) => {
    const colores = {
      'efectivo': '#28a745',  
      'qr': '#17a2b8',        
      'mixto': '#6f42c1'      
    };
    return colores[metodo.toLowerCase()] || '#6c757d'; 
  };

  // Estado vacío - sin ventas
  if (ventas.length === 0) {
    return (
      <div className="sin-ventas">
        <p>No hay ventas registradas en el historial.</p>
      </div>
    );
  }

  /**
   * Genera las filas de la tabla con datos de ventas
   */
  const filas = ventas.map((venta) => {
    return (
      <Table.Tr 
        key={venta.id} 
        className="mantine-Table-tr" 
      >
        <Table.Td className="mantine-Table-td">
          {venta.id_venta}
        </Table.Td>
        <Table.Td className="mantine-Table-td">
          {venta.fecha}
        </Table.Td>
        <Table.Td className="mantine-Table-td">
          {venta.hora}
        </Table.Td>
        <Table.Td className="mantine-Table-td">
          {venta.cliente}
        </Table.Td>
        <Table.Td className="mantine-Table-td">
          {venta.ci_nit}
        </Table.Td>
        <Table.Td className="mantine-Table-td">
          {/* Badge con color según método de pago */}
          <Badge 
            color={getBadgeColor(venta.metodo_pago)} 
            variant="light" 
            size="sm"
          >
            {venta.metodo_pago}
          </Badge>
        </Table.Td>
        <Table.Td className="mantine-Table-td">
          {venta.descuento.toFixed(2)}
        </Table.Td>
        <Table.Td className="mantine-Table-td">
          {venta.total.toFixed(2)}
        </Table.Td>
        <Table.Td className="mantine-Table-td">
          {venta.productos}
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Paper 
      p="lg" 
      withBorder 
      radius="lg" 
      shadow="md"
    >
      {/* Contenedor scrollable para la tabla */}
      <Box className="top-productos-content" style={{ height: '400px' }}>
        <ScrollArea 
          h={400}
          className="mantine-ScrollArea-root"
          scrollbarSize={6}
          type="auto"
        >
          <Table 
            className="mantine-Table-table"
            verticalSpacing="sm"
          >
            {/* Encabezados de la tabla */}
            <Table.Thead className="mantine-Table-thead">
              <Table.Tr className="mantine-Table-tr">
                <Table.Th className="mantine-Table-th">idVenta</Table.Th>
                <Table.Th className="mantine-Table-th">Fecha</Table.Th>
                <Table.Th className="mantine-Table-th">Hora</Table.Th>
                <Table.Th className="mantine-Table-th">Cliente</Table.Th>
                <Table.Th className="mantine-Table-th">CI/NIT</Table.Th>
                <Table.Th className="mantine-Table-th">Método Pago</Table.Th>
                <Table.Th className="mantine-Table-th">Descuento</Table.Th>
                <Table.Th className="mantine-Table-th">Total(Bs.)</Table.Th>
                <Table.Th className="mantine-Table-th">Productos</Table.Th>
              </Table.Tr>
            </Table.Thead>
            
            {/* Cuerpo de la tabla con filas de ventas */}
            <Table.Tbody className="mantine-Table-tbody">
              {filas}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Box>
    </Paper>
  );
}

export default VentasList;