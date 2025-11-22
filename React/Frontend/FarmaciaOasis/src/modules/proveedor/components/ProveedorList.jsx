import { 
  Table, 
  ScrollArea, 
  ActionIcon, 
  Group, 
  Text
} from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';

/**
 * Componente para mostrar lista de proveedores en formato tabla
 * Diseño responsive con acciones de edición
 */
export function ProveedorList({ 
  proveedores, 
  onEditar,
  isMobile = false 
}) {
  /**
   * Genera las filas de la tabla con datos de proveedores
   * Adapta tamaños y estilos según el dispositivo
   */
  const filas = proveedores.map((proveedor) => (
    <Table.Tr key={proveedor.id_proveedor}>
      <Table.Td>
        <Text fw={500} size={isMobile ? "xs" : "sm"}>{proveedor.nombre}</Text>
      </Table.Td>
      <Table.Td>
        <Text size={isMobile ? "xs" : "sm"}>{proveedor.telefono}</Text>
      </Table.Td>
      <Table.Td>
        <Text size={isMobile ? "xs" : "sm"}>{proveedor.cantidad}</Text>
      </Table.Td>
      <Table.Td>
        <Text size={isMobile ? "xs" : "sm"}>{proveedor.concepto}</Text>
      </Table.Td>
      <Table.Td>
        <Text size={isMobile ? "xs" : "sm"}>
          {proveedor.precio_unitario ? `Bs ${proveedor.precio_unitario}` : 'Bs 0'}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text size={isMobile ? "xs" : "sm"}>
          {proveedor.precio_total ? `Bs ${proveedor.precio_total}` : 'Bs 0'}
        </Text>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          {/* Botón para editar proveedor */}
          <ActionIcon 
            variant="light" 
            color="yellow" 
            size={isMobile ? "sm" : "md"}
            onClick={() => onEditar(proveedor)}
          >
            <IconEdit size={isMobile ? 12 : 16} />
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
            <Table.Th>Nombre Proveedor</Table.Th>
            <Table.Th>Teléfono Proveedor</Table.Th>
            <Table.Th>Cantidad</Table.Th>
            <Table.Th>Concepto</Table.Th>
            <Table.Th>Precio Unit.</Table.Th>
            <Table.Th>Precio Total</Table.Th>
            <Table.Th>Acciones</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {/* Mensaje cuando no hay proveedores */}
          {filas.length > 0 ? filas : (
            <Table.Tr>
              <Table.Td colSpan={7} style={{ textAlign: 'center' }}>
                <Text c="dimmed" py="xl" size={isMobile ? "xs" : "sm"}>
                  No hay mercancía registrada
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}