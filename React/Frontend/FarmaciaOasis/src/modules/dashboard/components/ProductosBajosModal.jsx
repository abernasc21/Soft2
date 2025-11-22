import { Modal, Table, Badge, Text, Group, Paper, Title, Alert, ScrollArea, Box, ActionIcon } from '@mantine/core';
import { IconAlertTriangle, IconPackage, IconCheck, IconX } from '@tabler/icons-react';
import '../dashboard.css';

/**
 * Modal para mostrar productos con stock bajo o crítico
 * Incluye sistema de colores por nivel de stock y estadísticas
 */
function ProductosBajosModal({ productos, opened, onClose }) {
  // Sistema de clasificación por niveles de stock
  const getEstado = (stock) => {
    if (stock <= 5) return 'Crítico';
    if (stock < 11 && stock > 4) return 'Bajo';
    return 'Bueno';
  };

  const getBadgeColor = (stock) => {
    if (stock <= 5) return 'red';
    if (stock < 11 && stock > 4) return 'orange';
    return 'green';
  };

  const getBadgeVariant = (stock) => {
    return stock <= 5 ? 'filled' : 'light';
  };

  // Estadísticas de productos por nivel de stock
  const productosCriticos = productos.filter(p => p.stock <= 5).length;
  const productosBajos = productos.filter(p => p.stock < 11 && p.stock > 4).length;
  const productosNecesitanAtencion = productosCriticos + productosBajos;

  // Colores de borde según nivel de stock
  const getBorderColor = (stock) => {
    if (stock <= 5) return '#ff6b6b';
    if (stock < 11) return '#ffa94d';
    return '#51cf66';
  };

  // Filas de la tabla con productos
  const rows = productos.map((producto) => {
    const estado = getEstado(producto.stock);
    const badgeColor = getBadgeColor(producto.stock);
    const borderColor = getBorderColor(producto.stock);
    
    return (
      <Table.Tr 
        key={producto.id} 
        className="product-row"
        style={{ borderLeft: `3px solid ${borderColor}` }}
      >
        <Table.Td className="product-cell">
          <Group gap="sm">
            <IconPackage size={16} color={badgeColor} />
            <div>
              <Text fw={600} size="sm" c="dark.8">{producto.nombre}</Text>
              <Text size="xs" c="dimmed">ID: {producto.id}</Text>
            </div>
          </Group>
        </Table.Td>
        <Table.Td className="product-cell">
          <Text size="sm" c="dark.6">{producto.presentacion || 'N/A'}</Text>
        </Table.Td>
        <Table.Td className="product-cell">
          <Text size="sm" c="dark.6">{producto.lote || 'N/A'}</Text>
        </Table.Td>
        <Table.Td className="product-cell">
          <Badge variant="outline" color="blue" size="sm">
            {producto.medida || 'unidades'}
          </Badge>
        </Table.Td>
        <Table.Td className="product-cell">
          <Text fw={500} size="sm" c="dark.7">{producto.laboratorio}</Text>
        </Table.Td>
        <Table.Td className="product-cell">
          <Badge 
            color={badgeColor}
            variant={getBadgeVariant(producto.stock)}
            size="sm"
            radius="sm"
          >
            {producto.stock} 
          </Badge>
        </Table.Td>
        <Table.Td className="product-cell">
          <Group gap="xs">
            <Badge 
              color={badgeColor}
              variant={getBadgeVariant(producto.stock)}
              size="sm"
              radius="sm"
              className="status-badge"
            >
              {estado}
            </Badge>
            {producto.stock < 4 && (
              <IconAlertTriangle size={14} color="#ff6b6b" />
            )}
            {producto.stock > 10 && (
              <IconCheck size={14} color="#51cf66" />
            )}
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Modal 
      opened={opened} 
      onClose={onClose}
      title={
        <Group className="modal-header-container">
          <Group gap="lg">
            <div className="modal-icon-container">
              <IconAlertTriangle size={22} color="white" />
            </div>
            <div>
              <Title order={3} c="dark.8" className="modal-title">
                Control de Inventario
              </Title>
              <Text size="sm" c="dimmed" className="modal-subtitle">
                Productos por debajo del stock mínimo
              </Text>
            </div>
          </Group>
        </Group>
      }
      size="xl"
      overlayProps={{ blur: 3 }}
      radius="lg"
      centered
      withCloseButton={false}
      scrollAreaComponent={ScrollArea.Autosize}
    >
      {/* Botón de cierre personalizado */}
      <ActionIcon 
        variant="subtle" 
        color="gray" 
        onClick={onClose}
        size="xl"
        radius="md"
        className="modal-close-btn"
      >
        <IconX size={20} />
      </ActionIcon>

      {/* Estado vacío o con productos */}
      {productos.length === 0 ? (
        <Alert color="green" title="Todo en orden" icon={<IconPackage size={16} />} radius="md">
          No hay productos con stock bajo en este momento.
        </Alert>
      ) : (
        <>
          {/* Alerta de productos que necesitan atención */}
          <Box className="alert-container">
            <Alert 
              color="blue" 
              mb="md" 
              icon={<IconAlertTriangle size={16} color="#1871c1" />} 
              radius="md"
              className="stock-alert"
            >
              <Text fw={500}>{productosNecesitanAtencion} productos necesitan atención</Text>
            </Alert>
          </Box>

          {/* Tabla de productos */}
          <Paper withBorder radius="md" className="table-paper">
            <Table verticalSpacing={2} highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>PRODUCTO</Table.Th>
                  <Table.Th>PRESENTACIÓN</Table.Th>
                  <Table.Th>LOTE</Table.Th>
                  <Table.Th>MEDIDA</Table.Th>
                  <Table.Th>LABORATORIO</Table.Th>
                  <Table.Th>STOCK</Table.Th>
                  <Table.Th>ESTADO</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </Paper>

          {/* Resumen de estadísticas */}
          <Group justify="space-between" mt="md">
            <Group gap="xs">
              <Text size="sm" c="dimmed">
                Monitoreando: {productos.length} productos
              </Text>
              {productosCriticos > 0 && (
                <Badge color="red" variant="light" size="sm">
                  {productosCriticos} críticos
                </Badge>
              )}
              {productosBajos > 0 && (
                <Badge color="orange" variant="light" size="sm">
                  {productosBajos} bajos
                </Badge>
              )}
            </Group>
          </Group>
        </>
      )}
    </Modal>
  );
}

export default ProductosBajosModal;