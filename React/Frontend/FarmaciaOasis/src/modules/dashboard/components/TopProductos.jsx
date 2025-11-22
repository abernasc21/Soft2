import { Paper, Title, Table, Badge, Text, Group, ThemeIcon, Progress, Stack, ScrollArea, Box } from '@mantine/core';
import { IconCrown, IconStar, IconTrendingUp, IconAward } from '@tabler/icons-react';
import '../dashboard.css';

/**
 * Componente que muestra ranking de productos más vendidos
 * Incluye barras de progreso, posiciones con colores y estadísticas
 */
function TopProductos({ productos }) {
  const todosProductos = productos;
  const totalProductos = productos.length;
  
  // Calcular venta máxima para normalizar las barras de progreso
  const maxVentas = todosProductos.length > 0 
    ? Math.max(...todosProductos.map(p => p.ventas || 0))
    : 1;

  // Configuración de colores e iconos por posición en el ranking
  const getPositionColor = (index) => {
    const colors = {
      0: { badge: 'yellow', icon: 'gold', bg: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' },
      1: { badge: 'gray', icon: 'silver', bg: 'linear-gradient(135deg, #C0C0C0 0%, #A0A0A0 100%)' },
      2: { badge: 'orange', icon: 'bronze', bg: 'linear-gradient(135deg, #CD7F32 0%, #A0522D 100%)' },
      default: { badge: 'blue', icon: 'blue', bg: 'linear-gradient(135deg, #228BE6 0%, #1C7ED6 100%)' }
    };
    return colors[index] || colors.default;
  };

  const getPositionIcon = (index) => {
    const icons = {
      0: <IconCrown size={16} />,
      1: <IconAward size={16} />,
      2: <IconStar size={16} />,
      default: <IconTrendingUp size={16} />
    };
    return icons[index] || icons.default;
  };

  const getProgressColor = (index) => {
    if (index === 0) return 'yellow';
    if (index === 1) return 'gray';
    if (index === 2) return 'orange';
    return 'blue';
  };

  // Generar filas de la tabla con productos
  const rows = todosProductos.map((producto, index) => {
    const positionColors = getPositionColor(index);
    const porcentaje = maxVentas > 0 ? ((producto.ventas || 0) / maxVentas) * 100 : 0;
    const progressColor = getProgressColor(index);
    
    return (
      <Table.Tr key={producto.nombre} className="mantine-Table-tr">
        <Table.Td className="mantine-Table-td">
          {/* Badge de posición con icono y gradiente */}
          <Badge 
            size="md"
            variant="gradient"
            gradient={{ 
              from: positionColors.badge, 
              to: positionColors.badge, 
              deg: 135 
            }}
            leftSection={getPositionIcon(index)}
          >
            #{index + 1}
          </Badge>
        </Table.Td>
        
        <Table.Td className="mantine-Table-td">
          <Stack gap={2}>
            <Text fw={700} size="sm" c="dark.8" lineClamp={1}>
              {producto.nombre}
            </Text>
            <Badge 
              size="xs" 
              variant="light" 
              color="gray"
            >
              {producto.categoria || 'General'}
            </Badge>
          </Stack>
        </Table.Td>
        
        <Table.Td className="mantine-Table-td">
          <Stack gap="xs" w="100%">
            <Group justify="space-between" gap="xs">
              <Group gap={4}>
                <ThemeIcon size="sm" color="blue" variant="light">
                  <IconTrendingUp size={12} />
                </ThemeIcon>
                <Text fw={800} size="sm" c="blue.6">
                  {(producto.ventas || 0).toLocaleString('es-ES')}
                </Text>
              </Group>
              <Text size="xs" c="dimmed" fw={600}>
                {porcentaje.toFixed(0)}%
              </Text>
            </Group>
            
            {/* Barra de progreso que muestra volumen de ventas */}
            <Progress 
              value={porcentaje} 
              color={progressColor}
              size="sm"
              radius="xl"
            />
          </Stack>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Paper p="lg" withBorder radius="lg" shadow="md" className="top-productos-container">
      {/* Encabezado con título y estadísticas */}
      <Box className="top-productos-header">
        <Group justify="space-between" align="flex-start" mb="md">
          <Group gap="sm">
            <ThemeIcon 
              size="md" 
              variant="gradient"
              gradient={{ from: 'yellow', to: 'orange', deg: 135 }}
            >
              <IconCrown size={18} />
            </ThemeIcon>
            <div>
              <Title order={3} c="dark.8" className="top-productos-title">
                Top Productos
              </Title>
              <Text size="xs" c="dimmed" className="top-productos-subtitle">
                {totalProductos} productos en ranking
              </Text>
            </div>
          </Group>
          
          <Badge 
            size="md" 
            variant="gradient" 
            gradient={{ from: 'blue', to: 'cyan', deg: 135 }}
          >
            Top {totalProductos}
          </Badge>
        </Group>
      </Box>

      {/* Contenido principal con tabla scrollable */}
      <Box className="top-productos-content" style={{ height: '400px' }}>
        <ScrollArea h={400} className="mantine-ScrollArea-root" scrollbarSize={6} type="auto">
          <Table className="mantine-Table-table" verticalSpacing="sm">
            <Table.Thead className="mantine-Table-thead">
              <Table.Tr className="mantine-Table-tr">
                <Table.Th className="mantine-Table-th">Pos</Table.Th>
                <Table.Th className="mantine-Table-th">Producto</Table.Th>
                <Table.Th className="mantine-Table-th">Ventas</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody className="mantine-Table-tbody">
              {rows.length > 0 ? rows : (
                <Table.Tr>
                  <Table.Td colSpan={3} style={{ textAlign: 'center', padding: '2rem' }}>
                    <Text c="dimmed">No hay datos de productos vendidos</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Box>

      {/* Pie con total de ventas y contador */}
      <Box className="top-productos-footer">
        <Group justify="space-between" mt="md" p="sm">
          <Group gap="xs">
            <ThemeIcon size="xs" color="green" variant="light">
              <IconTrendingUp size={12} />
            </ThemeIcon>
            <div>
              <Text fw={700} size="xs" c="dark.7">Total Vendido</Text>
              <Text fw={800} size="sm" c="green.6">
                {todosProductos.reduce((sum, p) => sum + (p.ventas || 0), 0).toLocaleString('es-ES')}
              </Text>
            </div>
          </Group>
          
          {totalProductos > 10 && (
            <Text size="xs" c="dimmed" fw={600}>
              📜 {totalProductos} productos
            </Text>
          )}
        </Group>
      </Box>
    </Paper>
  );
}

export default TopProductos;