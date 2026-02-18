import React from 'react'
import { Input } from 'components/ui'
import { NumericFormat } from 'react-number-format'
import { FiPackage } from 'react-icons/fi'
import { HiMinus, HiPlus, HiX } from 'react-icons/hi'
import { Controller } from 'react-hook-form'
import { toast, Notification } from 'components/ui'

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
        const value = parseFloat(event.target.value)
        if (!isNaN(value)) {
            setValue(`products.${index}.price`, value)
        }
        const qty = parseInt(getValues(`products.${index}.quantity`))
        setValue(`products.${index}.subtotal`, (value || 0) * (qty || 0))
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
                    <Notification title="¡Stock Limitado!" type="danger" duration={3000}>
                        La cantidad máxima que puede agregar es {stock}
                    </Notification>,
                    { placement: 'top-center' }
                )
            }
            const newQty = parseInt(getValues(indexQuantity))
            const price = parseFloat(getValues(`products.${index}.price`))
            setValue(`products.${index}.subtotal`, newQty * price)
        }
    }

    // ── Estado vacío ──────────────────────────────────────────
    if (!fields || fields.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 px-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                    <FiPackage className="text-slate-300 w-7 h-7" />
                </div>
                <p className="text-sm font-semibold text-slate-400 mb-1">Orden vacía</p>
                <p className="text-xs text-slate-300 text-center max-w-[180px]">
                    Busca o escanea un producto para agregarlo
                </p>
                {errors.products && (
                    <div className="mt-3 bg-red-50 text-red-500 px-3 py-1.5 rounded-lg text-xs font-semibold animate-pulse">
                        {errors.products.message}
                    </div>
                )}
            </div>
        )
    }

    // ── Lista de productos ────────────────────────────────────
    return (
        <div className="divide-y divide-slate-100">
            {fields.map((item, index) => {
                const subtotal = watch(`products.${index}.subtotal`) || 0
                const qty = watch(`products.${index}.quantity`) || 1
                const stock = getValues(`products.${index}.stock`) || 0
                const stockPct = stock > 0 ? Math.min((qty / stock) * 100, 100) : 0
                const stockLow = qty >= stock * 0.8

                return (
                    <div
                        key={item.id || index}
                        className="px-4 py-3 hover:bg-slate-50/80 transition-colors group"
                    >
                        <div className="flex items-center gap-3">

                            {/* Avatar */}
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

                            {/* Info + precio inline */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-800 truncate leading-tight">
                                    {item.name}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">
                                        {item.brand}
                                    </span>
                                    {/* Precio editable inline */}
                                    <div className="flex items-center gap-0.5">
                                        <span className="text-[10px] text-slate-400 font-mono">Q</span>
                                        <Controller
                                            control={control}
                                            name={`products.${index}.price`}
                                            render={({ field: { onChange, value } }) => (
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={value}
                                                    onChange={onChange}
                                                    onKeyUp={(e) => handleOnKeyUpPrice(e, index)}
                                                    className="w-14 h-5 text-xs text-right font-mono tabular-nums font-semibold border border-slate-200 rounded-md bg-white px-1 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400"
                                                    autoComplete="off"
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Stepper compacto unificado */}
                            <div className="flex items-center bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
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
                                    disabled={qty >= stock}
                                    className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <HiPlus className="w-3 h-3" />
                                </button>
                            </div>

                            {/* Subtotal + unidad */}
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

                            {/* Eliminar — visible en hover */}
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                            >
                                <HiX className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* Barra de stock visual */}
                        {stock > 0 && (
                            <div className="mt-2 ml-12">
                                <div className="flex items-center justify-between mb-0.5">
                                    <span className="text-[9px] text-slate-400 font-medium">
                                        Stock: {stock - qty} restantes
                                    </span>
                                    {stockLow && (
                                        <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wide">
                                            ¡Bajo stock!
                                        </span>
                                    )}
                                </div>
                                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-300 ${stockLow ? 'bg-amber-400' : 'bg-emerald-400'
                                            }`}
                                        style={{ width: `${stockPct}%` }}
                                    />
                                </div>
                            </div>
                        )}

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
