import { 
  IconBell,IconTrashOff,IconShoppingCart,IconTrashX,IconTrash,IconShoppingCartFilled,IconX
} from '@tabler/icons-react';
import { 
  Center,ThemeIcon,Stack,Switch,Badge,Text,Container,Flex,ActionIcon,Button,Space,Group,Drawer,AppShell} from '@mantine/core';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useProductos } from './hooks/useProductos';
import { useCarrito} from './hooks/useCarrito';
import { useModales } from './hooks/useModales'; 

import { Buscador  } from "./../global/components/buscador/Buscador";
import ProductoList from './components/ProductoList';
import ProductoForm from './components/ProductoForm';
import LaboratorioForm from './components/LaboratorioForm';
import VentaForm from './components/VentaForm';
import Modal from '../global/components/modal/Modal.jsx';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

function Inventario() {
  const {
    productos,
    laboratorios,
    agregarProducto,
    actualizarProducto,
    desactivarProducto,
    actualizarStockProducto,
    reactivarProducto,
    agregarLaboratorio,
    
    recargarProductos 
  } = useProductos();

  const {
    carrito,
    descuentoCliente,        // ✅ NUEVO
    agregarAlCarrito,
    modificarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    realizarVenta,
    actualizarDescuento,     // ✅ NUEVO
    totalVenta,
    totalSinDescuento,       // ✅ NUEVO
    montoDescuento,          // ✅ NUEVO
    hayStockDisponible,
    obtenerStockDisponible
  } = useCarrito(
    productos, 
    actualizarStockProducto, 
    recargarProductos 
  );

  const {
    modalProducto,
    modalLaboratorio,
    abrirModalProducto,
    cerrarModalProducto,
    abrirModalLaboratorio,
    cerrarModalLaboratorio,
  } = useModales();
  
  
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [mostrarDesactivados, setMostrarDesactivados] = useState(false);
  
  const [modalConfirmacionDesactivar, setModalConfirmacionDesactivar] = useState({
    abierto: false,
    producto: null
  });

  // Media queries para responsive
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });
  

  const abrirModalConfirmacionDesactivar = (producto) => {
    setModalConfirmacionDesactivar({
      abierto: true,
      producto
    });
  };

  const confirmarDesactivarProducto = () => {
    if (modalConfirmacionDesactivar.producto) {
      desactivarProducto(modalConfirmacionDesactivar.producto.id);
      setModalConfirmacionDesactivar({
        abierto: false,
        producto: null
      });
    }
  };

  const cerrarModalConfirmacionDesactivar = () => {
    setModalConfirmacionDesactivar({
      abierto: false,
      producto: null
    });
  };


const handleRealizarVenta = async (datosCliente) => {
  try {   
    // ✅ LLAMAR A LA FUNCIÓN DEL HOOK QUE CONECTA CON EL BACKEND
    const resultado = await realizarVenta(datosCliente);
    return resultado; // ✅ IMPORTANTE: Retornar el resultado
  } catch (error) {
    console.error('Error en handleRealizarVenta:', error);
    throw error; // ✅ Propagar el error
  }
};

  const handleSubmitProducto = (datos) => {
    if (modalProducto.producto) {
      actualizarProducto(modalProducto.producto.id, datos);
    } else {
      agregarProducto(datos);
    }
    cerrarModalProducto();
  };

  const [busqueda, setBusqueda] = useState('');
  
  const productosFiltrados = productos.filter(p => {
    const coincideBusqueda = 
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
      p.codigo.includes(busqueda.toUpperCase());
    
    if (mostrarDesactivados) {
      return coincideBusqueda && p.estado === "desactivado";
    }
    
    return coincideBusqueda && p.estado === 'activado';
  });
  
  // 1. En la transformación de resultados, agrega los campos que necesita la estructura:
const resultadosParaBuscador = productosFiltrados.map(p => ({
  id: p.id,
  label: p.nombre,                    
  nombre: p.nombre,                   
  codigo: p.codigo.toUpperCase(),     
  precio_venta: p.precio_venta,       
  laboratorio: p.laboratorio,  
  lote: p.lote,       
  category: 'Producto',              
  stock: p.stock,                     
  data: p                             
}));

// 2. La función renderizarResultado (igual a la de clientes):
const renderizarResultado = (resultado) => {
  return (
    <Group justify="space-between" w="100%">
      <div>
        <Text size="sm" fw={500}>
          {resultado.label}
        </Text>
        <Text size="xs" c="dimmed">
          Lote: {resultado.lote} • Stock: {resultado.stock}
        </Text>
      </div>
      <Text size="xs" c="blue" className="result-category">
        {resultado.category}
      </Text>
    </Group>
  );
};


  
  const handleResultSelect = (result) => {
    console.log("Producto seleccionado:", result);
  };
  
  const cantidadCarrito = carrito.reduce((total, item) => total + item.cantidad, 0);

  const generarReporteExcel = async () => {
    const productosConStock = productosFiltrados;

    if (!productosConStock || productosConStock.length === 0) {
      alert("No hay productos con stock para generar el reporte.");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Inventario");

    // Título
    worksheet.mergeCells("A1:K1");
    const titulo = worksheet.getCell("A1");
    titulo.value = "Reporte de Inventario";
    titulo.font = { bold: true, size: 16 };
    titulo.alignment = { horizontal: "center" };

    // Encabezadosz 
    worksheet.addRow([]);
    const encabezados = [
      "Nº",
      "Código",
      "Lote",
      "Nombre",
      "Presentación",
      "Precio Base (Bs)",
      "Precio Venta (Bs)",
      "Stock",
      "Fecha de Expiración",
      "Laboratorio",
      "% Ganancia"
    ];
    const headerRow = worksheet.addRow(encabezados);

    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "70E2FA" } 
      };
      cell.font = { bold: true, color: { argb: "000000" } };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" }
      };
    });

    // Filas de datos
    productosConStock.forEach((p, i) => {
      const row = worksheet.addRow([
        i + 1,
        p.codigo,
        p.lote,
        p.nombre,
        p.presentacion,
        p.precio_base?.toFixed(2) || "0.00",
        p.precio_venta?.toFixed(2) || "0.00",
        p.stock,
        p.fecha_expiracion,
        p.laboratorio,
        p.porcentaje_g + "%"
      ]);

      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" }
        };
        cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
      });
    });

    // Ajustar anchos de columna
    const widths = [5, 15, 15, 25, 20, 15, 15, 10, 18, 20, 12];
    widths.forEach((w, i) => worksheet.getColumn(i + 1).width = w);

    // Guardar archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const fechaActual = new Date().toISOString().split("T")[0];
    saveAs(new Blob([buffer]), `reporte-inventario-${fechaActual}.xlsx`);
  };

  return (
    <>
      <Container size="100%" py={isMobile ? "md" : "xl"} px={isMobile ? "xs" : "md"}>
        {/* Header responsive */}
        <Flex
          justify="space-between"
          align="center"
          mb={isMobile ? "md" : "xl"}
          gap="md"
          direction={isMobile ? "column" : "row"}
        >
          {/* En móvil, el título va arriba */}
          {isMobile && (
            <Text className="dashboard-title" size="xl" ta="center" w="100%">
              INVENTARIO
            </Text>
          )}
          
          {/* En desktop/tablet, el título centrado */}
          {!isMobile && (
            <Text 
              className="dashboard-title" 
              size="xl"
              style={{ 
                position: 'absolute', 
                left: '50%', 
                transform: 'translateX(-50%)' 
              }}
            >
              INVENTARIO
              
            </Text>
          )}
        </Flex>

        <br />


        {/* Barra de búsqueda centrada */}
        <Flex
          justify="center"
          mb="xl"
        >
        </Flex>


        {/* Switch para mostrar productos sin stock */}
          <Flex justify="space-between" align="center" gap="md" mb="xl" wrap="wrap">
            {/* Switch a la izquierda */}
            <Switch
              checked={mostrarDesactivados}
              onChange={(event) => setMostrarDesactivados(event.currentTarget.checked)}
              color="red"
              size={isMobile ? "sm" : "md"}
              label={
                <Text size={isMobile ? "sm" : "md"}>
                  {mostrarDesactivados ? 
                    <Badge size={isMobile ? "sm" : "lg"} color="red" variant="light">
                      <IconTrashX size={isMobile ? 16 : 20}/>
                    </Badge>
                    :
                    <Badge size={isMobile ? "sm" : "lg"} color="gray" variant="light">
                      <IconTrashOff size={isMobile ? 16 : 20}/>
                    </Badge>
                  }
                </Text>
              }
            />
            
            {/* Buscador en el centro */}
            <Buscador
              placeholder="Buscar por nombre o código..."
              value={busqueda}
              onChange={setBusqueda} 
              results={resultadosParaBuscador}
               renderResult={renderizarResultado}
              onResultSelect={handleResultSelect}
              style={{ width: '500px', marginLeft: '-80px' }}
            />
            
            {/* Carrito alineado a la derecha */}
            <ActionIcon 
              variant="subtle" 
              color="blue" 
              size="xl" 
              onClick={() => setSidebarAbierto(true)}
              style={{ position: 'relative', cursor: 'pointer' }}
            >
              <IconShoppingCart size={32} />
              {cantidadCarrito > 0 && (
                <Badge 
                  size="sm" 
                  circle 
                  color="red"
                  style={{ 
                    position: 'absolute', 
                    top: 2, 
                    right: 2,
                  }}
                >
                  {cantidadCarrito}
                </Badge>
              )}
            </ActionIcon>
          </Flex>
          
        {/* Tabla de productos */}
        <ProductoList 
          productos={productosFiltrados}
          onAgregarCarrito={agregarAlCarrito}
          onEditar={abrirModalProducto} 
          onDesactivar={abrirModalConfirmacionDesactivar} 
          onReactivar={reactivarProducto} 
          mostrarDesactivados={mostrarDesactivados}
          obtenerStockDisponible={obtenerStockDisponible}
          hayStockDisponible={hayStockDisponible} 

        />
        
        {/* Botones de acción responsive */}
        <Flex
          gap="lg"
          justify="center"
          align="center"
          direction={isMobile ? "column" : "row"}
          wrap="wrap"
          p="md"
          mt="xl"
        >
          <Flex 
            gap="lg" 
            justify="center" 
            align="center"
            direction={isMobile ? "column" : "row"}
            w={isMobile ? "100%" : "auto"}
          >
            <Button 
              size={isMobile ? "sm" : "md"}
              variant="light"
              onClick={() => abrirModalProducto()}
              fullWidth={isMobile}
            >
              Registrar Nuevo Producto
            </Button>
            
            <Button 
              size={isMobile ? "sm" : "md"}
              variant="light"
              onClick={abrirModalLaboratorio}
              fullWidth={isMobile}
            >
              Registrar Nuevo Laboratorio
            </Button>
          </Flex>

          <Button 
            size={isMobile ? "sm" : "md"}
            variant="light"
            onClick={generarReporteExcel}
            fullWidth={isMobile}
            mt={isMobile ? "md" : 0}
          >
            Generar Reporte Excel
          </Button>
        </Flex>

        {/* Modal de confirmación para desactivar producto */}
        {modalConfirmacionDesactivar.abierto && (
          <Modal 
            titulo={<span className="titulo-gradiente">Confirmar Eliminación</span>}
            onClose={cerrarModalConfirmacionDesactivar}
            tamaño={isMobile ? 'normal' : 'normal'}
          >
            <div style={{ padding: isMobile ? '0.5rem' : '1rem' }}>
              <Center>
                <ActionIcon variant="subtle" color="red" size={isMobile ? "xl" : "xxl"}>
                  <IconTrash size={isMobile ? 40 : 60}/> 
                </ActionIcon>
              </Center>
              <Text size={isMobile ? "md" : "lg"} mb="md" ta="center">
                ¿Estás seguro de que deseas desactivar el producto?
              </Text>
              <Text size={isMobile ? "xs" : "sm"} color="dimmed" mb="xl" ta="center">
                Producto: <strong>{modalConfirmacionDesactivar.producto?.nombre}</strong>
                <br />
                Código: <strong>{modalConfirmacionDesactivar.producto?.codigo}</strong>
                <br />
                <br />
                El producto se moverá a la lista de productos desactivados y no estará disponible para ventas.
              </Text>
              
              <div className="mantine-form-actions" style={{ 
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '0.5rem' : '1rem'
              }}>
                <Button 
                  color="red" 
                  onClick={confirmarDesactivarProducto}
                  className="btn-agregar"
                  fullWidth={isMobile}
                  size={isMobile ? "sm" : "md"}
                >
                  Sí, Desactivar
                </Button>
                <Button 
                  variant="light" 
                  onClick={cerrarModalConfirmacionDesactivar}
                  className="btn-cancelar"
                  fullWidth={isMobile}
                  size={isMobile ? "sm" : "md"}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Modal Agregar/Editar Producto */}
        {modalProducto.abierto && (
          <Modal 
            titulo={modalProducto.producto ? "Editar Producto" : "Agregar Nuevo Producto"}
            onClose={cerrarModalProducto}
            tamaño={isMobile ? 'normal' : 'grande'}
          >
            <ProductoForm
              laboratorios={laboratorios}
              producto={modalProducto.producto}
              onSubmit={handleSubmitProducto}
              onCancel={cerrarModalProducto}
              isMobile={isMobile}
            />
          </Modal>
        )}

        {/* Modal Agregar Laboratorio */}
        {modalLaboratorio && (
          <Modal 
            titulo="Agregar Nuevo Laboratorio"
            onClose={cerrarModalLaboratorio}
            tamaño={isMobile ? 'normal' : 'normal'}
          >
            <LaboratorioForm
              onSubmit={(datosLaboratorio) => {
                agregarLaboratorio(datosLaboratorio);
                cerrarModalLaboratorio();
              }}
              onCancel={cerrarModalLaboratorio}
              isMobile={isMobile}
            />
          </Modal>
        )}
      </Container>

      {/* Sidebar del Carrito responsive */}
      <Drawer
        opened={sidebarAbierto}
        onClose={() => setSidebarAbierto(false)}
        position="right"
        size={isMobile ? "100%" : isTablet ? "md" : "md"}
        padding={isMobile ? "xs" : "md"}
      >
        <Flex justify="space-between" align="center" mb="lg">
          <ThemeIcon size={isMobile ? "lg" : "xl"} variant="light">
            <IconShoppingCartFilled size={isMobile ? 20 : 24}/>  
          </ThemeIcon>
          <Text size={isMobile ? "md" : "lg"} fw={600}>
            Carrito de Compras
          </Text>
        </Flex>
        
        <VentaForm
          carrito={carrito}
          totalVenta={totalVenta}
          totalSinDescuento={totalSinDescuento}    // ✅ NUEVO
          montoDescuento={montoDescuento}          // ✅ NUEVO
          descuentoCliente={descuentoCliente}      // ✅ NUEVO
          onModificarCantidad={modificarCantidad}
          onEliminarItem={eliminarDelCarrito}
          onVaciarCarrito={vaciarCarrito}
          onRealizarVenta={handleRealizarVenta}
          onActualizarDescuento={actualizarDescuento} // ✅ NUEVO
          onCancel={() => setSidebarAbierto(false)}
          isMobile={isMobile}
        />
      </Drawer>
    </>
  );
}

export default Inventario;