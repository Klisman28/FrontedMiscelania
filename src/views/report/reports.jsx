import React, { useState } from 'react';
import axios from 'axios';

const SalesReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Función para manejar la solicitud al backend
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Realizamos la solicitud GET al backend con los parámetros startDate y endDate
      const response = await axios.get('http://tu-backend.com/sales/date-range', {
        params: {
          startDate,
          endDate,
        },
      });

      // Si la solicitud es exitosa, almacenamos los datos del reporte
      setReportData(response.data);
    } catch (err) {
      // En caso de error, mostramos un mensaje de error
      setError('Error al generar el reporte: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Generar Reporte de Ventas</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Fecha de inicio:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Fecha de fin:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Generando reporte...' : 'Generar Reporte'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {reportData && (
        <div>
          <h2>Reporte de Ventas</h2>
          <p>Total de ventas: ${reportData.total}</p>
          <p>Ventas encontradas: {reportData.count}</p>
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
              </tr>
            </thead>
            <tbody>
              {reportData.sales.map((sale, index) => (
                <tr key={index}>
                  <td>{sale.createdAt}</td>
                  <td>{sale.customer.fullname}</td>
                  <td>{sale.products.map((product) => product.name).join(', ')}</td>
                  <td>
                    {sale.products.map((product) => (
                      <div key={product.id}>{product.item.quantity}</div>
                    ))}
                  </td>
                  <td>
                    {sale.products.map((product) => (
                      <div key={product.id}>${product.item.unitPrice}</div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SalesReport;
