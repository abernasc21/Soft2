import { useState } from 'react';
import { Select as MantineSelect, Box, Text } from '@mantine/core';
import { IconChevronDown, IconCheck } from '@tabler/icons-react';
import { useColors } from '../../hooks/useColors';
import classes from './Select.module.css';

/**
 * Componente Select personalizado con estilos modernos
 * Incluye animaciones, validación y opciones personalizadas
 */
export function Select({
  label = '',
  placeholder = 'Selecciona una opción',
  data = [],
  value = '',
  onChange = () => {},
  required = false,
  disabled = false,
  error = '',
  description = '',
  size = 'md',
  searchable = false,
  clearable = false,
  nothingFoundMessage = 'No se encontraron opciones',
  icon,
  withCheckIcon = true,
  ...props
}) {
  const colors = useColors();
  const [isFocused, setIsFocused] = useState(false);

  // Icono personalizado del dropdown con animación
  const CustomChevron = () => (
    <IconChevronDown 
      size={16} 
      className={classes.chevron}
      style={{
        color: isFocused ? colors.primary.cyan : colors.text.muted,
        transform: isFocused ? 'rotate(180deg)' : 'rotate(0deg)',
      }}
    />
  );

  // Renderizar opciones con icono de check
  const renderOption = ({ option, checked }) => (
    <Box className={classes.optionContent}>
      <Text size="sm" className={classes.optionText}>
        {option.label}
      </Text>
      {checked && withCheckIcon && (
        <IconCheck size={14} className={classes.checkIcon} />
      )}
    </Box>
  );

  // Estilos modernos para el input
  const modernStyles = {
    borderRadius: '12px',
    fontWeight: 500,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '2px solid transparent',
    background: `linear-gradient(135deg, ${colors.background.white} 0%, ${colors.background.light} 100%)`,
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
    '&:focus, &:focus-within': {
      borderColor: colors.primary.cyan,
      boxShadow: `0 0 0 3px ${colors.primary.cyan}20, 0 10px 30px rgba(4, 191, 191, 0.2)`,
      transform: 'translateY(-2px) scale(1.01)',
    },
    '&:hover:not(:disabled):not(:focus)': {
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)',
      transform: 'translateY(-1px)',
    }
  };

  return (
    <Box className={classes.container}>
      {/* Label con indicador de requerido */}
      {label && (
        <Text className={classes.label} data-required={required}>
          {label}
          {required && <span className={classes.requiredStar}> *</span>}
        </Text>
      )}
      
      {/* Descripción opcional */}
      {description && (
        <Text className={classes.description}>{description}</Text>
      )}

      {/* Select principal de Mantine con estilos personalizados */}
      <MantineSelect
        placeholder={placeholder}
        data={data}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        error={error}
        size={size}
        searchable={searchable}
        clearable={clearable}
        nothingFoundMessage={nothingFoundMessage}
        rightSection={<CustomChevron />}
        rightSectionWidth={36}
        leftSection={icon}
        renderOption={renderOption}
        classNames={{
          root: classes.root,
          input: classes.input,
          error: classes.error,
          dropdown: classes.dropdown,
          option: classes.option,
          section: classes.section,
        }}
        styles={{
          input: modernStyles,
          dropdown: {
            borderRadius: '12px',
            boxShadow: '0 15px 50px rgba(0, 0, 0, 0.15)',
            padding: '8px',
            background: colors.background.white,
            border: `1px solid ${colors.primary.blue}10`,
            animation: 'dropdownAppear 0.2s ease',
          },
          option: {
            borderRadius: '8px',
            margin: '2px 0',
            fontWeight: 500,
            transition: 'all 0.2s ease',
            '&[data-selected]': {
              backgroundColor: colors.primary.blue,
              color: 'white',
              transform: 'translateX(4px)',
            },
            '&[data-hovered]:not([data-selected])': {
              backgroundColor: `${colors.primary.blue}08`,
              transform: 'translateX(2px)',
            }
          }
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />

      {/* Mensaje de error */}
      {error && (
        <Text className={classes.errorText} data-error={!!error}>
          {error}
        </Text>
      )}
    </Box>
  );
}

export default Select;