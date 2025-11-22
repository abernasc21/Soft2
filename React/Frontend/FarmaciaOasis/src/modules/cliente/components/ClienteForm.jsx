import { 
  TextInput, 
  NumberInput,
  Button, 
  Stack,
  Group,
  Alert,
  Text
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { IconInfoCircle, IconLock } from '@tabler/icons-react';

/**
 * Formulario para crear o editar clientes con validación completa
 * Maneja reactivación de clientes inactivos y validaciones de negocio
 */
export function ClienteForm({ 
  cliente, 
  onGuardar,
  isMobile = false,
  clientes = []
}) {
  const [clienteReactivar, setClienteReactivar] = useState(null);
  const [errores, setErrores] = useState({});
  const [tocado, setTocado] = useState({});

  const form = useForm({
    initialValues: {
      nombre: '',
      ci_nit: '',
      descuento: 0,
    }
  });

  /**
   * Valida si el formulario completo es válido
   * Considera campos obligatorios, formatos y reglas de negocio
   */
  const esFormularioValido = () => {
    const { nombre, ci_nit, descuento } = form.values;
    
    if (!nombre.trim() || !ci_nit.trim()) {
      return false;
    }
    
    if (Object.keys(errores).length > 0) {
      return false;
    }
    
    if (nombre.length < 2 || ci_nit.length < 3) {
      return false;
    }
    
    if (!/^[0-9a-zA-Z]+$/.test(ci_nit)) {
      return false;
    }
    
    if (descuento < 0 || descuento > 100 || !Number.isFinite(descuento)) {
      return false;
    }
    
    return true;
  };

  /**
   * Valida un campo específico y actualiza los errores
   * Incluye validación de duplicados y reglas de formato
   */
  const validarCampo = (nombre, valor) => {
    const nuevosErrores = { ...errores };
    
    switch (nombre) {
      case 'nombre':
        if (!valor.trim()) {
          nuevosErrores.nombre = 'El nombre es requerido';
        } else if (valor.length < 2) {
          nuevosErrores.nombre = 'El nombre debe tener al menos 2 caracteres';
        } else if (valor.length > 100) {
          nuevosErrores.nombre = 'El nombre no puede tener más de 100 caracteres';
        } else {
          delete nuevosErrores.nombre;
        }
        break;

      case 'ci_nit':
        if (!valor.trim()) {
          nuevosErrores.ci_nit = 'El CI/NIT es requerido';
        } else if (valor.length < 3) {
          nuevosErrores.ci_nit = 'El CI/NIT debe tener al menos 3 caracteres';
        } else if (valor.length > 20) {
          nuevosErrores.ci_nit = 'El CI/NIT no puede tener más de 20 caracteres';
        } else if (!/^[0-9a-zA-Z]+$/.test(valor)) {
          nuevosErrores.ci_nit = 'Solo se permiten números y letras';
        } else {
          // Validar que no exista un cliente ACTIVO con el mismo CI/NIT
          if (clientes && clientes.length > 0) {
            const clienteExistente = clientes.find(cli => 
              cli.ci_nit === valor && 
              cli.estado === 'activo' &&
              cli.cod_cli !== (cliente?.cod_cli)
            );
            
            if (clienteExistente) {
              nuevosErrores.ci_nit = 'Ya existe un cliente ACTIVO con este CI/NIT';
            } else {
              delete nuevosErrores.ci_nit;
            }
          } else {
            delete nuevosErrores.ci_nit;
          }
        }
        break;

      case 'descuento':
        if (valor < 0) {
          nuevosErrores.descuento = 'El descuento no puede ser negativo';
        } else if (valor > 100) {
          nuevosErrores.descuento = 'El descuento no puede ser mayor a 100%';
        } else if (!Number.isFinite(valor)) {
          nuevosErrores.descuento = 'El descuento debe ser un número válido';
        } else {
          delete nuevosErrores.descuento;
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

  // Carga datos del cliente cuando se edita
  useEffect(() => {
    if (cliente) {
      form.setValues({
        nombre: cliente.nombre || '',
        ci_nit: cliente.ci_nit || '',
        descuento: cliente.descuento || 0,
      });
      setClienteReactivar(null);
      setErrores({});
      setTocado({});
    } else {
      form.reset();
      setErrores({});
      setTocado({});
    }
  }, [cliente]);

  /**
   * Detecta clientes inactivos para reactivación
   * Cuando se ingresa un CI/NIT que existe pero está inactivo
   */
  useEffect(() => {
    const ci_nit = form.values.ci_nit;
    if (ci_nit && clientes.length > 0 && !cliente) {
      const clienteInactivo = clientes.find(cli => 
        cli.ci_nit === ci_nit && cli.estado === 'inactivo'
      );
      
      if (clienteInactivo) {
        setClienteReactivar(clienteInactivo);
      } else {
        setClienteReactivar(null);
      }
    } else {
      setClienteReactivar(null);
    }
  }, [form.values.ci_nit, clientes, cliente]);

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
    setClienteReactivar(null);
  };

  const hayErrores = Object.keys(errores).length > 0;
  const formularioValido = esFormularioValido();

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={isMobile ? "sm" : "md"}>
        {/* Alertas de estado del formulario */}
        {hayErrores && (
          <Alert 
            icon={<IconInfoCircle size={16} />} 
            title="Errores de validación" 
            color="red" 
            mb="md"
          >
            Por favor corrige los errores en el formulario antes de enviar.
          </Alert>
        )}

        {/* Alerta para reactivación de cliente inactivo */}
        {clienteReactivar && (
          <Alert 
            variant="light" 
            color="blue" 
            title="Cliente encontrado"
            icon={<IconInfoCircle />}
          >
            Se encontró un cliente inactivo con este CI/NIT. Al guardar, se reactivará automáticamente.
          </Alert>
        )}

        {/* Campos del formulario */}
        <TextInput
          label="Nombre completo"
          placeholder="Ingresa el nombre del cliente"
          size={isMobile ? "sm" : "md"}
          required
          withAsterisk
          value={form.values.nombre}
          onChange={(e) => handleChange('nombre', e.target.value)}
          onBlur={(e) => handleBlur('nombre', e.target.value)}
          error={errores.nombre}
        />
        
        <TextInput
          label="CI / NIT"
          placeholder="123456789"
          size={isMobile ? "sm" : "md"}
          required
          withAsterisk
          value={form.values.ci_nit}
          onChange={(e) => handleChange('ci_nit', e.target.value)}
          onBlur={(e) => handleBlur('ci_nit', e.target.value)}
          error={errores.ci_nit}
        />
        
        <NumberInput
          label="Descuento (%)"
          placeholder="0"
          min={0}
          max={100}
          decimalScale={2}
          size={isMobile ? "sm" : "md"}
          value={form.values.descuento}
          onChange={(value) => handleChange('descuento', value)}
          onBlur={() => handleBlur('descuento', form.values.descuento)}
          error={errores.descuento}
          rightSection={<Text size="xs" c="dimmed">%</Text>}
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
            {clienteReactivar ? 'Reactivar Cliente' : 
             cliente ? 'Actualizar Cliente' : 'Crear Cliente'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}