import { 
  Table, 
  ScrollArea, 
  ActionIcon, 
  Group, 
  Text,
  Badge
} from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';

/**
 * Componente de lista para mostrar clientes en formato tabla
 * Incluye acciones de editar y eliminar con diseño responsive
 */
export function ClienteList({ 
  clientes, 
  onEditar, 
  onEliminar,
  isMobile = false 
}) {
  /**
   * Genera las filas de la tabla con datos de clientes
   * Adapta tamaños y estilos según el dispositivo
   */
  const filas = clientes.map((cliente) => (
    <Table.Tr key={cliente.cod_cli}>
      <Table.Td>
        <Text fw={500} size={isMobile ? "xs" : "sm"}>{cliente.nombre}</Text>
      </Table.Td>
      <Table.Td>
        <Text size={isMobile ? "xs" : "sm"}>{cliente.ci_nit}</Text>
      </Table.Td>
      <Table.Td>
        <Badge 
          color={cliente.descuento > 0 ? "blue" : "gray"} 
          size={isMobile ? "sm" : "md"}
        >
          {cliente.descuento}%
        </Badge>
      </Table.Td>
      <Table.Td>
        <Badge 
          color={cliente.estado === 'activo' ? "green" : "red"} 
          size={isMobile ? "sm" : "md"}
        >
          {cliente.estado}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ActionIcon 
            variant="light" 
            color="yellow" 
            size={isMobile ? "sm" : "md"}
            onClick={() => onEditar(cliente)}
          >
            <IconEdit size={isMobile ? 12 : 16} />
          </ActionIcon>
          <ActionIcon 
            variant="light" 
            color="red"
            size={isMobile ? "sm" : "md"}
            onClick={() => onEliminar(cliente)}
          >
            <IconTrash size={isMobile ? 12 : 16} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea>
      <Table verticalSpacing={isMobile ? "xs" : "sm"} fontSize={isMobile ? "xs" : "sm"}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nombre</Table.Th>
            <Table.Th>CI/NIT</Table.Th>
            <Table.Th>Descuento</Table.Th>
            <Table.Th>Estado</Table.Th>
            <Table.Th>Acciones</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filas.length > 0 ? filas : (
            <Table.Tr>
              <Table.Td colSpan={5} style={{ textAlign: 'center' }}>
                <Text c="dimmed" py="xl" size={isMobile ? "xs" : "sm"}>
                  No hay clientes registrados
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}