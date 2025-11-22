import { Button, NumberInput, Text, Group, Alert } from '@mantine/core';
import { useState, useEffect } from 'react';
import { IconCalculator, IconAlertCircle, IconLock } from '@tabler/icons-react';

function ProductoForm({ producto, laboratorios, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    codigo: '',
    lote: '',
    nombre: '',
    presentacion: '',
    precio_compra: '',
    porcentaje_g: '',
    stock: '',
    fecha_expiracion: '',
    laboratorio: '',
    medida:'',
  });

  const [precioVentaCalculado, setPrecioVentaCalculado] = useState(0);
  const [errores, setErrores] = useState({});
  const [tocado, setTocado] = useState({});

  // Función para verificar si el formulario es válido
  const esFormularioValido = () => {
    const { lote, nombre, presentacion, medida, precio_compra, porcentaje_g, stock, fecha_expiracion, laboratorio } = formData;
    
    // Campos obligatorios no vacíos - INCLUIR presentacion y medida
    if (!lote.trim() || !nombre.trim() || !presentacion.trim() || !medida.trim() || !precio_compra || !porcentaje_g || !stock || !fecha_expiracion || !laboratorio) {
      return false;
    }
    
    // Sin errores de validación
    if (Object.keys(errores).length > 0) {
      return false;
    }
    
    // Precio de venta debe ser mayor a 0
    if (precioVentaCalculado <= 0) {
      return false;
    }
    
    // Validaciones numéricas básicas
    if (parseFloat(precio_compra) <= 0 || parseFloat(porcentaje_g) < 0 || parseInt(stock) < 0) {
      return false;
    }
    
    return true;
  };
  // Calcular precio de venta cuando cambien precio_compra o porcentaje_g
  useEffect(() => {
    calcularPrecioVenta();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.precio_compra, formData.porcentaje_g]);

  useEffect(() => {
    if (producto) {
      setFormData({
        codigo: producto.codigo || '',
        lote: producto.lote || '',
        nombre: producto.nombre || '',
        presentacion: producto.presentacion || '',
        precio_compra: producto.precio_base || '',
        medida: producto.medida,
        porcentaje_g: producto.porcentaje_g || '',
        stock: producto.stock || '',
        fecha_expiracion: producto.fecha_expiracion || '',
        laboratorio: producto.laboratorio || ''
      });
    }
  }, [producto]);

  const calcularPrecioVenta = () => {
    const precioCompra = parseFloat(formData.precio_compra) || 0;
    const porcentajeGanancia = parseFloat(formData.porcentaje_g) || 0;
    
    if (precioCompra > 0 && porcentajeGanancia > 0) {
      const ganancia = precioCompra * (porcentajeGanancia / 100);
      const precioVenta = precioCompra + ganancia;
      setPrecioVentaCalculado(precioVenta);
    } else {
      setPrecioVentaCalculado(0);
    }
  };

  // Función de validación
  const validarCampo = (nombre, valor) => {
    const nuevosErrores = { ...errores };
    
    switch (nombre) {
      case 'codigo':
        if (!valor || !valor.trim()) {
          nuevosErrores.codigo = 'El código es requerido';
        } else if (valor.length > 20) {
          nuevosErrores.codigo = 'El código no puede tener más de 20 caracteres';
        } else {
          delete nuevosErrores.codigo;
        }
        break;

      case 'lote':
        if (!valor || !valor.trim()) {
          nuevosErrores.lote = 'El lote es requerido';
        } else if (valor.length > 15) {
          nuevosErrores.lote = 'El lote no puede tener más de 15 caracteres';
        } else {
          delete nuevosErrores.lote;
        }
        break;

      case 'nombre':
        if (!valor || !valor.trim()) {
          nuevosErrores.nombre = 'El nombre es requerido';
        } else if (valor.length > 100) {
          nuevosErrores.nombre = 'El nombre no puede tener más de 100 caracteres';
        } else {
          delete nuevosErrores.nombre;
        }
        break;
      
        case 'presentacion':
        if (!valor || !valor.trim()) {
          nuevosErrores.presentacion = 'La presentación es requerida';
        } else if (valor.length > 100) {
          nuevosErrores.presentacion = 'la presentación o puede tener más de 100 caracteres';
        } else {
          delete nuevosErrores.presentacion;
        }
        break;
        case 'medida':
        if (!valor || !valor.trim()) {
          nuevosErrores.medida = 'La medida es requerida';
        } else if (valor.length > 15) {
          nuevosErrores.medida = 'la medida o puede tener más de 15 caracteres';
        } else {
          delete nuevosErrores.medida;
        }
        break;

      case 'precio_compra':
        if (!valor || parseFloat(valor) <= 0) {
          nuevosErrores.precio_compra = 'El precio de compra debe ser mayor a 0';
        } else if (parseFloat(valor) > 100000) {
          nuevosErrores.precio_compra = 'El precio de compra no puede ser mayor a 100,000 Bs';
        } else {
          delete nuevosErrores.precio_compra;
        }
        break;

      case 'porcentaje_g':
        if (!valor || parseFloat(valor) < 0) {
          nuevosErrores.porcentaje_g = 'El porcentaje debe ser mayor o igual a 0';
        } else if (parseFloat(valor) > 1000) {
          nuevosErrores.porcentaje_g = 'El porcentaje no puede ser mayor a 1000%';
        } else {
          delete nuevosErrores.porcentaje_g;
        }
        break;

      case 'stock':
        if (!valor || parseInt(valor) < 0) {
          nuevosErrores.stock = 'El stock debe ser mayor o igual a 0';
        } else if (parseInt(valor) > 1000000) {
          nuevosErrores.stock = 'El stock no puede ser mayor a 1,000,000';
        } else {
          delete nuevosErrores.stock;
        }
        break;

      case 'fecha_expiracion':
        if (!valor) {
          nuevosErrores.fecha_expiracion = 'La fecha de expiración es requerida';
        } else {
          const fechaExp = new Date(valor);
          const hoy = new Date();
          hoy.setHours(0, 0, 0, 0);
          
          if (fechaExp <= hoy) {
            nuevosErrores.fecha_expiracion = 'La fecha de expiración debe ser futura';
          } else {
            delete nuevosErrores.fecha_expiracion;
          }
        }
        break;

      case 'laboratorio':
        if (!valor) {
          nuevosErrores.laboratorio = 'El laboratorio es requerido';
        } else {
          delete nuevosErrores.laboratorio;
        }
        break;

      default:
        break;
    }

    setErrores(nuevosErrores);
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validar en tiempo real si el campo ya fue tocado
    if (tocado[name]) {
      validarCampo(name, value);
    }
  };

  const handleBlur = (name, value) => {
    setTocado(prev => ({ ...prev, [name]: true }));
    validarCampo(name, value);
  };

  const validarFormulario = () => {
    const nuevosTocados = {};
    const camposRequeridos = ['codigo', 'lote', 'nombre', 'precio_compra', 'porcentaje_g', 'stock', 'fecha_expiracion', 'laboratorio','presentacion','medida'];
    
    camposRequeridos.forEach(key => {
      nuevosTocados[key] = true;
    });
    setTocado(nuevosTocados);

    // Validar todos los campos requeridos
    camposRequeridos.forEach(key => {
      validarCampo(key, formData[key]);
    });

    return Object.keys(errores).length === 0 && esFormularioValido();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    // Incluir el precio de venta calculado en los datos a enviar
    const datosCompletos = {
      ...formData,
      precio_venta: precioVentaCalculado,
      precio_base: parseFloat(formData.precio_compra),
      porcentaje_g: parseFloat(formData.porcentaje_g),
      stock: parseInt(formData.stock)
    };
    
    onSubmit(datosCompletos);
  };

  const hayErrores = Object.keys(errores).length > 0;
  const formularioValido = esFormularioValido();

  return (
    <form onSubmit={handleSubmit} className="mantine-form">
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

      <div className="mantine-form-grid">
        {/* Código */}
        {/* <div className="mantine-form-group">
          <label htmlFor="codigo">Código</label>
          <input
            id="codigo"
            name="codigo"
            value={formData.codigo}
            onChange={(e) => handleChange('codigo', e.target.value)}
            onBlur={(e) => handleBlur('codigo', e.target.value)}
            placeholder="Código"
            required
          />
          {errores.codigo && <span style={{color: 'red', fontSize: '0.75rem'}}>{errores.codigo}</span>}
        </div> */}
        
        {/* Lote */}
        <div className="mantine-form-group">
          <label htmlFor="lote">Lote</label>
          <input
            id="lote"
            name="lote"
            value={formData.lote}
            onChange={(e) => handleChange('lote', e.target.value)}
            onBlur={(e) => handleBlur('lote', e.target.value)}
            placeholder="Lote"
            required
          />
          {errores.lote && <span style={{color: 'red', fontSize: '0.75rem'}}>{errores.lote}</span>}
        </div>

        {/* Fila 2: Nombre | Presentación */}
        <div className="mantine-form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            onBlur={(e) => handleBlur('nombre', e.target.value)}
            placeholder="Nombre"
            required
          />
          {errores.nombre && <span style={{color: 'red', fontSize: '0.75rem'}}>{errores.nombre}</span>}
        </div>
        
        <div className="mantine-form-group">
          <label htmlFor="presentacion">Presentación</label>
          <input
            id="presentacion"
            name="presentacion"
            value={formData.presentacion}
            onChange={(e) => handleChange('presentacion', e.target.value)}
            onBlur={(e) => handleBlur('presentacion', e.target.value)}

            placeholder="Presentación"
          />
          {errores.presentacion && <span style={{color: 'red', fontSize: '0.75rem'}}>{errores.presentacion}</span>}
        </div>
        <div className="mantine-form-group">
          <label htmlFor="medida">Medida</label>
          <input
            id="medida"
            name="medida"
            value={formData.medida}
            onChange={(e) => handleChange('medida', e.target.value)}
            onBlur={(e) => handleBlur('medida', e.target.value)}

            placeholder="Medida"
          />
          {errores.medida && <span style={{color: 'red', fontSize: '0.75rem'}}>{errores.medida}</span>}
        </div>

        {/* Fila 3: Precio Compra | % Ganancia */}
        <div className="mantine-form-group">
          <label htmlFor="precio_compra">Precio de Compra (Bs)</label>
          <NumberInput
            id="precio_compra"
            name="precio_compra"
            value={formData.precio_compra}
            onChange={(value) => handleChange('precio_compra', value)}
            onBlur={() => handleBlur('precio_compra', formData.precio_compra)}
            placeholder="0.00"
            min={0}
            step={0.01}
            precision={2}
            required
          />
          {errores.precio_compra && <span style={{color: 'red', fontSize: '0.75rem'}}>{errores.precio_compra}</span>}
        </div>
        
        <div className="mantine-form-group">
          <label htmlFor="porcentaje_g">Porcentaje Ganancia (%)</label>
          <NumberInput
            id="porcentaje_g"
            name="porcentaje_g"
            value={formData.porcentaje_g}
            onChange={(value) => handleChange('porcentaje_g', value)}
            onBlur={() => handleBlur('porcentaje_g', formData.porcentaje_g)}
            placeholder="0"
            min={0}
            max={1000}
            step={1}
            required
          />
          {errores.porcentaje_g && <span style={{color: 'red', fontSize: '0.75rem'}}>{errores.porcentaje_g}</span>}
        </div>

        {/* Fila 4: Precio de Venta Calculado */}
        <div className="mantine-form-group full-width">
          <label htmlFor="precio_venta">
            <Group gap="xs">
              <IconCalculator size={16} />
              Precio de Venta Calculado
            </Group>
          </label>
          <div
            style={{
              padding: '12px 16px',
              border: '2px solid #e1f5fe',
              borderRadius: '8px',
              backgroundColor: '#f8fdff',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              color: '#1871c1',
              textAlign: 'center'
            }}
          >
            Bs {precioVentaCalculado}
          </div>
          <Text size="sm" c="dimmed" mt="xs">
            Precio de Compra: Bs {(parseFloat(formData.precio_compra) || 0).toFixed(2)} + 
            {formData.porcentaje_g || 0}% = Bs {precioVentaCalculado.toFixed(2)}
          </Text>
        </div>

        {/* Fila 5: Stock | Fecha Expiración */}
        <div className="mantine-form-group">
          <label htmlFor="stock">Stock</label>
          <NumberInput
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={(value) => handleChange('stock', value)}
            onBlur={() => handleBlur('stock', formData.stock)}
            placeholder="0"
            min={0}
            required
          />
          {errores.stock && <span style={{color: 'red', fontSize: '0.75rem'}}>{errores.stock}</span>}
        </div>
        
        <div className="mantine-form-group">
          <label htmlFor="fecha_expiracion">Fecha Expiración</label>
          <input
            type="date"
            id="fecha_expiracion"
            name="fecha_expiracion"
            value={formData.fecha_expiracion}
            onChange={(e) => handleChange('fecha_expiracion', e.target.value)}
            onBlur={(e) => handleBlur('fecha_expiracion', e.target.value)}
            required
          />
          {errores.fecha_expiracion && <span style={{color: 'red', fontSize: '0.75rem'}}>{errores.fecha_expiracion}</span>}
        </div>

        {/* Fila 6: Laboratorio (ocupa 2 columnas) */}
        <div className="mantine-form-group full-width">
          <label htmlFor="laboratorio">Seleccionar laboratorio</label>
          <select
            id="laboratorio"
            name="laboratorio"
            value={formData.laboratorio}
            onChange={(e) => handleChange('laboratorio', e.target.value)}
            onBlur={(e) => handleBlur('laboratorio', e.target.value)}
            required
          >
            <option value="">Seleccionar laboratorio</option>
            {laboratorios.map(lab => (
              <option key={lab.id_lab || lab.id} value={lab.nombre_labo || lab.nombre}>
                {lab.nombre_labo || lab.nombre}
              </option>
            ))}
          </select>
          {errores.laboratorio && <span style={{color: 'red', fontSize: '0.75rem'}}>{errores.laboratorio}</span>}
        </div>
      </div>

      {/* Botones */}
      <div className="mantine-form-actions">
        <Button 
          type="submit" 
          className="btn-agregar" 
          disabled={!formularioValido}
          leftSection={!formularioValido ? <IconLock size={16} /> : null}
        >
          {producto ? 'Guardar Cambios' : 'Agregar Producto'}
        </Button>
        <Button type="button" onClick={onCancel} className="btn-cancelar">
          Cancelar
        </Button>
      </div>
    </form>
  );
}

export default ProductoForm;