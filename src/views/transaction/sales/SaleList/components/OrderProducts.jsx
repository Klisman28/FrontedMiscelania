import React from 'react'
import { AdaptableCard } from 'components/shared'
import { Table, Avatar, Card } from 'components/ui'
import { NumericFormat } from 'react-number-format'
import { FiPackage } from 'react-icons/fi'

const { Tr, Th, Td, THead, TBody } = Table

const MainColumn = ({ row }) => {

	const avatar = row.img ? <Avatar src={row.img} /> : <Avatar icon={<FiPackage />} />

	return (
		<div className="flex items-center">
			{avatar}
			<div className="ltr:ml-2 rtl:mr-2">
				<span className="text-black font-semibold">{row.name}</span>
				<div className="flex text-xs">
					<span className="capitalize">Marca: </span>
					<span className="font-semibold">
						{/* {row.brand} */}
					</span>
				</div>
			</div>
		</div>
	)
}

const PriceAmount = ({ amount }) => {
	return (
		<NumericFormat
			displayType="text"
			value={(Math.round(amount * 100) / 100).toFixed(2)}
			prefix={'S/'}
			thousandSeparator={true}
		/>
	)
}

const OrderProducts = ({ data }) => {

	return (
		<Card>
			<AdaptableCard className="mb-2">
				<Table>
					<THead className="!bg-transparent">
						<Tr>
							<Th>
								PRODUCTO
							</Th>
							<Th>
								PRECIO
							</Th>
							<Th>
								CANTIDAD
							</Th>
							<Th>
								IMPORTE
							</Th>
						</Tr>
					</THead>
					<TBody >
						<>
							{data && data.length > 0 ? data.map((product, index) => {

								return (
									<Tr key={index}>
										<Td>
											<MainColumn row={product} />
										</Td>
										<Td>
											<PriceAmount amount={product.item.unitPrice} />
										</Td>
										<Td>
											{product.item.quantity} {product.unit?.symbol}
										</Td>
										<Td>
											<PriceAmount amount={(product.item.unitPrice * product.item.quantity)} />
										</Td>
									</Tr>
								)
							})
								:
								<Tr>
									<Td className="text-center" colSpan="4">
										¡No Existe Detalle!
									</Td>
								</Tr>
							}
						</>
					</TBody>
				</Table>
			</AdaptableCard>
		</Card>

	)
}

export default OrderProducts