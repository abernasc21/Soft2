import { useState, useEffect, useRef } from 'react';
import { TextInput, Box, Text, Group, ActionIcon, Kbd } from '@mantine/core';
import { 
  IconSearch, 
  IconX, 
  IconArrowRight,
  IconCommand 
} from '@tabler/icons-react';
import { useColors } from '../../hooks/useColors';
import classes from './buscador.module.css';

/**
 * Componente de búsqueda avanzado con resultados en tiempo real
 * Soporta atajos de teclado, búsqueda en tiempo real y selección de resultados
 */
export function Buscador({
  placeholder = 'Buscar...',
  value = '',
  onChange = () => {},
  onSearch = () => {},
  onClear = () => {},
  size = 'md',
  width = '100%',
  maxWidth = '400px',
  withShortcut = true,
  withSearchButton = false,
  autoFocus = false,
  disabled = false,
  loading = false,
  results = [],
  renderResult = null,
  onResultSelect = null,
  ...props
}) {
  const colors = useColors();
  const [isFocused, setIsFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef(null);

  // Manejar atajo de teclado (Escape para cerrar)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowResults(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Mostrar/ocultar resultados basado en valor y foco
  useEffect(() => {
    if (value.trim() && isFocused && results.length > 0) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [value, isFocused, results]);

  const handleChange = (event) => {
    onChange(event.currentTarget.value);
  };

  const handleClear = () => {
    onChange('');
    onClear();
    inputRef.current?.focus();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(value);
    setShowResults(false);
  };

  const handleResultClick = (result) => {
    if (onResultSelect) {
      onResultSelect(result);
      setShowResults(false);
    }
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    if (value.trim() && results.length > 0) {
      setShowResults(true);
    }
  };

  const handleInputBlur = () => {
    // Pequeño delay para permitir clicks en los resultados
    setTimeout(() => {
      setIsFocused(false);
      setShowResults(false);
    }, 200);
  };

  return (
    <Box 
      className={classes.container}
      style={{ 
        width: width,
        maxWidth: maxWidth 
      }}
    >
      <form onSubmit={handleSubmit} className={classes.form}>
        <TextInput
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          size={size}
          classNames={{
            root: classes.root,
            input: classes.input,
            section: classes.section,
          }}
          styles={{
            input: {
              borderRadius: '12px',
              fontWeight: 500,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              border: '2px solid transparent',
              background: `linear-gradient(135deg, ${colors.background.white} 0%, ${colors.background.light} 100%)`,
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
              '&:focus, &:focus-within': {
                borderColor: colors.primary.cyan,
                boxShadow: `0 0 0 3px ${colors.primary.cyan}20, 0 10px 30px rgba(4, 191, 191, 0.2)`,
                transform: 'translateY(-2px)',
              },
              '&:hover:not(:disabled):not(:focus)': {
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)',
                transform: 'translateY(-1px)',
              }
            }
          }}
          leftSection={
            <IconSearch 
              size={18} 
              className={classes.searchIcon}
              style={{
                color: isFocused ? colors.primary.cyan : colors.text.muted
              }}
            />
          }
          rightSectionWidth={value ? 80 : withShortcut ? 60 : 40}
          rightSection={
            <Group gap="xs" className={classes.rightSection}>
              {/* Botón limpiar cuando hay valor */}
              {value && (
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  onClick={handleClear}
                  className={classes.clearButton}
                >
                  <IconX size={14} />
                </ActionIcon>
              )}
              
              {/* Botón de búsqueda (opcional) */}
              {withSearchButton && value && (
                <ActionIcon
                  type="submit"
                  size="sm"
                  variant="gradient"
                  className={classes.searchButton}
                  loading={loading}
                >
                  <IconArrowRight size={14} />
                </ActionIcon>
              )}
            </Group>
          }
          {...props}
        />
      </form>

      {/* Panel de resultados desplegable */}
      {showResults && results.length > 0 && (
        <Box className={classes.resultsPanel}>
          <Box className={classes.resultsContainer}>
            {results.map((result, index) => (
              <Box
                key={result.id || index}
                className={classes.resultItem}
                onClick={() => handleResultClick(result)}
              >
                {renderResult ? (
                  // Renderizado personalizado del resultado
                  renderResult(result)
                ) : (
                  // Renderizado por defecto
                  <Group justify="space-between" w="100%">
                    <Text size="sm" className={classes.resultText}>
                      {result.name}
                    </Text>
                    <Text size="sm" className={classes.resultText}>
                      {result.label}
                    </Text>
                    <Text size="sm" className={classes.resultText}>
                      {result.value} Bs
                    </Text>
                  </Group>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default Buscador;