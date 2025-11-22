import { 
  TextInput, 
  NumberInput,
  Button, 
  Stack,
  Group,
  Text,
  Alert
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { IconAlertCircle, IconLock } from '@tabler/icons-react';

/**
 * Formulario para crear y editar proveedores
 * Incluye validación automática y cálculo de precios
 */
export function ProveedorForm({ 
  proveedor, 
  onGuardar,
  isMobile = false
}) {
  const [errores, setErrores] = useState({});
  const [tocado, setTocado] = useState({});

  const form = useForm({
    initialValues: {
      nombre: '',
      telefono: '',
      cantidad: 0,
      concepto: '',
      precio_unitario: 0,
      precio_total: 0,
    }
  });

  /**
   * Valida si el formulario completo es válido
   * Verifica campos obligatorios y reglas de negocio
   */
  const esFormularioValido = () => {
    const { nombre, telefono, concepto } = form.values;
    
    // Campos obligatorios no vacíos
    if (!nombre.trim() || !telefono.trim() || !concepto.trim()) {
      return false;
    }
    
    // Sin errores de validación
    if (Object.keys(errores).length > 0) {
      return false;
    }
    
    // Longitudes mínimas
    if (nombre.length < 2 || telefono.length < 6 || concepto.length < 3) {
      return false;
    }
    
    return true;
  };

  /**
   * Valida un campo específico y actualiza los errores
   */
  const validarCampo = (nombre, valor) => {
    const nuevosErrores = { ...errores };
    
    switch (nombre) {
      case 'nombre':
        if (!valor.trim()) {
          nuevosErrores.nombre = 'El nombre del proveedor es requerido';
        } else if (valor.length < 2) {
          nuevosErrores.nombre = 'El nombre debe tener al menos 2 caracteres';
        } else if (valor.length > 100) {
          nuevosErrores.nombre = 'El nombre no puede tener más de 100 caracteres';
        } else {
          delete nuevosErrores.nombre;
        }
        break;

      case 'telefono':
        if (!valor.trim()) {
          nuevosErrores.telefono = 'El teléfono es requerido';
        } else if (valor.length < 6) {
          nuevosErrores.telefono = 'El teléfono debe tener al menos 6 caracteres';
        } else if (valor.length > 20) {
          nuevosErrores.telefono = 'El teléfono no puede tener más de 20 caracteres';
        } else {
          delete nuevosErrores.telefono;
        }
        break;

      case 'cantidad':
        if (valor < 0) {
          nuevosErrores.cantidad = 'La cantidad no puede ser negativa';
        } else if (!Number.isInteger(Number(valor))) {
          nuevosErrores.cantidad = 'La cantidad debe ser un número entero';
        } else {
          delete nuevosErrores.cantidad;
        }
        break;

      case 'concepto':
        if (!valor.trim()) {
          nuevosErrores.concepto = 'El concepto es requerido';
        } else if (valor.length < 3) {
          nuevosErrores.concepto = 'El concepto debe tener al menos 3 caracteres';
        } else if (valor.length > 200) {
          nuevosErrores.concepto = 'El concepto no puede tener más de 200 caracteres';
        } else {
          delete nuevosErrores.concepto;
        }
        break;

      case 'precio_unitario':
        if (valor < 0) {
          nuevosErrores.precio_unitario = 'El precio unitario no puede ser negativo';
        } else if (!Number.isFinite(valor)) {
          nuevosErrores.precio_unitario = 'El precio unitario debe ser un número válido';
        } else {
          delete nuevosErrores.precio_unitario;
        }
        break;

      default:
        break;
    }

    setErrores(nuevosErrores);
  };

  // Maneja cambios en los campos con validación en tiempo real
  const handleChange = (name, value) => {
    form.setFieldValue(name, value);

    if (tocado[name]) {
      validarCampo(name, value);
    }
  };

  // Valida campo cuando pierde el foco
  const handleBlur = (name, value) => {
    setTocado(prev => ({ ...prev, [name]: true }));
    validarCampo(name, value);
  };

  /**
   * Valida todo el formulario antes de enviar
   * Marca todos los campos como tocados para mostrar errores
   */
  const validarFormulario = () => {
    const nuevosTocados = {};
    Object.keys(form.values).forEach(key => {
      nuevosTocados[key] = true;
    });
    setTocado(nuevosTocados);

    Object.keys(form.values).forEach(key => {
      validarCampo(key, form.values[key]);
    });

    return Object.keys(errores).length === 0 && esFormularioValido();
  };

  // Carga datos del proveedor cuando se edita
  useEffect(() => {
    if (proveedor) {
      form.setValues({
        nombre: proveedor.nombre || '',
        telefono: proveedor.telefono || '',
        cantidad: proveedor.cantidad || 0,
        concepto: proveedor.concepto || '',
        precio_unitario: proveedor.precio_unitario || 0,
        precio_total: proveedor.precio_total || 0,
      });
    } else {
      form.reset();
      setErrores({});
      setTocado({});
    }
  }, [proveedor]);

  /**
   * Calcula automáticamente el precio total
   * Se ejecuta cuando cambia cantidad o precio unitario
   */
  useEffect(() => {
    const cantidad = form.values.cantidad;
    const precio_unitario = form.values.precio_unitario;
    const precio_total = cantidad * precio_unitario;
    
    if (!isNaN(precio_total) && isFinite(precio_total)) {
      form.setFieldValue('precio_total', parseFloat(precio_total.toFixed(2)));
    }
  }, [form.values.cantidad, form.values.precio_unitario]);

  // Maneja el envío del formulario con validación
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    onGuardar(form.values);
    form.reset();
    setErrores({});
    setTocado({});
  };

  const hayErrores = Object.keys(errores).length > 0;
  const formularioValido = esFormularioValido();

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={isMobile ? "sm" : "md"}>

        {/* Alertas de errores de validación */}
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

        {/* Campos del formulario */}
        <TextInput
          label="Nombre del proveedor"
          placeholder="Ingresa el nombre del proveedor"
          size={isMobile ? "sm" : "md"}
          required
          withAsterisk
          value={form.values.nombre}
          onChange={(e) => handleChange('nombre', e.target.value)}
          onBlur={(e) => handleBlur('nombre', e.target.value)}
          error={errores.nombre}
        />
        
        <TextInput
          label="Teléfono"
          placeholder="123456789"
          size={isMobile ? "sm" : "md"}
          required
          withAsterisk
          value={form.values.telefono}
          onChange={(e) => handleChange('telefono', e.target.value)}
          onBlur={(e) => handleBlur('telefono', e.target.value)}
          error={errores.telefono}
        />

        <NumberInput
          label="Cantidad"
          placeholder="0"
          min={0}
          size={isMobile ? "sm" : "md"}
          value={form.values.cantidad}
          onChange={(value) => handleChange('cantidad', value)}
          onBlur={() => handleBlur('cantidad', form.values.cantidad)}
          error={errores.cantidad}
        />

        <TextInput
          label="Concepto"
          placeholder="Descripción del producto/servicio"
          size={isMobile ? "sm" : "md"}
          required
          withAsterisk
          value={form.values.concepto}
          onChange={(e) => handleChange('concepto', e.target.value)}
          onBlur={(e) => handleBlur('concepto', e.target.value)}
          error={errores.concepto}
        />

        <NumberInput
          label="Precio Unitario"
          placeholder="0.00"
          min={0}
          decimalScale={2}
          size={isMobile ? "sm" : "md"}
          value={form.values.precio_unitario}
          onChange={(value) => handleChange('precio_unitario', value)}
          onBlur={() => handleBlur('precio_unitario', form.values.precio_unitario)}
          error={errores.precio_unitario}
          rightSection={<Text size="xs" c="dimmed">Bs</Text>}
        />

        {/* Campo de precio total calculado automáticamente */}
        <NumberInput
          label="Precio Total"
          placeholder="0.00"
          min={0}
          decimalScale={2}
          size={isMobile ? "sm" : "md"}
          value={form.values.precio_total}
          readOnly
          rightSection={<Text size="xs" c="dimmed">Bs</Text>}
        />

        {/* Botón de envío con estado dinámico */}
        <Group justify="flex-end" mt="md">
          <Button 
            type="submit" 
            size={isMobile ? "sm" : "md"}
            fullWidth={isMobile}
            disabled={!formularioValido}
            leftSection={!formularioValido ? <IconLock size={16} /> : null}
          >
            {proveedor ? 'Modificar' : 'Agregar'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}