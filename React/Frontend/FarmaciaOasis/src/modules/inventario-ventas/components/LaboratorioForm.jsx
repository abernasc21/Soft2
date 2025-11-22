import { Button, Alert } from '@mantine/core';
import { useState } from 'react';
import { IconAlertCircle, IconLock } from '@tabler/icons-react';

function LaboratorioForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: ''
  });

  const [errores, setErrores] = useState({});
  const [tocado, setTocado] = useState({});

  // Función para verificar si el formulario es válido
  const esFormularioValido = () => {
    const { nombre, direccion } = formData;
    
    // Campos obligatorios no vacíos
    if (!nombre.trim() || !direccion.trim()) {
      return false;
    }
    
    // Sin errores de validación
    if (Object.keys(errores).length > 0) {
      return false;
    }
    
    // Longitudes mínimas
    if (nombre.length < 2 || direccion.length < 5) {
      return false;
    }
    
    return true;
  };

  // Función de validación
  const validarCampo = (nombre, valor) => {
    const nuevosErrores = { ...errores };
    
    switch (nombre) {
      case 'nombre':
        if (!valor.trim()) {
          nuevosErrores.nombre = 'El nombre del laboratorio es requerido';
        } else if (valor.length < 2) {
          nuevosErrores.nombre = 'El nombre debe tener al menos 2 caracteres';
        } else if (valor.length > 100) {
          nuevosErrores.nombre = 'El nombre no puede tener más de 100 caracteres';
        } else {
          delete nuevosErrores.nombre;
        }
        break;

      case 'direccion':
        if (!valor.trim()) {
          nuevosErrores.direccion = 'La dirección es requerida';
        } else if (valor.length < 5) {
          nuevosErrores.direccion = 'La dirección debe tener al menos 5 caracteres';
        } else if (valor.length > 200) {
          nuevosErrores.direccion = 'La dirección no puede tener más de 200 caracteres';
        } else {
          delete nuevosErrores.direccion;
        }
        break;

      default:
        break;
    }

    setErrores(nuevosErrores);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (tocado[name]) {
      validarCampo(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTocado(prev => ({ ...prev, [name]: true }));
    validarCampo(name, value);
  };

  const validarFormulario = () => {
    const nuevosTocados = {};
    Object.keys(formData).forEach(key => {
      nuevosTocados[key] = true;
    });
    setTocado(nuevosTocados);

    Object.keys(formData).forEach(key => {
      validarCampo(key, formData[key]);
    });

    return Object.keys(errores).length === 0 && esFormularioValido();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    onSubmit(formData);
    setFormData({ nombre: '', direccion: '' });
    setErrores({});
    setTocado({});
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
        <div className="mantine-form-group full-width">
          <label htmlFor="nombre">Nombre del laboratorio *</label>
          <input
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ingrese el nombre del laboratorio"
            required
          />
          {errores.nombre && <span style={{color: 'red', fontSize: '0.75rem'}}>{errores.nombre}</span>}
        </div>

        <div className="mantine-form-group full-width">
          <label htmlFor="direccion">Dirección *</label>
          <textarea
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ingrese la dirección completa del laboratorio"
            rows="3"
            required
          />
          {errores.direccion && <span style={{color: 'red', fontSize: '0.75rem'}}>{errores.direccion}</span>}
        </div>
      </div>

      <div className="mantine-form-actions">
        <Button 
          type="submit" 
          className="btn-agregar"
          disabled={!formularioValido}
          leftSection={!formularioValido ? <IconLock size={16} /> : null}
        >
          Agregar Laboratorio
        </Button>
        <Button type="button" onClick={onCancel} className="btn-cancelar">
          Cancelar
        </Button>
      </div>
    </form>
  );
}

export default LaboratorioForm;