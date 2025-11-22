import { useState, useEffect } from 'react';
import { 
  ScrollArea, Box, Group, Text, Button, ActionIcon,Flex, ThemeIcon,Badge,Stack,Modal,TextInput, Select,Alert, Radio
} from '@mantine/core';
import { 
  IconPlus, IconMinus, IconTrash, IconUser,IconShoppingCartExclamation,IconReceiptDollar,IconInvoice,IconDownload,IconPrinter,IconCheck, IconQrcode, IconCash, IconCurrencyDollar, IconLock,IconAlertCircle 
} from '@tabler/icons-react';
import { generarPDFVenta,
  imprimirComprobante } from '../utils/generarPDF';
import clienteService from '../services/clienteService';

function VentaForm({ 
  carrito, 
  totalVenta, 
  totalSinDescuento,
  montoDescuento,
  descuentoCliente,
  onModificarCantidad, 
  onEliminarItem, 
  onVaciarCarrito, 
  onRealizarVenta, 
  onActualizarDescuento,
  onCancel
}) {
  
  const [detallesVentaReal, setDetallesVentaReal] = useState(null);
  const [modalClienteAbierto, setModalClienteAbierto] = useState(false);
  const [modalExitoAbierto, setModalExitoAbierto] = useState(false);
  const [modalPagoRapidoAbierto, setModalPagoRapidoAbierto] = useState(false);
  const [datosVentaConfirmada, setDatosVentaConfirmada] = useState(null);
  const [numeroVentaGenerado, setNumeroVentaGenerado] = useState('');
  const [metodoPagoRapido, setMetodoPagoRapido] = useState('efectivo');
  const [buscandoCliente, setBuscandoCliente] = useState(false);
  
  // ✅ NUEVO: Estado para manejar errores y campos tocados
  const [errores, setErrores] = useState({});
  const [tocado, setTocado] = useState({});
  
  const [datosCliente, setDatosCliente] = useState({
    nombre: '',
    ci_nit: '',
    metodo_pago: 'efectivo'
  });

  // ✅ NUEVO: Función para verificar si el formulario es válido
  const esFormularioValido = () => {
    const { nombre, ci_nit, metodo_pago } = datosCliente;
    
    // Campos obligatorios no vacíos
    if (!nombre.trim() || !ci_nit.trim() || !metodo_pago) {
      return false;
    }
    
    // Sin errores de validación
    if (Object.keys(errores).length > 0) {
      return false;
    }
    
    // Validaciones específicas
    if (nombre.length < 2 || ci_nit.length < 3) {
      return false;
    }
    
    return true;
  };

  // ✅ NUEVO: Función de validación
  const validarCampo = (nombre, valor) => {
    const nuevosErrores = { ...errores };
    
    switch (nombre) {
      case 'nombre':
        if (!valor.trim()) {
          nuevosErrores.nombre = 'El nombre del cliente es requerido';
        } else if (valor.length < 2) {
          nuevosErrores.nombre = 'El nombre debe tener al menos 2 caracteres';
        } else if (valor.length > 100) {
          nuevosErrores.nombre = 'El nombre no puede tener más de 100 caracteres';
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.'-]*$/.test(valor)) {
          nuevosErrores.nombre = 'El nombre solo puede contener letras y espacios';
        } else {
          delete nuevosErrores.nombre;
        }
        break;

      case 'ci_nit':
        if (!valor.trim()) {
          nuevosErrores.ci_nit = 'El CI/NIT es requerido';
        } else if (valor.length < 3) {
          nuevosErrores.ci_nit = 'El CI/NIT debe tener al menos 3 caracteres';
        } else if (valor.length > 15) {
          nuevosErrores.ci_nit = 'El CI/NIT no puede tener más de 15 caracteres';
        } else if (!/^[0-9a-zA-Z]+$/.test(valor)) {
          nuevosErrores.ci_nit = 'Solo se permiten números y letras';
        } else {
          delete nuevosErrores.ci_nit;
        }
        break;

      case 'metodo_pago':
        if (!valor) {
          nuevosErrores.metodo_pago = 'El método de pago es requerido';
        } else {
          delete nuevosErrores.metodo_pago;
        }
        break;

      default:
        break;
    }

    setErrores(nuevosErrores);
  };

  // ✅ NUEVO: Función para manejar cambios en los campos
  const handleChange = (name, value) => {
    setDatosCliente(prev => ({
      ...prev,
      [name]: value
    }));

    // Validar en tiempo real si el campo ya fue tocado
    if (tocado[name]) {
      validarCampo(name, value);
    }
  };

  // ✅ NUEVO: Función para manejar blur de los campos
  const handleBlur = (name, value) => {
    setTocado(prev => ({ ...prev, [name]: true }));
    validarCampo(name, value);
  };

  // ✅ NUEVO: Función para validar todo el formulario
  const validarFormulario = () => {
    const nuevosTocados = {};
    Object.keys(datosCliente).forEach(key => {
      nuevosTocados[key] = true;
    });
    setTocado(nuevosTocados);

    Object.keys(datosCliente).forEach(key => {
      validarCampo(key, datosCliente[key]);
    });

    return Object.keys(errores).length === 0 && esFormularioValido();
  };

  // ✅ NUEVO: Función para buscar cliente automáticamente
  const buscarClientePorCI = async (ci_nit) => {
    if (!ci_nit || ci_nit.length < 3) {
      return;
    }

    setBuscandoCliente(true);
    try {
      const cliente = await clienteService.buscarClientePorCIExacto(ci_nit);
      if (cliente) {
        // ✅ Autocompletar datos del cliente encontrado
        setDatosCliente(prev => ({
          ...prev,
          nombre: cliente.nombre,
          ci_nit: cliente.ci_nit
        }));
        
        // ✅ Actualizar el descuento en el carrito
        if (onActualizarDescuento) {
          onActualizarDescuento(cliente.descuento || 0);
        }
        
        console.log('Cliente encontrado:', cliente.nombre, 'Descuento:', cliente.descuento + '%');
      } else {
        // ✅ Si no se encuentra cliente, resetear descuento
        if (onActualizarDescuento) {
          onActualizarDescuento(0);
        }
      }
    } catch (error) {
      console.error('Error al buscar cliente:', error);
    } finally {
      setBuscandoCliente(false);
    }
  };

  // ✅ NUEVO: useEffect para buscar automáticamente cuando cambia el CI
  useEffect(() => {
    const timer = setTimeout(() => {
      if (datosCliente.ci_nit && datosCliente.ci_nit.length >= 3) {
        buscarClientePorCI(datosCliente.ci_nit);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [datosCliente.ci_nit]);

  // En handleSubmit:
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    
    // ✅ NUEVO: Validar formulario antes de enviar
    if (!validarFormulario()) {
      return;
    }
    
    try {
      const ventaRealizada = await onRealizarVenta(datosCliente);
      
      if (ventaRealizada.clienteReactivado) {
        alert('ℹ️ El cliente estaba inactivo y ha sido reactivado automáticamente.');
      }
      
      const numeroVenta = `V${String(ventaRealizada.id_venta).padStart(6, '0')}`;
      setNumeroVentaGenerado(numeroVenta);
      setDatosVentaConfirmada({
        ...datosCliente,
        ventaId: ventaRealizada.id_venta
      });
      
      setDetallesVentaReal({
        ...ventaRealizada,
        totalReal: ventaRealizada.total
      });
      
      setModalExitoAbierto(true);
      setModalClienteAbierto(false);
      
      // ✅ NUEVO: Resetear formulario
      setDatosCliente({
        nombre: '',
        ci_nit: '',
        metodo_pago: 'efectivo'
      });
      setErrores({});
      setTocado({});
    } catch (error) {
      alert('Error al realizar la venta: ' + error.message);
    }
  };

  // ✅ NUEVA FUNCIÓN MEJORADA PARA VENTA RÁPIDA
  const handleVentaRapida = async () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    
    setModalPagoRapidoAbierto(true);
  };

  // ✅ NUEVA FUNCIÓN PARA CONFIRMAR VENTA RÁPIDA CON MÉTODO DE PAGO
  const confirmarVentaRapida = async () => {
    try {
      const datosVentaRapida = {
        nombre: 'S/N',
        ci_nit: '123',
        metodo_pago: metodoPagoRapido 
      };
      
      const ventaRealizada = await onRealizarVenta(datosVentaRapida);
      
      const numeroVenta = `V${String(ventaRealizada.id_venta).padStart(6, '0')}`;
      setNumeroVentaGenerado(numeroVenta);
      setDatosVentaConfirmada({
        ...datosVentaRapida,
        ventaId: ventaRealizada.id_venta
      });
      
      setDetallesVentaReal({
        ...ventaRealizada,
        totalReal: ventaRealizada.total
      });
      
      setModalExitoAbierto(true);
      setModalPagoRapidoAbierto(false);
    } catch (error) {
      alert('Error al realizar la venta rápida: ' + error.message);
      setModalPagoRapidoAbierto(false);
    }
  };

  const abrirModalVenta = () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    setModalClienteAbierto(true);
  };
  
  const cerrarModalExito = () => {
    setModalExitoAbierto(false);
    onVaciarCarrito();
    onCancel();
  };

  // ✅ FUNCIÓN MEJORADA PARA GENERAR PDF CON DATOS REALES
  const generarPDFConDatosReales = () => {
    if (!detallesVentaReal) {
      console.error('No hay detalles de venta disponibles');
      return;
    }

    generarPDFVenta(
      datosVentaConfirmada,
      detallesVentaReal.productosVendidos || carrito,
      detallesVentaReal.total || totalVenta,
      numeroVentaGenerado,
      {
        totalSinDescuento: detallesVentaReal.total_sin_descuento || totalSinDescuento,
        montoDescuento: detallesVentaReal.descuento_aplicado || montoDescuento,
        porcentajeDescuento: detallesVentaReal.porcentaje_descuento || descuentoCliente
      }
    );
  };

  // ✅ FUNCIÓN MEJORADA PARA IMPRIMIR CON DATOS REALES
  const imprimirConDatosReales = () => {
    if (!detallesVentaReal) {
      console.error('No hay detalles de venta disponibles');
      return;
    }

    imprimirComprobante(
      datosVentaConfirmada,
      detallesVentaReal.productosVendidos || carrito,
      detallesVentaReal.total || totalVenta,
      numeroVentaGenerado,
      {
        totalSinDescuento: detallesVentaReal.total_sin_descuento || totalSinDescuento,
        montoDescuento: detallesVentaReal.descuento_aplicado || montoDescuento,
        porcentajeDescuento: detallesVentaReal.porcentaje_descuento || descuentoCliente
      }
    );
  };

  if (carrito.length === 0 && !datosVentaConfirmada) {
    return (
      <Box ta="center" py="xl">
        <ActionIcon 
          variant="subtle" 
          color="blue" 
          size="xl" 
          onClick={onCancel}
        >
          <IconShoppingCartExclamation size={80} />
        </ActionIcon>
        <Text c="dimmed" mb="lg">El carrito está vacío</Text>
        <Button onClick={onCancel} variant="light">
          Continuar Comprando
        </Button>
      </Box>
    );
  }

  const hayErrores = Object.keys(errores).length > 0;
  const formularioValido = esFormularioValido();

  return (
    <>
      <Box>
        <ScrollArea flex={1} mb="md">
          <Stack gap="sm">
            {carrito.map(item => (
              <Box 
                key={item.id} 
                p="sm" 
                style={{ 
                  border: '1px solid #e9ecef', 
                  borderRadius: '8px',
                  backgroundColor: '#f8f9fa'
                }}
              >
                
                <Group justify="space-between" mb="xs">
                  <Text fw={600} size="sm">{item.nombre}</Text>
                  <Badge color="blue" variant="light">
                    Bs {item.precio_venta}
                  </Badge>
                </Group>

                <Text size="xs" c="dimmed" mb="xs">
                  Stock disponible: {item.stock - item.cantidad}
                </Text>
                
                {item.presentacion && (
                  <Text size="xs" c="dimmed" mb="xs">
                    {item.presentacion}
                  </Text>
                )}
                
                <Group justify="space-between">
                  <Group gap="xs">
                    <ActionIcon 
                      variant="subtle" 
                      color="red" 
                      size="sm"
                      onClick={() => onModificarCantidad(item.id, -1)}
                    >
                      <IconMinus size={14} />
                    </ActionIcon>
                    
                    <Badge variant="outline" color="blue">
                      {item.cantidad}
                    </Badge>
                    
                    <ActionIcon 
                      variant="subtle" 
                      color="green" 
                      size="sm"
                      onClick={() => onModificarCantidad(item.id, 1)}
                    >
                      <IconPlus size={14} />
                    </ActionIcon>
                  </Group>
                  
                  <Group gap="xs">
                    <Text fw={600} size="sm">
                      Bs {(item.precio_venta * item.cantidad)}
                    </Text>
                    <ActionIcon 
                      variant="subtle" 
                      color="red" 
                      size="sm"
                      onClick={() => onEliminarItem(item.id)}
                    >
                      <IconTrash size={14} />
                    </ActionIcon>
                  </Group>
                </Group>
              </Box>
            ))}
          </Stack>
        </ScrollArea>

        <Box py="md" style={{ borderTop: '2px solid #e9ecef' }}>
          {descuentoCliente > 0 && (
            <>
              <Group justify="space-between" mb="xs">
                <Text size="sm" c="dimmed">Subtotal:</Text>
                <Text size="sm" c="dimmed">Bs {totalSinDescuento?.toFixed(2)}</Text>
              </Group>
              <Group justify="space-between" mb="xs">
                <Text size="sm" c="green">Descuento ({descuentoCliente}%):</Text>
                <Text size="sm" c="green">- Bs {montoDescuento?.toFixed(2)}</Text>
              </Group>
            </>
          )}
          <Group justify="space-between" mb="md">
            <Text fw={700} size="lg">Total:</Text>
            <Text fw={700} size="xl" c="blue.6">
              Bs {totalVenta?.toFixed(2)}
            </Text>
          </Group>
        </Box>

        <Stack gap>
          <Group grow>
            <Button 
              onClick={abrirModalVenta}
              size="md"
              fullWidth
            >
              <IconReceiptDollar size={16} />
              Venta
            </Button>

            <Button 
              onClick={handleVentaRapida}
              size="md"
              fullWidth
              variant="light"
            >
              <IconInvoice size={16} />
              Venta Rápida
            </Button>
          </Group>
          <Flex gap="md" justify="center" align="flex-start" direction="row" wrap="wrap">
            <Button 
              variant="light" 
              onClick={onVaciarCarrito}
              size="md"
            >
              <IconTrash size={16} />
              Vaciar
            </Button>
          </Flex>
        </Stack>
      </Box>

      {/* Modal Datos del Cliente (ACTUALIZADO CON NUEVA VALIDACIÓN) */}
      <Modal
        opened={modalClienteAbierto}
        onClose={() => {
          setModalClienteAbierto(false);
          setErrores({});
          setTocado({});
        }}
        title={
          <Group gap="sm">
            <IconUser size={20} />
            <Text fw={600}>Datos del Cliente</Text>
          </Group>
        }
        size="md"
        overlayProps={{ opacity: 0.5, blur: 4 }}
        styles={{ content: { borderRadius: '12px' } }}
      >
        <Box component="form" onSubmit={handleSubmit} className="mantine-form">
          {hayErrores && (
            <Alert 
              icon={<IconAlertCircle size={16} />} 
              title="Errores de validación" 
              color="red" 
              mb="md"
            >
              Por favor corrige los errores en el formulario antes de enviar.
            </Alert>
          )}

          <div className="mantine-form-simple">
            <div className="mantine-form-group">
              <label htmlFor="ci_nit">CI / NIT *</label>
              <input
                id="ci_nit"
                name="ci_nit"
                value={datosCliente.ci_nit}
                onChange={(e) => handleChange('ci_nit', e.target.value)}
                onBlur={(e) => handleBlur('ci_nit', e.target.value)}
                placeholder="Ingrese CI o NIT del cliente"
                required
              />
              {errores.ci_nit && <span style={{color: 'red', fontSize: '0.75rem'}}>{errores.ci_nit}</span>}
              {buscandoCliente && (
                <Text size="xs" c="blue" mt={4}>Buscando cliente...</Text>
              )}
            </div>

            <div className="mantine-form-group">
              <label htmlFor="nombre">Nombre del Cliente *</label>
              <input
                id="nombre"
                name="nombre"
                value={datosCliente.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                onBlur={(e) => handleBlur('nombre', e.target.value)}
                placeholder="Si existe ci se autocompletara"
                required
              />
              {errores.nombre && <span style={{color: 'red', fontSize: '0.75rem'}}>{errores.nombre}</span>}
            </div>

            <div className="">
              
<Radio.Group
            value={datosCliente.metodo_pago}
            onChange={(value) => handleChange('metodo_pago', value)}
            
            label="Seleccione el método de pago:"
            withAsterisk
          >
            <Stack mt="xs" gap="sm">
              <Radio 
                value="efectivo" 
                label={
                  <Group gap="sm">
                    <IconCash size={18} color="green" />
                    <Text>Efectivo</Text>
                  </Group>
                } 
              />
              <Radio 
                value="qr" 
                label={
                  <Group gap="sm">
                    <IconQrcode size={18} color="blue" />
                    <Text>QR</Text>
                  </Group>
                } 
              />
              <Radio 
                value="mixto" 
                label={
                  <Group gap="sm">
                    <IconCurrencyDollar size={18} color="orange" />
                    <Text>Mixto</Text>
                  </Group>
                } 
              />
            </Stack>
          </Radio.Group>
            </div>
          </div>
            
          <Group justify="space-between" mt="md" px="md">
            <Text fw={700} size="lg">Total a Pagar:</Text>
            <Text fw={700} size="xl" c="blue.6">
              Bs {totalVenta.toFixed(2)}
            </Text>
          </Group>

          <div className="mantine-form-actions">
            <Button 
              type="submit" 
              color="green"
              size="md"
              disabled={!formularioValido}
              leftSection={!formularioValido ? <IconLock size={16} /> : null}
            >
              Confirmar Venta
            </Button>
            
            <Button 
              variant="light" 
              color="gray"
              onClick={() => {
                setModalClienteAbierto(false);
                setErrores({});
                setTocado({});
              }}
              size="md"
            >
              Cancelar
            </Button>
          </div>
        </Box>
      </Modal>

      {/* Resto del código permanece igual (Modal Venta Rápida y Modal Éxito) */}
      <Modal
        opened={modalPagoRapidoAbierto}
        onClose={() => setModalPagoRapidoAbierto(false)}
        title={
          <Group gap="sm">
            <IconCurrencyDollar size={20} />
            <Text fw={600}>Método de Pago - Venta Rápida</Text>
          </Group>
        }
        size="sm"
        overlayProps={{ opacity: 0.5, blur: 4 }}
        styles={{ content: { borderRadius: '12px' } }}
      >
        <Stack gap="lg">
          <Box>
            <Text fw={600} size="lg" ta="center" c="blue.6">
              Total: Bs {totalVenta}
            </Text>
            <Text size="sm" c="dimmed" ta="center">
              {carrito.length} producto(s) en el carrito
            </Text>
          </Box>

          <Radio.Group
            value={metodoPagoRapido}
            onChange={setMetodoPagoRapido}
            name="metodoPagoRapido"
            label="Seleccione el método de pago:"
            withAsterisk
          >
            <Stack mt="xs" gap="sm">
              <Radio 
                value="efectivo" 
                label={
                  <Group gap="sm">
                    <IconCash size={18} color="green" />
                    <Text>Efectivo</Text>
                  </Group>
                } 
              />
              <Radio 
                value="qr" 
                label={
                  <Group gap="sm">
                    <IconQrcode size={18} color="blue" />
                    <Text>QR</Text>
                  </Group>
                } 
              />
              <Radio 
                value="mixto" 
                label={
                  <Group gap="sm">
                    <IconCurrencyDollar size={18} color="orange" />
                    <Text>Mixto</Text>
                  </Group>
                } 
              />
            </Stack>
          </Radio.Group>

          <Group grow mt="md">
            <Button 
              onClick={confirmarVentaRapida}
              color="green"
              size="md"
            >
              <IconCheck size={16} />
              Confirmar Venta
            </Button>
            
            <Button 
              variant="light" 
              color="gray"
              onClick={() => setModalPagoRapidoAbierto(false)}
              size="md"
            >
              Cancelar
            </Button>
          </Group>
        </Stack>
      </Modal>

      {datosVentaConfirmada && (
        <Modal
          opened={modalExitoAbierto}
          onClose={cerrarModalExito}
          title={
            <Group gap="sm">
              <IconCheck size={20} color="green" />
              <Text fw={600}>¡Venta Realizada!</Text>
            </Group>
          }
          size="auto" 
          centered
        >
          <Stack gap="md">
            <Box
              p="md"
              style={{
                border: '2px solid #1871c1',
                borderRadius: '8px',
                backgroundColor: '#f0f7ff'
              }}
            >
              <Text fw={600} mb="xs">Nro. Venta: #{numeroVentaGenerado}</Text>
              <Text size="sm" c="dimmed">Cliente: {datosVentaConfirmada.nombre}</Text>
              <Text size="sm" c="dimmed">Método de Pago: {datosVentaConfirmada.metodo_pago.toUpperCase()}</Text>
              <Text size="sm" c="dimmed">
                Total: Bs {detallesVentaReal?.totalReal?.toFixed(2) || totalVenta.toFixed(2)}
              </Text>
            </Box>

            <Group grow>
              <Button
                leftSection={<IconDownload size={16} />}
                onClick={generarPDFConDatosReales}
              >
                Descargar PDF
              </Button>
              
              <Button
                leftSection={<IconPrinter size={16} />}
                variant="light"
                onClick={imprimirConDatosReales}
              >
                Imprimir
              </Button>
            </Group>
          </Stack>
          <br/>
          <Flex
            gap="md"
            justify="center"
            align="center"
            direction="row"
            wrap="wrap"
          >
            <Button
              onClick={cerrarModalExito}
              variant="light"
            >
              Continuar
            </Button>
          </Flex>
        </Modal>
      )}
    </>
  );
}

export default VentaForm;



