import { 
    IconShoppingCartPlus,
    IconEdit,
    IconTrash,
    IconArrowBackUp
} from '@tabler/icons-react';
import { Modal,
Button,
ThemeIcon,
Table,
Badge,
Paper,
Title, 
Alert, 
ScrollArea, 
Box, 
ActionIcon } from '@mantine/core';

function ProductoList({ 
productos,
onAgregarCarrito, 
onEditar, 
onReactivar,
onDesactivar,
mostrarDesactivados = false,
obtenerStockDisponible,
hayStockDisponible 
}) {
    //  Función mejorada para determinar si mostrar botón deshabilitado
    const puedeAgregarAlCarrito = (producto) => {
        if (mostrarDesactivados) return false;
        if (producto.estado !== 'activado') return false;
        
        // ✅ SOLO impedir cuando el stock disponible sea 0
        const stockDisponible = obtenerStockDisponible ? obtenerStockDisponible(producto.id) : producto.stock;
        return stockDisponible > 0;
      };
    const getTooltipMessage = (producto) => {
        if (mostrarDesactivados) return "Producto desactivado";
        if (producto.estado !== 'activado') return "Producto inactivo";
        if (!hayStockDisponible || !hayStockDisponible(producto)) {
          const stockDisponible = obtenerStockDisponible ? obtenerStockDisponible(producto.id) : producto.stock;
          return `Sin stock disponible. Stock: ${stockDisponible}`;
        }
        return "Agregar al carrito";
      };



      
      const getBadgeColor = (producto) => {
        const stockDisponible = obtenerStockDisponible ? obtenerStockDisponible(producto.id) : producto.stock;
        
        if (stockDisponible === 0) {
          return '#FF0000'; // Rojo - sin stock
        }
        if (stockDisponible <= 5) {
          return '#FF8000'; // Naranja - stock bajo (1-5)
        }
        if (stockDisponible <= 15) {
          return '#FFD700'; // Amarillo - stock medio (6-15)
        }
        return '#28a745'; // Verde - stock bueno (16+)
      };
    
    
    
      if (productos.length === 0) {
    return (
        <div >
            <p>No hay productos registrados.</p>
        </div>
    );
}
const filas = productos.map((producto) => {
    const stockDisponible = obtenerStockDisponible ? obtenerStockDisponible(producto.id) : producto.stock;
    const puedeAgregar = puedeAgregarAlCarrito(producto);
    return (

        <Table.Tr 
            key={producto.id} 
            withTableBorder
        >
            <Table.Td >
            {producto.codigo}
            </Table.Td>
            <Table.Td >
            {producto.lote}
            </Table.Td>
            <Table.Td >
            {producto.nombre}
            </Table.Td>
            <Table.Td >
                {producto.presentacion}
            </Table.Td>
            <Table.Td >
                {producto.medida}
            </Table.Td>
            <Table.Td>
                Bs {producto.precio_base}
            </Table.Td>
            <Table.Td>
                Bs {producto.precio_venta}
            </Table.Td>
            <Table.Td>
                <Badge 
                    color={getBadgeColor(producto)}
                    size="sm"
                    title={`Stock disponible: ${stockDisponible}`}
                >
                    {stockDisponible}
                    {obtenerStockDisponible && stockDisponible !== producto.stock && (
                    <span style={{fontSize: '0.7em', opacity: 0.7}}>
                        {" "}({producto.stock} total)
                    </span>
                    )}
                </Badge>
            </Table.Td>
            <Table.Td >
            {producto.fecha_expiracion}
            </Table.Td>
            <Table.Td >
            {producto.laboratorio}
            </Table.Td>
            <Table.Td>{producto.porcentaje_g}%</Table.Td>
            <Table.Td >
            {/* Mostrar botón de agregar al carrito solo si NO estamos en modo "sin stock" */}
                {!mostrarDesactivados && (
                <ActionIcon 
                variant={puedeAgregar ? "subtle" : "light"}
                color={puedeAgregar ? "green" : "gray"}
                size="xl" 
                onClick={() => puedeAgregar && onAgregarCarrito(producto)}
                disabled={!puedeAgregar}
                title={getTooltipMessage(producto)} // ✅ Tooltip informativo
                >
                <IconShoppingCartPlus size={20} />
                </ActionIcon>
            )}
            
            {/* Mostrar botón de reactivar cuando estamos en modo desactivados */}
            {mostrarDesactivados && (
                <ActionIcon 
                variant="subtle" 
                color="orange" 
                size="xl" 
                onClick={() => {
                    onReactivar(producto.id);
                }}
                >
                <IconArrowBackUp size={20} />
                </ActionIcon>
            )}
            
            {/* Botón de editar - siempre visible */}
            {!mostrarDesactivados && (
                <ActionIcon 
                variant="subtle" 
                color="yellow" 
                size="xl" 
                onClick={() => onEditar(producto)}
            >
                <IconEdit size={20}/>
            </ActionIcon>
            )}
            {/* Mostrar botón de desactivar solo en modo activado */}
            {!mostrarDesactivados && (
                <ActionIcon 
                variant="subtle" 
                color="red" 
                size="xl" 
                onClick={() => onDesactivar(producto)} // ← Cambiar a llamar al modal
                >
                <IconTrash size={20}/>
                </ActionIcon>
            )}

            </Table.Td>
        </Table.Tr>
        );
    });
return (

    <Paper 
        
    >
    <Box className="top-productos-content">
    <ScrollArea h={250}  scrollbarSize={20} scrollHideDelay={500} >
        <Table 
            verticalSpacing="sm"
        >
            <Table.Thead >
            <Table.Tr >
                <Table.Th>
                        idProducto
                </Table.Th>
                <Table.Th>
                Lote
                </Table.Th>
                <Table.Th>
                Nombre
                </Table.Th>
                <Table.Th>
                Presentacion
                </Table.Th>
                <Table.Th>
                medida
                </Table.Th>
                <Table.Th>
                Precio Base
                </Table.Th>
                <Table.Th>
                Precio Venta
                </Table.Th>
                <Table.Th>
                Stock
                </Table.Th>
                <Table.Th>
                Fecha Expiracion
                </Table.Th>
                <Table.Th>
                Laboratorio
                </Table.Th>
                <Table.Th>
                Ganancia %
                </Table.Th>
                <Table.Th>
                Acciones
                </Table.Th>
            </Table.Tr>
            </Table.Thead>
            <Table.Tbody >
            {filas}
            </Table.Tbody>
        </Table>
    </ScrollArea>
    </Box>

    {productos.length === 0 && (<p>No hay productos disponibles</p>)}

    </Paper>
);
}

export default ProductoList;