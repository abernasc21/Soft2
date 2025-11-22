import { 
  Container, 
  Title, 
  Button, 
  Group, 
  Paper,
  Grid,
  Card,
  ActionIcon,
  Text,
  Divider,
  Box
} from '@mantine/core';
import { IconPlus, IconX, IconTruck } from '@tabler/icons-react';
import { useProveedores } from './hooks/useProveedores';
import { ProveedorList } from './components/ProveedorList';
import { ProveedorForm } from './components/ProveedorForm';
import { Buscador } from '../global/components/buscador/Buscador';
import { useMediaQuery } from 'react-responsive';
import './proveedor.css';

/**
 * Página principal de gestión de proveedores y mercancía
 * Incluye lista, formulario y búsqueda con diseño responsive
 */
export function ProveedorPage() {
  const {
    proveedores,
    proveedoresOriginales,
    proveedorEditando,
    mostrarForm,
    busqueda,
    cargando,
    setBusqueda,
    resultadosBusqueda,
    setProveedorEditando,
    setMostrarForm,
    crearProveedor,
    actualizarProveedor,
    manejarSeleccionResultado,
  } = useProveedores();

  // Breakpoints responsive
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });
  const isDesktop = useMediaQuery({ minWidth: 1025 });

  /**
   * Maneja el guardado de proveedores (creación y actualización)
   */
  const handleGuardarProveedor = async (datosProveedor) => {
    try {
      if (proveedorEditando) {
        await actualizarProveedor({
          ...datosProveedor,
          id_proveedor: proveedorEditando.id_proveedor
        });
      } else {
        await crearProveedor(datosProveedor);
      }
      cerrarFormulario();
    } catch (error) {
      console.error('Error guardando mercancía:', error);
    }
  };

  /**
   * Abre el formulario en modo creación
   */
  const abrirNuevoProveedor = () => {
    setProveedorEditando(null);
    setMostrarForm(true);
  };

  /**
   * Abre el formulario en modo edición
   */
  const abrirEditarProveedor = (proveedor) => {
    setProveedorEditando(proveedor);
    setMostrarForm(true);
  };

  /**
   * Cierra el formulario y limpia el estado
   */
  const cerrarFormulario = () => {
    setMostrarForm(false);
    setProveedorEditando(null);
  };

  /**
   * Calcula los spans del grid según el dispositivo y estado del formulario
   */
  const getGridSpans = () => {
    if (isMobile) {
      return mostrarForm ? { lista: 12, form: 12 } : { lista: 12, form: 12 };
    }
    if (isTablet) {
      return mostrarForm ? { lista: 7, form: 5 } : { lista: 12, form: 0 };
    }
    return mostrarForm ? { lista: 8, form: 4 } : { lista: 12, form: 0 };
  };

  const gridSpans = getGridSpans();

  /**
   * Renderiza cada resultado de búsqueda con formato específico
   */
  const renderizarResultado = (resultado) => (
    <Group justify="space-between" w="100%">
      <div>
        <Text size="sm" fw={500}>
          {resultado.label}
        </Text>
        <Text size="xs" c="dimmed">
          {resultado.telefono} • {resultado.concepto}
        </Text>
      </div>
      <Text size="xs" c="blue" className="result-category">
        {resultado.category}
      </Text>
    </Group>
  );

  return (
    <div className="proveedor-page">
      <Container size="xl" py="xl" px={isMobile ? "xs" : "md"}>
        
        {/* Header Responsive */}
        <Group justify="space-between" mb="xl" wrap={isMobile ? "wrap" : "nowrap"} gap={isMobile ? "md" : "lg"}>
          <Group gap="md" wrap="nowrap">
            <div className="header-icon">
              <IconTruck size={isMobile ? 24 : 32} />
            </div>
            <div>
              <Title 
                order={isMobile ? 2 : 1} 
                className="gradient-title"
                style={{ fontSize: isMobile ? '28px' : '32px' }}
              >
                Proveedores y Mercancía
              </Title>
              <Text c="dimmed" size={isMobile ? "xs" : "sm"}>
                Administra tu inventario de mercancía
              </Text>
            </div>
          </Group>
          
          {/* Botón nuevo proveedor (solo visible cuando el formulario está cerrado) */}
          {!mostrarForm && (
            <Button 
              leftSection={<IconPlus size={isMobile ? 14 : 18} />}
              onClick={abrirNuevoProveedor}
              size={isMobile ? "sm" : "md"}
              fullWidth={isMobile}
            >
              Agregar Mercancía
            </Button>
          )}
        </Group>

        <Grid gutter={isMobile ? "md" : "xl"} align="start">
          
          {/* Lista de proveedores */}
          <Grid.Col span={gridSpans.lista}>
            <Paper withBorder p={isMobile ? "sm" : "md"} radius="md" className="list-container">
              <div className="card-header">
                <Group 
                  justify="space-between" 
                  align={isMobile ? "flex-start" : "flex-end"} 
                  mb="md"
                  wrap={isMobile ? "wrap" : "nowrap"}
                  gap={isMobile ? "sm" : "md"}
                >
                  <div>
                    <Title order={isMobile ? 3 : 2} className="gradient-title">
                      Recepción de Mercancía
                    </Title>
                    <Text c="dimmed" size={isMobile ? "xs" : "sm"}>
                      {proveedores.length} registro(s)
                      {busqueda && ` - Buscando: "${busqueda}"`}
                      {cargando && " - Cargando..."}
                    </Text>
                  </div>
                </Group>
                
                {/* Componente de búsqueda responsive */}
                <Box className="buscador-container">
                  <Buscador
                    placeholder="Buscar Proveedor ..."
                    value={busqueda}
                    onChange={setBusqueda}
                    onSearch={(valor) => console.log('Buscando:', valor)}
                    onClear={() => setBusqueda('')}
                    onResultSelect={manejarSeleccionResultado}
                    results={resultadosBusqueda}
                    renderResult={renderizarResultado}
                    width="100%"
                    maxWidth={isMobile ? "100%" : "500px"}
                    withShortcut={!isMobile}
                    withSearchButton={false}
                    autoFocus={false}
                    size={isMobile ? "sm" : "md"}
                  />
                </Box>
              </div>
              <Divider my="md" />
              
              {/* Lista de proveedores */}
              <ProveedorList
                proveedores={proveedores}
                onEditar={abrirEditarProveedor}
                isMobile={isMobile}
              />
            </Paper>
          </Grid.Col>

          {/* Formulario de proveedor (condicional) */}
          {mostrarForm && (
            <Grid.Col span={gridSpans.form}>
              <Card 
                withBorder 
                shadow="lg" 
                p={isMobile ? "md" : "lg"} 
                radius="md" 
                className="form-card"
                style={{
                  position: 'relative',
                  top: 'auto',
                  left: 'auto', 
                  right: 'auto',
                  bottom: 'auto',
                  zIndex: 1,
                  margin: '0 auto',
                  height: 'auto',
                  overflowY: 'visible'
                }}
              >
                <div className="form-header">
                  <Group justify="space-between" align="center" wrap="nowrap">
                    <div>
                      <Title order={isMobile ? 4 : 3} className="gradient-title">
                        {proveedorEditando ? 'Modificar' : 'Agregar Mercancía'}
                      </Title>
                      <Text c="dimmed" size={isMobile ? "xs" : "sm"}>
                        {proveedorEditando ? 'Actualiza la información' : 'Registra nueva mercancía'}
                      </Text>
                    </div>
                    {/* Botón cerrar formulario */}
                    <ActionIcon
                      size={isMobile ? "md" : "lg"}
                      onClick={cerrarFormulario}
                      className="close-btn"
                    >
                      <IconX size={isMobile ? 16 : 20} />
                    </ActionIcon>
                  </Group>
                </div>
                <Divider my="md" />
                
                {/* Formulario de proveedor */}
                <ProveedorForm
                  proveedor={proveedorEditando}
                  onGuardar={handleGuardarProveedor}
                  isMobile={isMobile}
                  proveedores={proveedoresOriginales}
                />
              </Card>
            </Grid.Col>
          )}
        </Grid>
      </Container>
    </div>
  );
}