import React from 'react'
import { Card } from 'components/ui'
import { NumericFormat } from 'react-number-format'

const PaymentInfo = ({label, value, isLast}) => {
	return (
		<li className={`flex items-center justify-between${!isLast ? ' mb-3' : ''}`}>
			<span>{label}</span>
			<span className="font-semibold">
				<NumericFormat
					displayType="text"
					value={(Math.round(value * 100) / 100).toFixed(2)} 
					prefix={'Q/'} 
					thousandSeparator={true} 
				/>
			</span>
		</li>
	)
}

const PaymentSummary = ({data}) => {
	return (
		<Card className="mb-4">
			<h5 className="mb-4">Resumen de Pago</h5>
			<ul>
				<PaymentInfo label="Subtotal" value={data.subtotal} />
				<PaymentInfo label="IGV(18%)" value={data.igv} />
				<hr className="mb-3" />
				<PaymentInfo label="Total" value={data.total} isLast />
			</ul>
		</Card>
	)
}

export default PaymentSummary