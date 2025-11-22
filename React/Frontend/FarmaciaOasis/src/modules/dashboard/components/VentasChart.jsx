import { useState, useMemo } from 'react';
import { Paper, Title, Text, Group, Badge, ThemeIcon, Button, Select } from '@mantine/core';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { IconTrendingUp, IconCurrencyDollar, IconChartLine, IconPackage, IconReceipt, IconCalendar } from '@tabler/icons-react';
import '../dashboard.css';

/**
 * Gráfico de ventas interactivo con selector de años y tipo de visualización
 * Muestra tendencias mensuales con métricas detalladas
 */
function VentasChart({ data }) {
  const [tipoGrafica, setTipoGrafica] = useState('monto');
  const [añoSeleccionado, setAñoSeleccionado] = useState('');
  
  // Extraer años únicos de los datos para el selector
  const añosDisponibles = useMemo(() => {
    const años = [...new Set(data.map(item => item.año))].sort((a, b) => b - a);
    return años.map(año => ({ value: año, label: año }));
  }, [data]);

  // Filtrar datos por año seleccionado
  const datosFiltrados = useMemo(() => {
    if (!añoSeleccionado) return data;
    return data.filter(item => item.año === añoSeleccionado);
  }, [data, añoSeleccionado]);

  // Establecer año más reciente por defecto
  useMemo(() => {
    if (añosDisponibles.length > 0 && !añoSeleccionado) {
      setAñoSeleccionado(añosDisponibles[0].value);
    }
  }, [añosDisponibles, añoSeleccionado]);

  // Cálculo de métricas principales
  const totalVentas = datosFiltrados.reduce((sum, item) => sum + (item.ventas || 0), 0);
  const totalProductos = datosFiltrados.reduce((sum, item) => sum + (item.productos || 0), 0);
  const totalNroVentas = datosFiltrados.reduce((sum, item) => sum + (item.nroVentas || 0), 0);
  const promedioVentas = datosFiltrados.length > 0 ? totalVentas / datosFiltrados.length : 0;
  const promedioNroVentas = datosFiltrados.length > 0 ? totalNroVentas / datosFiltrados.length : 0;
  
  // Cálculo de tendencia (crecimiento vs mes anterior)
  const crecimiento = datosFiltrados.length > 1 ? 
    ((datosFiltrados[datosFiltrados.length - 1][tipoGrafica === 'monto' ? 'ventas' : 'nroVentas'] - 
      datosFiltrados[datosFiltrados.length - 2][tipoGrafica === 'monto' ? 'ventas' : 'nroVentas']) / 
     datosFiltrados[datosFiltrados.length - 2][tipoGrafica === 'monto' ? 'ventas' : 'nroVentas'] * 100).toFixed(1) : 0;
  
  // Identificar mejor y peor mes según tipo de gráfica
  const mejorMes = datosFiltrados.length > 0 
    ? (tipoGrafica === 'monto' 
        ? datosFiltrados.reduce((max, item) => (item.ventas || 0) > (max.ventas || 0) ? item : max, datosFiltrados[0])
        : datosFiltrados.reduce((max, item) => (item.nroVentas || 0) > (max.nroVentas || 0) ? item : max, datosFiltrados[0]))
    : { mes: 'N/A', ventas: 0, nroVentas: 0 };

  const peorMes = datosFiltrados.length > 0
    ? (tipoGrafica === 'monto'
        ? datosFiltrados.reduce((min, item) => (item.ventas || 0) < (min.ventas || 0) ? item : min, datosFiltrados[0])
        : datosFiltrados.reduce((min, item) => (item.nroVentas || 0) < (min.nroVentas || 0) ? item : min, datosFiltrados[0]))
    : { mes: 'N/A', ventas: 0, nroVentas: 0 };

  // Valores dinámicos según tipo de gráfica seleccionada
  const totalActual = tipoGrafica === 'monto' ? totalVentas : totalNroVentas;
  const promedioActual = tipoGrafica === 'monto' ? promedioVentas : promedioNroVentas;

  // Preparar datos para la gráfica según selección
  const datosGrafica = tipoGrafica === 'monto' 
    ? datosFiltrados.map(item => ({ ...item, valor: item.ventas || 0, nombre: 'Monto Ventas' }))
    : datosFiltrados.map(item => ({ ...item, valor: item.nroVentas || 0, nombre: 'Número de Ventas' }));

  const colorLinea = tipoGrafica === 'monto' ? '#034C8C' : '#8B5CF6';

  return (
    <Paper p="xl" withBorder radius="lg" shadow="md" className="ventas-chart-container">
      {/* Header con título, métricas y selector de año */}
      <Group justify="space-between" align="center" mb="xl">
        <Group gap="sm">
          <ThemeIcon size="lg" color="blue" variant="light">
            <IconChartLine size={20} />
          </ThemeIcon>
          <div>
            <Title order={2} c="dark.8" className="ventas-chart-title">
              Análisis de Ventas
            </Title>
            <Text size="sm" c="dimmed" className="ventas-chart-subtitle">
              {añoSeleccionado ? `Datos del año ${añoSeleccionado}` : 'Todos los años - Tendencias mensuales'}
            </Text>
          </div>
        </Group>

        {/* Métricas rápidas y selector de año */}
        <Group gap="xl">
          {/* Total Acumulado */}
          <div style={{ textAlign: 'center' }}>
            <Badge color="blue" variant="light" size="sm" mb={4}>
              TOTAL
            </Badge>
            <Text fw={700} size="lg" c="blue.6">
              {tipoGrafica === 'monto' ? 'Bs ' : ''}{totalActual.toLocaleString('es-ES')}
            </Text>
          </div>

          {/* Tendencia */}
          <div style={{ textAlign: 'center' }}>
            <Badge color={crecimiento >= 0 ? "green" : "red"} variant="light" size="sm" mb={4}>
              {crecimiento >= 0 ? "📈" : "📉"} TENDENCIA
            </Badge>
            <Text fw={700} size="lg" c={crecimiento >= 0 ? "green.6" : "red.6"}>
              {crecimiento >= 0 ? "+" : ""}{crecimiento}%
            </Text>
          </div>

          {/* Selector de Años */}
          <div style={{ textAlign: 'center' }}>
            <Badge color="grape" variant="light" size="sm" mb={4}>
              AÑO
            </Badge>
            <Select
              value={añoSeleccionado}
              onChange={setAñoSeleccionado}
              data={[...añosDisponibles]}
              placeholder="Año"
              styles={{
                input: {
                  fontWeight: 700,
                  textAlign: 'center',
                  color: 'var(--mantine-color-grape-6)',
                  border: 'none',
                  background: 'transparent',
                  fontSize: '16px',
                  padding: '0 12px',
                  height: 'auto',
                  minHeight: '30px',
                  lineHeight: '1.2'
                },
                root: {
                  width: '100%',
                  maxWidth: '90px'
                }
              }}
              size="xs"
            />
          </div>
        </Group>
      </Group>

      {/* Selector de tipo de gráfica */}
      <Group justify="center" mb="md" gap="sm">
        <Button
          variant={tipoGrafica === 'monto' ? 'filled' : 'light'}
          color="blue"
          leftSection={<IconCurrencyDollar size={16} />}
          onClick={() => setTipoGrafica('monto')}
          size="md"
          radius="xl"
          className="chart-type-button"
        >
          Monto Ventas (Bs)
        </Button>
        
        <Button
          variant={tipoGrafica === 'numero' ? 'filled' : 'light'}
          color="violet"
          leftSection={<IconReceipt size={16} />}
          onClick={() => setTipoGrafica('numero')}
          size="md"
          radius="xl"
          className="chart-type-button"
        >
          Número de Ventas
        </Button>
      </Group>

      {/* Gráfica lineal interactiva */}
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={datosGrafica}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#f0f0f0" 
              vertical={false}
            />
            
            <XAxis 
              dataKey="mes" 
              tick={{ fill: '#666', fontSize: 12, fontWeight: 600 }}
              axisLine={{ stroke: '#e0e0e0' }}
              tickLine={false}
              padding={{ left: 10, right: 10 }}
            />
            
            <YAxis 
              tick={{ fill: '#666', fontSize: 12 }}
              axisLine={{ stroke: '#e0e0e0' }}
              tickLine={false}
              tickFormatter={(value) => 
                tipoGrafica === 'monto' ? `Bs ${value}` : `${value}`
              }
            />
            
            <Tooltip 
              formatter={(value) => [
                tipoGrafica === 'monto' ? `Bs ${Number(value).toLocaleString('es-ES')}` : `${value}`,
                tipoGrafica === 'monto' ? 'Monto Ventas' : 'Número de Ventas'
              ]}
              labelFormatter={(label) => `Mes: ${label}`}
              contentStyle={{ 
                borderRadius: '12px',
                border: '1px solid #e0e0e0',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                background: 'white',
                fontSize: '14px',
                fontWeight: 600
              }}
              labelStyle={{
                fontWeight: 700,
                color: colorLinea,
                fontSize: '13px'
              }}
            />
            
            <Line 
              type="monotone" 
              dataKey="valor" 
              stroke={colorLinea}
              strokeWidth={3}
              dot={{ fill: colorLinea, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: colorLinea, strokeWidth: 2 }}
              name={tipoGrafica === 'monto' ? 'Monto Ventas' : 'Número de Ventas'}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Panel de métricas detalladas */}
      <Group direction="column" gap="md" mt="lg" p="md" className="ventas-chart-footer">
        <Group justify="space-around" w="100%">
          <Group gap="md" className="metric-group">
            <ThemeIcon className="metric-icon" color="blue" variant="light">
              <IconCurrencyDollar size={18} />
            </ThemeIcon>
            <div>
              <Text className="metric-label">
                {tipoGrafica === 'monto' ? 'Promedio Mensual' : 'Prom. Ventas/Mes'}
              </Text>
              <Text className="metric-value" c="blue.6">
                {tipoGrafica === 'monto' ? 'Bs ' : ''}{promedioActual.toLocaleString('es-ES', { 
                  minimumFractionDigits: 0, 
                  maximumFractionDigits: tipoGrafica === 'monto' ? 0 : 1 
                })}
              </Text>
            </div>
          </Group>
          
          <Group gap="md" className="metric-group">
            <ThemeIcon className="metric-icon" color="green" variant="light">
              <IconTrendingUp size={18} />
            </ThemeIcon>
            <div>
              <Text className="metric-label">
                {tipoGrafica === 'monto' ? 'Mejor Mes' : 'Mes Más Ventas'}
              </Text>
              <Text className="metric-value" c="green.6">
                {mejorMes.mes}
              </Text>
              <Text className="metric-detail">
                {tipoGrafica === 'monto' 
                  ? `Bs ${mejorMes.ventas.toLocaleString('es-ES')}`
                  : `${mejorMes.nroVentas} ventas`
                }
              </Text>
            </div>
          </Group>
          
          <Group gap="md" className="metric-group">
            <ThemeIcon className="metric-icon" color="orange" variant="light">
              <IconChartLine size={18} />
            </ThemeIcon>
            <div>
              <Text className="metric-label">Mes Más Bajo</Text>
              <Text className="metric-value" c="orange.6">
                {peorMes.mes}
              </Text>
              <Text className="metric-detail">
                {tipoGrafica === 'monto' 
                  ? `Bs ${peorMes.ventas.toLocaleString('es-ES')}`
                  : `${peorMes.nroVentas} ventas`
                }
              </Text>
            </div>
          </Group>
        </Group>

        {/* Métricas adicionales */}
        <Group justify="space-around" w="100%">
          <Group gap="md" className="metric-group">
            <ThemeIcon className="metric-icon" color="cyan" variant="light">
              <IconPackage size={18} />
            </ThemeIcon>
            <div>
              <Text className="metric-label">Total Productos</Text>
              <Text className="metric-value" c="cyan.6">
                {totalProductos.toLocaleString('es-ES')}
              </Text>
              <Text className="metric-detail">
                unidades
              </Text>
            </div>
          </Group>

          <Group gap="md" className="metric-group">
            <ThemeIcon className="metric-icon" color="violet" variant="light">
              <IconReceipt size={18} />
            </ThemeIcon>
            <div>
              <Text className="metric-label">Nro. de Ventas</Text>
              <Text className="metric-value" c="violet.6">
                {totalNroVentas.toLocaleString('es-ES')}
              </Text>
              <Text className="metric-detail">
                transacciones
              </Text>
            </div>
          </Group>
        </Group>
      </Group>
    </Paper>
  );
}

export default VentasChart;