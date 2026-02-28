import React from 'react'
import { Card } from 'components/ui'
import { formatGTQ } from 'utils/money'

const PaymentInfo = ({ label, value, isLast }) => {
	return (
		<li className={`flex items-center justify-between${!isLast ? ' mb-3' : ''}`}>
			<span>{label}</span>
			<span className="font-semibold">
				{formatGTQ(value)}
			</span>
		</li>
	)
}

const PaymentSummary = ({ data }) => {
	return (
		<Card className="mb-4">
			<h5 className="mb-4">Resumen de Pago</h5>
			<ul>
				<PaymentInfo label="Subtotal" value={data.subtotal} />
				<PaymentInfo label="SAT 5%" value={data.igv} />
				<hr className="mb-3" />
				<PaymentInfo label="Total" value={data.total} isLast />
			</ul>
		</Card>
	)
}

export default PaymentSummary