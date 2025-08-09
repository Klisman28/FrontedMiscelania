// ReceiptPrintView.jsx
import React, { forwardRef } from 'react'

const ReceiptPrintView = forwardRef(({ data }, ref) => {
  // data podría ser la info de la boleta: número, fecha, cliente, productos, etc.
  return (
    <div ref={ref} style={{ width: '80mm', fontFamily: 'Courier New', fontSize: '12px' }}>
      <h4 className="text-center">CIANITA PUNTO DE VENTA</h4>
      <p>SOFTWARE DE FACTURACIÓN Y CONTROL DE INVENTARIO</p>
      <p>NIT 100242111 TEL: 33380106</p>
      <p>FRONTERA LA MESILLA</p>

      <div className="flex justify-between">
        <span>FACTURA {data?.comprobante}</span>
        <span>FECHA {data?.fecha}</span>
      </div>

      {/* Más datos, como el cliente */}
      <p>CLIENTE: {data?.clienteNombre}</p>
      <p>NIT: {data?.clienteRtn}</p>

      {/* Listado de productos */}
      <div>
        {data?.productos?.map((prod, i) => (
          <div key={i}>
            <span>{prod.cantidad} x {prod.precio} {prod.descripcion}</span>
            <span>TOTAL {prod.total}</span>
          </div>
        ))}
      </div>
      
      <p>SUBTOTAL: {data?.subtotal}</p>
      <p>TOTAL A PAGAR: {data?.total}</p>

      {/* Etc. */}
      <hr />
      <h4 className="text-center">GRACIAS POR SU COMPRA </h4>
    </div>
  )
})

export default ReceiptPrintView
