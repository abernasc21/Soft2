import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Paper, Text, Group, Button, Stack } from '@mantine/core';
import { IconTrendingUp, IconTrendingDown, IconArrowsExchange, IconFilter, IconDownload, IconCalendar, IconChartBar } from '@tabler/icons-react';
import { useMovimientos } from './hooks/useMovimientos';
import MovimientosList from './components/MovimientosList';
import { Select } from '../global/components/Select/Select';
import { Buscador } from '../global/components/buscador/Buscador';
import Modal from '../global/components/modal/Modal';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import './ingresos-egresos.css';

/**
 * Componente principal para la gestión y visualización de ingresos y egresos de productos
 * Incluye funcionalidades de filtrado, búsqueda, estadísticas y exportación a Excel
 */
function IngresosEgresos() {
  const { movimientos, loading, error, buscarMovimientos } = useMovimientos();
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [filtroRapido, setFiltroRapido] = useState('general');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Media queries para diseño responsive
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });
  const isDesktop = useMediaQuery({ minWidth: 1025 });

  // Opciones para el select de filtro por tipo de movimiento
  const opcionesFiltro = [
    { value: 'todos', label: 'Todos los movimientos' },
    { value: 'ingreso', label: 'Solo ingresos' },
    { value: 'egreso', label: 'Solo egresos' },
  ];

  // Opciones para filtros rápidos de fecha predefinidos
  const opcionesFiltroRapido = [
    { value: 'general', label: 'General' },
    { value: 'hoy', label: 'Hoy'},
    { value: 'semana', label: 'Semana Actual' },
    { value: 'mes', label: 'Mes Actual' },
    { value: 'año', label: 'Año Actual' },
  ];

  /**
   * Aplica filtros rápidos de fecha según la opción seleccionada
   */
  const aplicarFiltroRapido = (filtro) => {
    const hoy = new Date();
    setFiltroRapido(filtro);
    
    switch (filtro) {
      case 'hoy': 
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        setDateRange({ start, end });
        break;
      case 'semana':
        const inicioSemana = new Date(hoy);
        inicioSemana.setDate(hoy.getDate() - hoy.getDay());
        setDateRange({ start: inicioSemana, end: hoy });
        break;
      case 'mes':
        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        setDateRange({ start: inicioMes, end: hoy });
        break;
      case 'año':
        const inicioAño = new Date(hoy.getFullYear(), 0, 1);
        setDateRange({ start: inicioAño, end: hoy });
        break;
      case 'general':
        setDateRange({ start: null, end: null });
        break;
      default:
        break;
    }
  };

  /**
   * Renderiza cada resultado individual en el buscador
   */
  const renderizarResultado = (resultado) => {
    const precio = typeof resultado.precio_venta === 'number' 
      ? resultado.precio_venta.toFixed(2) 
      : '-';

    return (
      <Group justify="space-between" w="100%">
        <div>
          <Text size="sm" fw={500}>
            {resultado.nombre}
          </Text>
          <Text size="xs" c="dimmed">
            {resultado.lote} • Bs.{precio}
          </Text>
        </div>
        <Text size="xs" c="blue" className="result-category">
          Movimiento
        </Text>
      </Group>
    );
  };

  /**
   * Filtra movimientos por rango de fechas
   */
  const filtrarPorFecha = (movimiento) => {
    if (!dateRange.start || !dateRange.end) return true;

    // Convertir todo a formato YYYY-MM-DD para comparación
    const fechaMov = movimiento.fecha.slice(0, 10); 
    const start = dateRange.start.toISOString().slice(0, 10);
    const end = dateRange.end.toISOString().slice(0, 10);

    return fechaMov >= start && fechaMov <= end;
  };

  /**
   * Aplica todos los filtros combinados a los movimientos
   * Combina búsqueda por texto, filtro por tipo y filtro por fecha
   */
  const movimientosFiltrados = buscarMovimientos(busqueda)
    .filter(mov => {
      const coincideTipo = 
        filtroTipo === 'todos' ||
        (filtroTipo === 'ingreso' && mov.stock_nuevo > mov.stock_antiguo) ||
        (filtroTipo === 'egreso' && mov.stock_nuevo < mov.stock_antiguo);
      
      return coincideTipo;
    })
    .filter(filtrarPorFecha);

  // Prepara datos para mostrar en resultados de búsqueda
  const resultadosBusquedaA = movimientosFiltrados.map(m => ({
    nombre: m.nombre,
    laboratorio: m.laboratorio,
    precio_venta: m.precio_venta,
    lote: m.lote,
    tipo: m.tipo,
  }));

  // Calcula estadísticas de movimientos
  const totalIngresos = movimientosFiltrados.filter(m => m.stock_nuevo > m.stock_antiguo).length;
  const totalEgresos = movimientosFiltrados.filter(m => m.stock_nuevo < m.stock_antiguo).length;
  const totalMovimientos = movimientosFiltrados.length;

  /**
   * Genera y descarga un reporte en formato Excel con los movimientos filtrados
   * Incluye formato condicional y estilos para mejor presentación
   */
  const generarReporteExcel = async () => {
    if (!movimientosFiltrados || movimientosFiltrados.length === 0) {
      alert("No hay datos para generar el reporte.");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Movimientos");

    // Configuración del título del reporte
    worksheet.mergeCells("A1:J1");
    const titulo = worksheet.getCell("A1");
    titulo.value = "Reporte de Ingresos - Egresos";
    titulo.font = { bold: true, size: 16 };
    titulo.alignment = { horizontal: "center" };

    // Encabezados de columnas
    worksheet.addRow([]);
    const encabezados = [
      "N°",
      "Nombre",
      "Presentación",
      "Laboratorio",
      "Lote",
      "Precio Venta (Bs)",
      "Stock Antiguo",
      "Stock Nuevo",
      "Tipo",
      "Fecha"
    ];
    const headerRow = worksheet.addRow(encabezados);

    // Aplicar estilos a los encabezados
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "70E2FA" } 
      };
      cell.font = { bold: true, color: { argb: "000000" } };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" }
      };
    });

    // Llenar filas con datos de movimientos
    movimientosFiltrados.forEach((m, i) => {
      const row = worksheet.addRow([
        i + 1,
        m.nombre,
        m.presentacion,
        m.laboratorio,
        m.lote,
        m.precio_venta?.toFixed(2) || "0.00",
        m.stock_antiguo,
        m.stock_nuevo,
        m.tipo === "ingreso" ? "Ingreso" : "Egreso",
        m.fecha
      ]);

      // Aplicar bordes a todas las celdas de la fila
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" }
        };
        cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
      });

      // Colorear celda de tipo según ingreso/egreso
      const tipoCell = row.getCell(9);
      tipoCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: m.tipo === "ingreso" ? "C6F6D5" : "FEB2B2" }
      };
    });

    // Ajustar anchos de columnas para mejor visualización
    const widths = [5, 20, 20, 20, 10, 15, 15, 15, 15, 15];
    widths.forEach((w, i) => worksheet.getColumn(i + 1).width = w);

    // Generar y descargar archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const fechaActual = new Date().toISOString().split("T")[0];
    saveAs(new Blob([buffer]), `reporte-ingresos-egresos-${fechaActual}.xlsx`);
  };

  /**
   * Aplica intervalo de fechas personalizado desde el modal

   */
  const handleAplicarIntervalo = (fechaInicio, fechaFin) => {
    const start = fechaInicio ? new Date(fechaInicio) : null;
    const end = fechaFin ? new Date(fechaFin) : null;
    setDateRange({ start, end });
    setIsModalOpen(false);
  };

  /**
   * Limpia todos los filtros de fecha aplicados
   */
  const handleLimpiarIntervalo = () => {
    setDateRange({ start: null, end: null });
    setFiltroRapido('general');
  };

  // Estados de carga y error
  if (loading) {
    return <div className="cargando">Cargando movimientos...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="ingresos-egresos-container">
      {/* Header con diseño responsive */}
      <div className={`ingresos-egresos-header ${isMobile ? 'mobile' : ''}`}>
        <div className="ingresos-egresos-icon-container">
          <IconChartBar size={isMobile ? 24 : 30} /> 
        </div>
        <span className="ingresos-egresos-titulo">
          {isMobile ? 'Ingresos y Egresos' : 'Ingresos y Egresos de Productos'}
        </span>
      </div>
      
      {/* Controles de filtros y búsqueda con diseño responsive */}
      <div className="ingresos-egresos-controles-container">
        {isMobile ? (
          // Vista Mobile - Diseño en columna vertical
          <Stack gap="md" w="100%">
            {/* Buscador de movimientos */}
            <Buscador
              placeholder="Buscar por Lote o Nombre..."
              value={busqueda}
              onChange={setBusqueda}
              results={resultadosBusquedaA}
              renderResult={renderizarResultado}
              style={{ width: '100%' }}
            />
            
            {/* Selectores de filtro en columna */}
            <Select
              label="Filtrar por tipo"
              value={filtroTipo}
              onChange={setFiltroTipo}
              data={opcionesFiltro}
              size="sm"
              style={{ width: '100%' }}
              placeholder="Tipo"
              icon={<IconFilter size={16} />}
            />

            <Select
              label="Período"
              value={filtroRapido}
              onChange={aplicarFiltroRapido}
              data={opcionesFiltroRapido}
              size="sm"
              style={{ width: '100%' }}
              placeholder="Período"
              icon={<IconCalendar size={16} />}
            />

            {/* Botones de acción para mobile */}
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
                onClick={generarReporteExcel}
                disabled={movimientosFiltrados.length === 0}
                size="sm"
              >
                Excel
              </Button>
            </Group>

            {/* Botón para limpiar filtros cuando están activos */}
            {dateRange.start && (
              <Button
                className='btn-limpiarIE'
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
          // Vista Desktop/Tablet - Diseño en línea horizontal
          <Group gap="md" align="flex-end" style={{ width: '100%' }}>
            {/* Buscador ubicado a la izquierda */}
            <div className="ingresos-egresos-busqueda-container" style={{ alignSelf: 'flex-end' }}>
              <Buscador
                placeholder="Buscar por Lote o Nombre..."
                value={busqueda}
                onChange={setBusqueda}
                results={resultadosBusquedaA}
                renderResult={renderizarResultado}
                style={{ width: isTablet ? '300px' : '370px' }}
              />
            </div>
            
            {/* Filtros y botones ubicados a la derecha */}
            <Group gap="md" align="flex-end" style={{ marginLeft: 'auto' }}>
              <Select
                label="Filtrar por tipo"
                value={filtroTipo}
                onChange={setFiltroTipo}
                data={opcionesFiltro}
                size="sm"
                style={{ minWidth: isTablet ? '150px' : '180px' }}
                placeholder="Tipo"
                icon={<IconFilter size={16} />}
              />

              <Select
                label="Período"
                value={filtroRapido}
                onChange={aplicarFiltroRapido}
                data={opcionesFiltroRapido}
                size="sm"
                style={{ minWidth: isTablet ? '150px' : '180px' }}
                placeholder="Período"
                icon={<IconCalendar size={16} />}
              />

              <Button
                variant={dateRange.start ? "filled" : "outline"}
                leftSection={<IconCalendar size={16} />}
                onClick={() => setIsModalOpen(true)}
                size="sm"
              >
                Intervalo {dateRange.start && '✓'}
              </Button>
            </Group>

            {/* Contenedor para botones de limpiar y exportar */}
            <div style={{ position: 'relative' }}>
              <Stack gap="xs" align="center">
                {dateRange.start && (
                  <Button
                    className='btn-limpiarIE'
                    variant="subtle"
                    color="red"
                    onClick={handleLimpiarIntervalo}
                    size="sm"
                    style={{ 
                      position: 'absolute',
                      top: '-60px',
                      right: '0'
                    }}
                  >
                    Limpiar
                  </Button>
                )}
                <Button
                  variant="filled"
                  leftSection={<IconDownload size={16} />}
                  onClick={generarReporteExcel}
                  disabled={movimientosFiltrados.length === 0}
                  size="sm"
                >
                  {isTablet ? 'Excel' : 'Generar Reporte Excel'}
                </Button>
              </Stack>
            </div>
          </Group>
        )}
      </div>

      {/* Sección de estadísticas con diseño responsive */}
      <div className={`stats-container ${isMobile ? 'mobile' : ''}`}>
        <Paper className="stat-card" shadow="sm" p={isMobile ? "sm" : "md"}>
          <div className="stat-icon-total"><IconArrowsExchange size={isMobile ? 20 : 24} /></div>
          <Text size={isMobile ? "xs" : "sm"} c="dimmed">Total Movimientos</Text>
          <Text className="number-total">{totalMovimientos}</Text>
        </Paper>

        <Paper className="stat-card" shadow="sm" p={isMobile ? "sm" : "md"}>
          <div className="stat-icon-ingreso"><IconTrendingUp size={isMobile ? 20 : 24} /></div>
          <Text size={isMobile ? "xs" : "sm"} c="dimmed">Ingresos</Text>
          <Text className="number-ingreso">{totalIngresos}</Text>
        </Paper>

        <Paper className="stat-card" shadow="sm" p={isMobile ? "sm" : "md"}>
          <div className="stat-icon-egreso"><IconTrendingDown size={isMobile ? 20 : 24} /></div>
          <Text size={isMobile ? "xs" : "sm"} c="dimmed">Egresos</Text>
          <Text className="number-egreso">{totalEgresos}</Text>
        </Paper>

        <Paper className="stat-card" shadow="sm" p={isMobile ? "sm" : "md"}>
          <div className="stat-icon-saldo"><IconArrowsExchange size={isMobile ? 20 : 24} /></div>
          <Text size={isMobile ? "xs" : "sm"} c="dimmed">Saldo Neto</Text>
          <Text className="number-saldo">{totalIngresos - totalEgresos}</Text>
        </Paper>
      </div>

      {/* Componente de lista de movimientos */}
      <MovimientosList movimientos={movimientosFiltrados} />

      {/* Modal para selección de rango de fechas personalizado */}
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
 * Componente modal para selección personalizada de rango de fechas

 */
function DateRangeModal({ onApply, onCancel, isMobile }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  /**
   * Maneja la aplicación del rango de fechas seleccionado
   */
  const handleApply = () => {
    if (startDate && endDate) {
      onApply(startDate, endDate);
    }
  };

  // Valida que las fechas sean válidas y estén en orden correcto
  const isDateValid = startDate && endDate && new Date(startDate) <= new Date(endDate);

  return (
    <Stack gap="md">
      <div className={`ie-date-inputs ${isMobile ? 'mobile' : ''}`}>
        <div className="ie-date-field">
          <label>Fecha Inicio:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="ie-date-picker"
            max={endDate || undefined}
          />
        </div>
        <div className="ie-date-field">
          <label>Fecha Fin:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="ie-date-picker"
            min={startDate || undefined}
          />
        </div>
      </div>
      
      {/* Mensaje de error para fechas inválidas */}
      {startDate && endDate && new Date(startDate) > new Date(endDate) && (
        <Text size="sm" c="red">
          La fecha de inicio no puede ser mayor a la fecha fin
        </Text>
      )}
      
      {/* Botones de acción del modal */}
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

export default IngresosEgresos;