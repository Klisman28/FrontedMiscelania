import React from 'react'
import { Avatar, Input } from 'components/ui'
import { NumericFormat } from 'react-number-format'
import { FiPackage } from 'react-icons/fi'
import { HiMinus, HiPlus, HiX } from 'react-icons/hi'
import { Controller } from 'react-hook-form'

const OrderProducts = ({ errors, fields, remove, control, watch, handleChangeQuantity, setValue, getValues }) => {

	const handleOnKeyUp = (event, index) => {
		const indexText = `products.${index}.quantity`
		const value = parseInt(event.target.value)
		if (!isNaN(value) && value > 0) {
			setValue(indexText, value)
			const cost = parseFloat(getValues(`products.${index}.cost`))
			setValue(`products.${index}.subtotal`, value * cost)
		}
	}

	if (!fields || fields.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-10 px-4">
				<div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
					<FiPackage className="text-slate-300 w-7 h-7" />
				</div>
				<p className="text-sm font-semibold text-slate-400 mb-1">Sin productos</p>
				<p className="text-xs text-slate-300 text-center">
					Busca o escanea un producto para agregarlo
				</p>
				{errors.products && (
					<div className="mt-3 bg-red-50 text-red-500 px-3 py-1.5 rounded-lg text-xs font-semibold">
						{errors.products.message}
					</div>
				)}
			</div>
		)
	}

	return (
		<div className="divide-y divide-slate-100">
			{fields.map((item, index) => {
				const subtotal = watch(`products.${index}.subtotal`) || 0
				const qty = watch(`products.${index}.quantity`) || 1

				return (
					<div key={item.id || index} className="px-4 py-3 hover:bg-slate-50/80 transition-colors group">
						<div className="flex items-center gap-3">

							{/* Avatar del producto */}
							<div className="flex-shrink-0">
								{item.img
									? <img src={item.img} alt={item.name} className="w-9 h-9 rounded-xl object-cover" />
									: (
										<div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
											<FiPackage className="text-indigo-400 w-4 h-4" />
										</div>
									)
								}
							</div>

							{/* Info del producto */}
							<div className="flex-1 min-w-0">
								<p className="text-sm font-semibold text-slate-800 truncate leading-tight">
									{item.name}
								</p>
								<div className="flex items-center gap-2 mt-0.5">
									<span className="text-[10px] font-bold uppercase tracking-wide text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">
										{item.brand}
									</span>
									{/* Costo editable inline */}
									<div className="flex items-center gap-1">
										<span className="text-[10px] text-slate-400 font-mono">Q</span>
										<Controller
											control={control}
											name={`products.${index}.cost`}
											render={({ field: { onChange, value } }) => (
												<NumericFormat
													thousandSeparator
													decimalScale={2}
													customInput={Input}
													onValueChange={({ floatValue }) => {
														onChange(floatValue)
														const q = parseInt(getValues(`products.${index}.quantity`), 10) || 0
														setValue(`products.${index}.subtotal`, q * (floatValue || 0))
													}}
													value={value}
													size="sm"
													className="!w-16 !h-6 !text-xs !px-1 !py-0 text-right font-mono tabular-nums border-slate-200 rounded-md bg-white focus:ring-1 focus:ring-indigo-400"
													autoComplete="off"
												/>
											)}
										/>
									</div>
								</div>
							</div>

							{/* Stepper compacto */}
							<div className="flex items-center gap-0 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
								<button
									type="button"
									onClick={() => handleChangeQuantity(index, false)}
									disabled={qty <= 1}
									className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
								>
									<HiMinus className="w-3 h-3" />
								</button>

								<Controller
									control={control}
									name={`products.${index}.quantity`}
									render={({ field: { onChange, value } }) => (
										<input
											type="text"
											value={value}
											onChange={onChange}
											onKeyUp={(e) => handleOnKeyUp(e, index)}
											className="w-8 h-7 text-center text-sm font-bold text-slate-800 bg-white border-x border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-400 tabular-nums"
											autoComplete="off"
										/>
									)}
								/>

								<button
									type="button"
									onClick={() => handleChangeQuantity(index, true)}
									className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
								>
									<HiPlus className="w-3 h-3" />
								</button>
							</div>

							{/* Subtotal */}
							<div className="text-right flex-shrink-0 w-16">
								<span className="text-sm font-bold text-slate-800 tabular-nums font-mono">
									<NumericFormat
										displayType="text"
										value={(Math.round(subtotal * 100) / 100).toFixed(2)}
										prefix="Q "
										thousandSeparator
									/>
								</span>
								<p className="text-[10px] text-slate-400">{item.unit}</p>
							</div>

							{/* Botón eliminar — visible en hover */}
							<button
								type="button"
								onClick={() => remove(index)}
								className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
							>
								<HiX className="w-3.5 h-3.5" />
							</button>
						</div>

						{/* Error de cantidad */}
						{errors.products && Array.isArray(errors.products) && errors.products[index]?.quantity && (
							<p className="text-red-500 text-[10px] mt-1 ml-12">
								{errors.products[index].quantity.type === 'typeError'
									? 'Ingresar un número válido'
									: errors.products[index].quantity.message}
							</p>
						)}
					</div>
				)
			})}
		</div>
	)
}

export default OrderProducts