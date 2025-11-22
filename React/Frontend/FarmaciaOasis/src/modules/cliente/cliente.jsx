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
import { IconPlus, IconX, IconUsers, IconTrash } from '@tabler/icons-react';
import { useClientes } from './hooks/useClientes';
import { ClienteList } from './components/ClienteList';
import { ClienteForm } from './components/ClienteForm';
import { Buscador } from '../global/components/buscador/Buscador';
import { useMediaQuery } from 'react-responsive';
import Modal from '../global/components/modal/Modal'
import './cliente.css';

/**
 * Página principal de gestión de clientes
 * Incluye lista, formulario, búsqueda y eliminación
 */
export function ClientePage() {
  const {
    clientes,
    cargando,
    clienteEditando,
    mostrarForm,
    busqueda,
    setBusqueda,
    resultadosBusqueda,
    clienteAEliminar,
    mostrarConfirmacion,
    setClienteEditando,
    setMostrarForm,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
    solicitarEliminacion,
    cancelarEliminacion,
    manejarSeleccionResultado,
  } = useClientes();

  // Breakpoints responsive
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });
  const isDesktop = useMediaQuery({ minWidth: 1025 });

  /**
   * Maneja el guardado de clientes (creación y actualización)
   * Preserva el estado original del cliente al editar
   */
  const handleGuardarCliente = async (datosCliente) => {
    try {
      if (clienteEditando) {
        await actualizarCliente({
          ...datosCliente,
          cod_cli: clienteEditando.cod_cli,
          estado: clienteEditando.estado // ← MANTENER EL ESTADO ORIGINAL
        });
      } else {
        await crearCliente(datosCliente);
      }
      cerrarFormulario();
    } catch (error) {
      console.error('Error guardando cliente:', error);
    }
  };

  /**
   * Abre el formulario en modo creación
   */
  const abrirNuevoCliente = () => {
    setClienteEditando(null);
    setMostrarForm(true);
  };

  /**
   * Abre el formulario en modo edición
   */
  const abrirEditarCliente = (cliente) => {
    setClienteEditando(cliente);
    setMostrarForm(true);
  };

  /**
   * Cierra el formulario y limpia el estado
   */
  const cerrarFormulario = () => {
    setMostrarForm(false);
    setClienteEditando(null);
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
  const renderizarResultado = (resultado) => {
    return (
      <Group justify="space-between" w="100%">
        <div>
          <Text size="sm" fw={500}>
            {resultado.label}
          </Text>
          <Text size="xs" c="dimmed">
            CI/NIT: {resultado.ci_nit}
          </Text>
        </div>
        <Text size="xs" c="blue" className="result-category">
          {resultado.category}
        </Text>
      </Group>
    );
  };

  return (
    <div className="cliente-page">
      <Container size="xl" py="xl" px={isMobile ? "xs" : "md"}>
        
        {/* Header Responsive */}
        <Group justify="space-between" mb="xl" wrap={isMobile ? "wrap" : "nowrap"} gap={isMobile ? "md" : "lg"}>
          <Group gap="md" wrap="nowrap">
            <div className="header-icon">
              <IconUsers size={isMobile ? 24 : 32} />
            </div>
            <div>
              <Title 
                order={isMobile ? 2 : 1} 
                className="gradient-title"
                style={{ fontSize: isMobile ? '28px' : '32px' }}
              >
                Gestión de Clientes
              </Title>
              <Text c="dimmed" size={isMobile ? "xs" : "sm"}>
                Administra tu lista de clientes
              </Text>
            </div>
          </Group>
          
          {/* Botón nuevo cliente (solo visible cuando el formulario está cerrado) */}
          {!mostrarForm && (
            <Button 
              leftSection={<IconPlus size={isMobile ? 14 : 18} />}
              onClick={abrirNuevoCliente}
              size={isMobile ? "sm" : "md"}
              fullWidth={isMobile}
            >
              Nuevo Cliente
            </Button>
          )}
        </Group>

        <Grid gutter={isMobile ? "md" : "xl"} align="start">
          
          {/* Lista de clientes */}
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
                      Lista de Clientes
                    </Title>
                    <Text c="dimmed" size={isMobile ? "xs" : "sm"}>
                      {clientes.length} cliente(s) activo(s)
                      {busqueda && ` - Buscando: "${busqueda}"`}
                      {cargando && " - Cargando..."}
                    </Text>
                  </div>
                </Group>
                
                {/* Componente de búsqueda */}
                <Box className="buscador-container">
                  <Buscador
                    placeholder="Buscar clientes..."
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
              
              {/* Lista de clientes */}
              <ClienteList
                clientes={clientes}
                onEditar={abrirEditarCliente}
                onEliminar={solicitarEliminacion}
                isMobile={isMobile}
              />
            </Paper>
          </Grid.Col>

          {/* Formulario de cliente (condicional) */}
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
                        {clienteEditando ? 'Editar Cliente' : 'Nuevo Cliente'}
                      </Title>
                      <Text c="dimmed" size={isMobile ? "xs" : "sm"}>
                        {clienteEditando ? 'Modifica la información' : 'Completa los datos'}
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
                
                {/* Formulario de cliente */}
                <ClienteForm
                  cliente={clienteEditando}
                  onGuardar={handleGuardarCliente}
                  isMobile={isMobile}
                  clientes={clientes} // ← Prop esencial para validación de duplicados
                />
              </Card>
            </Grid.Col>
          )}
        </Grid>

        {/* Modal de Confirmación de Eliminación */}
        {mostrarConfirmacion && clienteAEliminar && (
          <Modal
            titulo={<span className="titulo-gradiente">Confirmar Eliminación</span>}
            onClose={cancelarEliminacion}
            tamaño="normal"
          >
            <div className="modal-eliminar-content">
              <div className="eliminar-icon">
                <IconTrash size={48} color="#e53e3e" />
              </div>
              
              <Text ta="center" size="lg" fw={600} mb="md">
                ¿Estás seguro de que quieres eliminar este cliente?
              </Text>
              
              <Paper withBorder p="md" mb="xl" style={{ textAlign: 'center' }}>
                <Text fw={500}>{clienteAEliminar.nombre}</Text>
                <Text size="sm" c="dimmed">CI/NIT: {clienteAEliminar.ci_nit}</Text>
              </Paper>
              
              <Text ta="center" c="dimmed" size="sm" mb="xl">
                ⚠️ El cliente cambiará a estado "inactivo" y no aparecerá en la lista principal.
              </Text>

              <Group justify="center" gap="md">
                <Button 
                  variant="light" 
                  onClick={cancelarEliminacion}
                  size="md"
                  className="btn-cancelar"
                >
                  Cancelar
                </Button>
                <Button 
                  color="red" 
                  onClick={() => eliminarCliente(clienteAEliminar.cod_cli)}  
                  size="md"
                  leftSection={<IconTrash size={16} />}
                  className="btn-confirmar"
                >
                  Confirmar Eliminación
                </Button>
              </Group>
            </div>
          </Modal>
        )}
      </Container>
    </div>
  );
}