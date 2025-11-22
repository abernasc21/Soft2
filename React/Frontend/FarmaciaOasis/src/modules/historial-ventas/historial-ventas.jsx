import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useVentas } from './hooks/useVentas';
import VentasList from './components/VentasList';
import { Buscador } from '../global/components/buscador/Buscador';
import Modal from '../global/components/modal/Modal';
import { Select as MantineSelect, Button, Group, Stack, Text, Paper } from '@mantine/core';
import { IconCalendar, IconDownload } from '@tabler/icons-react';
import { IconCurrencyDollar } from '@tabler/icons-react';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import './historial-ventas.css';

/**
 * Componente principal del historial de ventas
 * Incluye filtros, búsqueda, exportación a Excel y vista responsive
 */
function HistorialVentas() {
  const { 
    ventas, 
    ventasOriginales, 
    loading, 
    error, 
    busqueda,
    filtroTipo,
    dateRange,
    setBusqueda, 
    setFiltroTipo, 
    setDateRange 
  } = useVentas();
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Media queries para diseño responsive
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });
  

  const handleBusquedaChange = (valor) => {
    setBusqueda(valor);
  };

  const handleFiltroChange = (value) => {
    console.log('Cambiando filtro a:', value);
    setFiltroTipo(value);
  };

  /**
   * Genera reporte en formato Excel con todos los datos de ventas
   * Incluye formato profesional con estilos y bordes
   */
  const handleGenerarReporte = async () => {
    if (!ventas || ventas.length === 0) {
      alert("No hay datos de ventas para generar el reporte.");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Historial de Ventas");

    // Título principal del reporte
    worksheet.mergeCells("A1:I1");
    const titulo = worksheet.getCell("A1");
    titulo.value = "Reporte de Ventas";
    titulo.font = { bold: true, size: 18 };
    titulo.alignment = { horizontal: "center", vertical: "middle" };

    // Encabezados de columnas
    const encabezados = [
      "Nro",
      "ID Venta",
      "Fecha",
      "Hora",
      "Nombre del Cliente",
      "CI/NIT",
      "Método de Pago",
      "Productos Vendidos",
      "Total (Bs)"
    ];
    worksheet.addRow([]);
    const headerRow = worksheet.addRow(encabezados);

    // Estilo para encabezados
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "70E2FA" },
      };
      cell.font = { bold: true, color: { argb: "FFFFFF" } };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Agregar datos de ventas al Excel
    ventas.forEach((v, i) => {
      const row = worksheet.addRow([
        i + 1,
        v.id_venta,
        v.fecha,
        v.hora,
        v.cliente,
        v.ci_nit,
        v.metodo_pago,
        v.productos,
        v.total?.toFixed(2) || "0.00",
      ]);

      // Aplicar bordes a cada celda
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = { vertical: "middle", wrapText: true };
      });
    });

    // Ajustar anchos de columnas para mejor visualización
    const anchos = [5, 12, 12, 10, 25, 12, 15, 45, 12];
    anchos.forEach((width, i) => {
      worksheet.getColumn(i + 1).width = width;
    });

    // Guardar el archivo con nombre con fecha
    const buffer = await workbook.xlsx.writeBuffer();
    const fechaActual = new Date().toISOString().split("T")[0];
    saveAs(new Blob([buffer]), `reporte-ventas-${fechaActual}.xlsx`);
  };

  const handleAplicarIntervalo = (fechaInicio, fechaFin) => {
    console.log('Aplicando intervalo:', fechaInicio, 'a', fechaFin);
    setDateRange({ start: fechaInicio, end: fechaFin });
    setIsModalOpen(false);
  };

  const handleLimpiarIntervalo = () => {
    console.log('Limpiando intervalo');
    setDateRange({ start: null, end: null });
  };

  // Opciones para el selector de período
  const opcionesReporte = [
    { value: 'general', label: 'General' },
    { value: 'hoy', label: 'Hoy' },
    { value: 'semana', label: 'Semana Actual' },
    { value: 'mes', label: 'Mes Actual' },
    { value: 'año', label: 'Año Actual' },
  ];

  // Debug info para desarrollo
  console.log('Estado actual:', {
    filtroTipo,
    busqueda,
    dateRange,
    ventasCount: ventas.length,
    ventasOriginalesCount: ventasOriginales.length
  });

  // Estados de carga y error
  if (loading) {
    return <div className="cargando">Cargando historial de ventas...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="historial-ventas-container">
      {/* Header con ícono y título */}
      <div className={`historial-header ${isMobile ? 'mobile' : ''}`}>
        <div className="historial-icon-container">
          <IconCurrencyDollar size={isMobile ? 24 : 30} /> 
        </div>
        <span className="historial-titulo">Historial de Ventas</span>
      </div>
      <br />
      
      {/* Controles de filtros y búsqueda */}
      <div className="historial-controles-container">
        {/* Buscador en desktop */}
        {!isMobile && (
          <div className="historial-busqueda-container">
            <Buscador
              placeholder="Buscar por ID de venta y nombre producto..."
              value={busqueda}
              onChange={handleBusquedaChange}
              style={{ width: isTablet ? '300px' : '400px' }}
            />
          </div>
        )}
        
        <div className="historial-filtros-container">
          {isMobile ? (
            // Vista Mobile - Diseño en columna
            <Stack gap="md" w="100%">
              {/* Buscador en móvil */}
              <Buscador
                placeholder="Buscar ventas..."
                value={busqueda}
                onChange={handleBusquedaChange}
                style={{ width: '100%' }}
              />
              
              <MantineSelect
                label="Periodo del Reporte"
                value={filtroTipo}
                onChange={handleFiltroChange}
                data={opcionesReporte}
                size="sm"
                style={{ width: '100%' }}
                placeholder="Seleccionar período"
                leftSection={<IconCalendar size={16} />}
              />

              <Group gap="sm" grow>
                <Button
                  variant={dateRange.start ? "filled" : "outline"}
                  leftSection={<IconCalendar size={16} />}
                  onClick={() => setIsModalOpen(true)}
                  size="sm"
                >
                  {dateRange.start ? '✓' : 'Intervalo'}
                </Button>
                
                <Button
                  variant="filled"
                  leftSection={<IconDownload size={16} />}
                  onClick={handleGenerarReporte}
                  disabled={ventas.length === 0}
                  size="sm"
                >
                  Excel
                </Button>
              </Group>

              {/* Botón limpiar filtros cuando hay intervalo activo */}
              {dateRange.start && (
                <Button
                  className='btn-limpiarHV'
                  variant="subtle"
                  color="red"
                  onClick={handleLimpiarIntervalo}
                  size="sm"
                  fullWidth
                >
                  Limpiar Filtros
                </Button>
              )}
            </Stack>
          ) : (
            // Vista Desktop/Tablet - Diseño en línea
            <Group gap="md" align="flex-end" wrap={isTablet ? 'wrap' : 'nowrap'}>
              {/* Buscador en tablet */}
              {isTablet && (
                <div className="historial-busqueda-container">
                  <Buscador
                    placeholder="Buscar ventas..."
                    value={busqueda}
                    onChange={handleBusquedaChange}
                    style={{ width: '100%' }}
                  />
                </div>
              )}
              
              <MantineSelect
                label="Periodo del Reporte"
                value={filtroTipo}
                onChange={handleFiltroChange}
                data={opcionesReporte}
                size="sm"
                style={{ minWidth: isTablet ? '200px' : '250px' }}
                placeholder="Seleccionar período"
                leftSection={<IconCalendar size={16} />}
              />

              <Button
                variant={dateRange.start ? "filled" : "outline"}
                leftSection={<IconCalendar size={16} />}
                onClick={() => setIsModalOpen(true)}
                size="sm"
              >
                Intervalo {dateRange.start && '✓'}
              </Button>

              {/* Botones alineados a la derecha */}
              <div className="botones-derecha">
                <Stack gap="xs" align="flex-end">
                  {dateRange.start && (
                    <Button
                      className='btn-limpiarHV'
                      variant="subtle"
                      color="red"
                      onClick={handleLimpiarIntervalo}
                      size="sm"
                    >
                      Limpiar
                    </Button>
                  )}
                  <Button
                    variant="filled"
                    leftSection={<IconDownload size={16} />}
                    onClick={handleGenerarReporte}
                    disabled={ventas.length === 0}
                    size="sm"
                  >
                    {isTablet ? 'Excel' : 'Generar Reporte Excel'}
                  </Button>
                </Stack>
              </div>
            </Group>
          )}
        </div>
      </div>

      {/* Lista de Ventas o Mensaje de no datos */}
      {ventas.length === 0 ? (
        <Paper p="xl" withBorder radius="lg" className="no-data-message">
          <Stack align="center" gap="md">
            <Text size="lg" c="dimmed" ta="center">
              {filtroTipo !== 'general' || dateRange.start || busqueda 
                ? "No hay ventas que coincidan con los filtros aplicados" 
                : "No hay ventas registradas"}
            </Text>
          </Stack>
        </Paper>
      ) : (
        <VentasList ventas={ventas} />
      )}

      {/* Modal para selección de rango de fechas */}
      <Modal
        titulo="Seleccionar Intervalo de Fechas"        
        onClose={() => setIsModalOpen(false)}
        size={isMobile ? 'sm' : 'md'}
        opened={isModalOpen}
      >
        <DateRangeModal 
          onApply={handleAplicarIntervalo}
          onCancel={() => setIsModalOpen(false)}
          isMobile={isMobile}
        />
      </Modal>
    </div>
  );
}

/**
 * Componente modal para selección de rango de fechas
 * Incluye validación de fechas y controles de aplicación
 */
function DateRangeModal({ onApply, onCancel, isMobile }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleApply = () => {
    if (startDate && endDate) {
      onApply(startDate, endDate);
    }
  };

  const isDateValid = startDate && endDate && new Date(startDate) <= new Date(endDate);

  return (
    <Stack gap="md">
      <div className={`historial-date-inputs ${isMobile ? 'mobile' : ''}`}>
        <div className="historial-date-field">
          <label>Fecha Inicio:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="date-picker"
            max={endDate || undefined}
          />
        </div>
        <div className="historial-date-field">
          <label>Fecha Fin:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="date-picker"
            min={startDate || undefined}
          />
        </div>
      </div>
      
      {/* Validación de fechas */}
      {startDate && endDate && new Date(startDate) > new Date(endDate) && (
        <Text size="sm" c="red">
          La fecha de inicio no puede ser mayor a la fecha fin
        </Text>
      )}
      
      <Group justify="center" gap="sm" grow={isMobile}>
        <Button variant="outline" onClick={onCancel} fullWidth={isMobile}>
          Cancelar
        </Button>
        <Button 
          onClick={handleApply}
          disabled={!isDateValid}
          fullWidth={isMobile}
        >
          Aplicar
        </Button>
      </Group>
    </Stack>
  );
}

export default HistorialVentas;