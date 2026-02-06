import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Chart from 'react-apexcharts';
import NoteFields from './notes/AddNotes';
import { apiGetSales } from '../services/transaction/SaleService';
import { Card } from 'components/ui';
import { HiCurrencyDollar, HiShoppingCart, HiTrendingUp, HiClock } from 'react-icons/hi';

const Home = () => {
  const salesData = useSelector((state) => state.auth.user);
  const [salesList, setSalesList] = useState([]);
  const [kpis, setKpis] = useState({
    todaySales: 0,
    monthSales: 0,
    productsSold: 0,
    avgTicket: 0
  });

  // Gráfico de ventas por fecha
  const [salesChart, setSalesChart] = useState({
    series: [{ name: 'Ventas', data: [] }],
    options: {
      chart: { type: 'area', height: 350, toolbar: { show: false } },
      colors: ['#4F46E5'],
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2 },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.1,
        }
      },
      xaxis: { categories: [] },
      yaxis: {
        labels: {
          formatter: function (val) {
            return 'Q ' + val.toFixed(0);
          }
        }
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return 'Q ' + val.toFixed(2);
          }
        }
      }
    }
  });

  // Gráfico de productos más vendidos
  const [topProductsChart, setTopProductsChart] = useState({
    series: [],
    options: {
      chart: { type: 'bar', height: 350, toolbar: { show: false } },
      plotOptions: {
        bar: {
          horizontal: true,
          distributed: true,
          barHeight: '70%'
        }
      },
      colors: ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981'],
      dataLabels: { enabled: false },
      xaxis: { categories: [] },
      legend: { show: false }
    }
  });

  // Gráfico de ventas por hora
  const [hourlyChart, setHourlyChart] = useState({
    series: [{ name: 'Ventas', data: [] }],
    options: {
      chart: { type: 'line', height: 300, toolbar: { show: false } },
      colors: ['#10B981'],
      stroke: { curve: 'smooth', width: 3 },
      markers: { size: 4 },
      xaxis: { categories: [] },
      yaxis: {
        labels: {
          formatter: function (val) {
            return 'Q ' + val.toFixed(0);
          }
        }
      }
    }
  });

  // Cargar ventas
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await apiGetSales();
        const sales = response.data.data.sales || [];
        setSalesList(sales);
        processData(sales);
      } catch (error) {
        console.error('Error al obtener las ventas:', error);
      }
    };

    fetchSales();
  }, []);

  const processData = (sales) => {
    if (!sales || sales.length === 0) return;

    const today = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Calcular KPIs
    const todaySales = sales
      .filter(s => s.dateIssue === today)
      .reduce((sum, s) => sum + parseFloat(s.total || 0), 0);

    const monthSales = sales
      .filter(s => {
        const saleDate = new Date(s.dateIssue);
        return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
      })
      .reduce((sum, s) => sum + parseFloat(s.total || 0), 0);

    const productsSold = sales.reduce((sum, s) => {
      return sum + (s.saleDetails?.length || 0);
    }, 0);

    const avgTicket = sales.length > 0 ? monthSales / sales.length : 0;

    setKpis({ todaySales, monthSales, productsSold, avgTicket });

    // Ventas por fecha
    const salesByDate = sales.reduce((acc, sale) => {
      const date = sale.dateIssue;
      if (!acc[date]) acc[date] = 0;
      acc[date] += parseFloat(sale.total || 0);
      return acc;
    }, {});

    const dates = Object.keys(salesByDate).sort().slice(-30); // Últimos 30 días
    const totals = dates.map(date => salesByDate[date]);

    setSalesChart(prev => ({
      ...prev,
      series: [{ name: 'Ventas', data: totals }],
      options: { ...prev.options, xaxis: { categories: dates } }
    }));

    // Top productos
    const productSales = {};
    sales.forEach(sale => {
      sale.saleDetails?.forEach(detail => {
        const name = detail.product?.name || detail.productName || 'Producto';
        if (!productSales[name]) productSales[name] = 0;
        productSales[name] += parseInt(detail.quantity || 0);
      });
    });

    const topProducts = Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    setTopProductsChart(prev => ({
      ...prev,
      series: [{ name: 'Cantidad', data: topProducts.map(p => p[1]) }],
      options: { ...prev.options, xaxis: { categories: topProducts.map(p => p[0]) } }
    }));

    // Ventas por hora
    const salesByHour = Array(24).fill(0);
    sales.forEach(sale => {
      if (sale.dateIssue === today && sale.createdAt) {
        const hour = new Date(sale.createdAt).getHours();
        salesByHour[hour] += parseFloat(sale.total || 0);
      }
    });

    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    setHourlyChart(prev => ({
      ...prev,
      series: [{ name: 'Ventas', data: salesByHour }],
      options: { ...prev.options, xaxis: { categories: hours } }
    }));
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="text-2xl text-white" />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Bienvenido, {salesData.username}</h1>
        <p className="text-sm text-gray-600">
          Estadísticas de ventas y tus notas personales
        </p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={HiCurrencyDollar}
          title="Ventas Hoy"
          value={`Q ${kpis.todaySales.toFixed(2)}`}
          color="bg-blue-500"
        />
        <StatCard
          icon={HiTrendingUp}
          title="Ventas del Mes"
          value={`Q ${kpis.monthSales.toFixed(2)}`}
          color="bg-green-500"
        />
        <StatCard
          icon={HiShoppingCart}
          title="Productos Vendidos"
          value={kpis.productsSold}
          subtitle="Este mes"
          color="bg-purple-500"
        />
        <StatCard
          icon={HiClock}
          title="Ticket Promedio"
          value={`Q ${kpis.avgTicket.toFixed(2)}`}
          color="bg-orange-500"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Gráfico de Ventas */}
        <Card className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Tendencia de Ventas (Últimos 30 días)</h2>
          <Chart
            options={salesChart.options}
            series={salesChart.series}
            type="area"
            height={350}
          />
        </Card>

        {/* Sticky Notes */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Sticky Notes</h2>
          <NoteFields />
        </Card>
      </div>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Productos */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Top 5 Productos Más Vendidos</h2>
          <Chart
            options={topProductsChart.options}
            series={topProductsChart.series}
            type="bar"
            height={350}
          />
        </Card>

        {/* Ventas por Hora */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Ventas por Hora (Hoy)</h2>
          <Chart
            options={hourlyChart.options}
            series={hourlyChart.series}
            type="line"
            height={300}
          />
        </Card>
      </div>
    </div>
  );
};

export default Home;
