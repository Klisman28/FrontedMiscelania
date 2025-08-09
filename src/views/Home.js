import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Chart from 'react-apexcharts';
import NoteFields from './notes/AddNotes'
import { apiGetSales } from '../services/transaction/SaleService';

const Home = () => {
  const salesData = useSelector((state) => state.auth.user);
  console.log('Datos user',salesData);
  
  const [salesList, setSalesList] = useState([]);

  // Estado para configurar los datos del gráfico
  const [chartData, setChartData] = useState({
    series: [{ name: 'Ventas', data: [] }],
    options: {
      chart: { height: 350, type: 'bar' },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      xaxis: { categories: [] },
      title: {
        text: '', // Se setea dinámicamente en el useEffect
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return 'Q ' + val;
        },
      },
      colors: ['#D3D3D3'],
    },
  });

  // Cargar ventas al montar el componente
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await apiGetSales();
        setSalesList(response.data.data.sales);
      } catch (error) {
        console.error('Error al obtener las ventas:', error);
      }
    };

    fetchSales();
  }, []);

  // Actualizar datos del gráfico cuando cambia salesList
  useEffect(() => {
    if (salesList.length > 0) {
      // Agrupar ventas por fecha
      const ventasPorFecha = salesList.reduce((acumulador, venta) => {
        const totalVenta = parseFloat(venta.total || '0');
        const fecha = venta.dateIssue;
        if (!acumulador[fecha]) {
          acumulador[fecha] = 0;
        }
        acumulador[fecha] += totalVenta;
        return acumulador;
      }, {});

      // Obtener las fechas ordenadas y los totales correspondientes
      const fechas = Object.keys(ventasPorFecha).sort();
      const totales = fechas.map((fecha) => ventasPorFecha[fecha]);

      // Actualizar el estado del gráfico
      setChartData({
        series: [{ name: 'Ventas', data: totales }],
        options: {
          ...chartData.options,
          xaxis: { categories: fechas },
          title: {
            text: `Ventas en el tiempo - ${salesData.username} (${salesData.owner})`,
          },
        },
      });
    }
  }, [salesList, salesData.username, salesData.owner]);

  return (
    <div className="container mx-auto p-4">
      {/* Encabezado */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Bienvenido, {salesData.username}</h1>
        <p className="text-sm text-gray-600">
          Estadísticas de ventas y tus notas personales
        </p>
      </header>

      {/* Contenedor principal con dos columnas en escritorio y en pila en móvil */}
      <div className="flex flex-col-reverse md:flex-row gap-6">
        {/* Panel de Sticky Notes */}
        <section className="md:w-1/3">
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-xl font-semibold mb-4">Sticky Notes</h2>
            <NoteFields />
          </div>
        </section>

        {/* Panel de Gráficas */}
        <section className="md:w-1/3">
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-xl font-semibold mb-4">Gráfico de Ventas</h2>
            <Chart
              options={chartData.options}
              series={chartData.series}
              type="bar"
              height={350}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
