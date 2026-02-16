import React from 'react'
import { AdaptableCard } from 'components/shared'
import { Table, Avatar, Button, Input } from 'components/ui'
import { NumericFormat } from 'react-number-format'
import { FiPackage } from 'react-icons/fi'
import { HiMinusCircle, HiPlusCircle, HiTrash, HiOutlineArchive } from 'react-icons/hi'
import { Controller } from 'react-hook-form'
import { toast, Notification } from 'components/ui'
import './store/OrderProducts.css';


const { Tr, Th, Td, THead, TBody } = Table

const MainColumn = ({ row }) => {
	const avatar = row.img ? <Avatar src={row.img} size="md" className="mr-2" /> : <Avatar icon={<FiPackage />} size="md" className="mr-2 bg-indigo-100 text-indigo-600" />

	return (
		<div className="flex items-center">
			{avatar}
			<div className="ltr:ml-2 rtl:mr-2">
				<div className="text-gray-900 dark:text-gray-100 font-bold text-sm leading-tight mb-1">{row.name}</div>
				<div className="flex text-xs text-gray-500 items-center gap-1">
					<span className="capitalize bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide">
						{row.brand}
					</span>
				</div>
			</div>
		</div>
	)
}

const PriceAmount = ({ amount }) => {
	return (
		<div className="font-mono font-bold text-gray-900 dark:text-gray-100">
			<NumericFormat
				displayType="text"
				value={(Math.round(amount * 100) / 100).toFixed(2)}
				prefix={'Q '}
				thousandSeparator={true}
			/>
		</div>
	)
}

const OrderProducts = ({
	errors,
	fields,
	remove,
	control,
	watch,
	handleChangeQuantity,
	setValue,
	getValues
}) => {

	const handleOnKeyUpPrice = (event, index) => {
		const indexPrice = `products.${index}.price`
		const value = parseFloat(event.target.value)
		if (!isNaN(value)) {
			setValue(indexPrice, value)
		}

		const qty = parseInt(getValues(`products.${index}.quantity`))
		const subtotal = (value || 0) * (qty || 0)
		setValue(`products.${index}.subtotal`, subtotal)
	}

	const handleOnKeyUp = (event, index) => {
		const stock = getValues(`products.${index}.stock`)
		const indexQuantity = `products.${index}.quantity`
		const value = parseInt(event.target.value)

		if (!isNaN(value)) {
			if (value <= stock) {
				setValue(indexQuantity, value)
			} else {
				setValue(indexQuantity, stock)
				toast.push(
					<Notification title={"¡Stock Limitado!"} type="danger" duration={3000}>
						La cantidad máxima que puede agregar es {stock}
					</Notification>,
					{ placement: 'top-center' }
				)
			}
			const newQty = parseInt(getValues(indexQuantity))
			const price = parseFloat(getValues(`products.${index}.price`))
			const subtotal = newQty * price
			setValue(`products.${index}.subtotal`, subtotal)
		}
	}

	return (
		<>
			{fields && fields.length > 0 ? (
				<Table>
					<THead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
						<Tr>
							<Th className="uppercase tracking-wider text-xs font-bold text-gray-500 py-3">Producto</Th>
							<Th className="uppercase tracking-wider text-xs font-bold text-gray-500 py-3 text-center">Precio</Th>
							<Th className="uppercase tracking-wider text-xs font-bold text-gray-500 py-3 text-center w-[140px]">Cantidad</Th>
							<Th className="uppercase tracking-wider text-xs font-bold text-gray-500 py-3 text-right">Subtotal</Th>
							<Th className="w-10"></Th>
						</Tr>
					</THead>
					<TBody>
						{fields.map((item, index) => (
							<Tr key={index} className="hover:bg-indigo-50/30 transition-colors duration-150">
								<Td className="py-2">
									<MainColumn row={item} />
								</Td>

								{/* Editable Price */}
								<Td className="py-2 text-center">
									<div className="relative inline-block w-24">
										<span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 font-mono text-xs">Q</span>
										<Controller
											control={control}
											name={`products.${index}.price`}
											render={({ field: { onChange, value } }) => (
												<Input
													type="number"
													step="0.01"
													size="sm"
													value={value}
													onChange={onChange}
													onKeyUp={(event) => handleOnKeyUpPrice(event, index)}
													className="pl-6 text-center font-mono font-medium focus:ring-indigo-500 focus:border-indigo-500 border-gray-200 bg-white"
													autoComplete="off"
												/>
											)}
										/>
									</div>
									{errors.products && errors.products[index]?.price && (
										<div className="text-red-500 text-[10px] mt-1">
											{errors.products[index].price.message}
										</div>
									)}
								</Td>

								{/* Quantity Control */}
								<Td className="py-2">
									<div className="flex items-center justify-center bg-gray-100 rounded-lg p-1 w-fit mx-auto">
										<button
											type="button"
											className="text-gray-500 hover:text-red-500 hover:bg-white rounded shadow-sm transition-all p-1"
											onClick={() => handleChangeQuantity(index, false)}
										>
											<HiMinusCircle className='w-5 h-5' />
										</button>
										<Controller
											control={control}
											name={`products.${index}.quantity`}
											render={({ field: { onChange, value } }) => (
												<Input
													onChange={onChange}
													value={value}
													type="text"
													size="sm"
													className="w-12 text-center border-none bg-transparent font-bold focus:ring-0 p-0 h-auto"
													autoComplete="off"
													onKeyUp={(event) => handleOnKeyUp(event, index)}
												/>
											)}
										/>
										<button
											type="button"
											className="text-gray-500 hover:text-emerald-500 hover:bg-white rounded shadow-sm transition-all p-1"
											onClick={() => handleChangeQuantity(index, true)}
										>
											<HiPlusCircle className='w-5 h-5' />
										</button>
									</div>
									<div className="text-center text-[10px] text-gray-400 mt-1">{item.unit}</div>
								</Td>

								<Td className="py-2 text-right">
									<PriceAmount amount={watch(`products.${index}.subtotal`)} />
								</Td>

								<Td className="py-2 text-center">
									<Button
										shape="circle"
										size="xs"
										variant="plain"
										className="text-gray-400 hover:text-red-500 hover:bg-red-50"
										icon={<HiTrash className="text-lg" />}
										onClick={() => remove(index)}
									/>
								</Td>
							</Tr>
						))}
					</TBody>
				</Table>
			) : (
				<div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
					<div className="bg-white p-4 rounded-full shadow-sm mb-3">
						<HiOutlineArchive className="text-gray-300 w-8 h-8" />
					</div>
					<h6 className="text-gray-500 font-medium mb-1">La orden está vacía</h6>
					<p className="text-gray-400 text-sm text-center max-w-[250px]">
						Escanea un producto o búscalo para agregarlo a la lista.
					</p>
					{errors.products && (
						<div className="mt-3 bg-red-50 text-red-600 px-3 py-1 rounded text-xs font-semibold animate-pulse">
							{errors.products.message}
						</div>
					)}
				</div>
			)}
		</>
	)
}

export default OrderProducts
