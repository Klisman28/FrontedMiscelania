import React from 'react'
import { HiPlus, HiOutlineCube, HiExclamationCircle } from 'react-icons/hi'
import { NumericFormat } from 'react-number-format'
import useProductImage from 'hooks/useProductImage'
import { getStockLevel, STOCK_LEVELS } from 'utils/stockLevel'

/**
 * Tarjeta de producto unificada para el Punto de Venta (POS) y Compras.
 * Renderiza el producto con su imagen S3/Legacy completa, precio, marca y botón de agregar.
 * Usa el cálculo centralizado de stock-level para estados visuales consistentes.
 */
const PosProductCard = ({ product, onSelect }) => {
    // Resolvemos la imagen con el hook (prioriza imageUrl -> signed imageKey)
    const imageSrc = useProductImage(product)
    const hasImage = !!imageSrc

    // Stock level calculation — centralized
    const stock = product.stock ?? 0
    const stockMin = product.stockMin ?? product.minStock ?? 0
    const { level, label } = getStockLevel(stock, stockMin)

    const isOutOfStock = level === STOCK_LEVELS.OUT_OF_STOCK
    const isLowStock = level === STOCK_LEVELS.LOW_STOCK

    let stockColor = 'text-emerald-700 bg-emerald-50 border-emerald-200'
    if (isOutOfStock) stockColor = 'text-rose-700 bg-rose-50 border-rose-200'
    else if (isLowStock) stockColor = 'text-amber-700 bg-amber-50 border-amber-200'

    // Precio a mostrar (En compras puede ser 'cost', en ventas 'price')
    const displayPrice = product.price ?? product.cost ?? 0

    return (
        <div
            className={`bg-white border rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group relative flex flex-col
                ${isOutOfStock
                    ? 'border-rose-200/80 opacity-75 hover:opacity-100'
                    : isLowStock
                        ? 'border-amber-200/80 hover:border-amber-300'
                        : 'border-slate-200/80 hover:border-indigo-200'
                }`}
            onClick={() => onSelect(product)}
        >
            {/* Stock Badge */}
            <div className="absolute top-2 right-2 z-10 pointer-events-none">
                <div className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-sm whitespace-nowrap ${stockColor}`}>
                    {isLowStock && <HiExclamationCircle className="w-3 h-3" />}
                    {isOutOfStock ? 'Agotado' : `${stock} uds`}
                </div>
            </div>

            {/* Low Stock Warning Ribbon */}
            {isLowStock && stockMin > 0 && (
                <div className="absolute top-2 left-2 z-10 pointer-events-none">
                    <div className="px-1.5 py-0.5 rounded-md text-[9px] font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                        Mín: {stockMin}
                    </div>
                </div>
            )}

            {/* Imagen — aspect-square + object-contain para ver completa */}
            <div className={`relative w-full aspect-square bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden shrink-0 flex items-center justify-center p-3 ${isOutOfStock ? 'grayscale-[60%]' : ''}`}>
                {hasImage ? (
                    <img
                        src={imageSrc}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm"
                        onError={(e) => {
                            e.target.style.display = 'none'
                            if (e.target.nextSibling) {
                                e.target.nextSibling.classList.remove('hidden')
                                e.target.nextSibling.classList.add('flex')
                            }
                        }}
                    />
                ) : null}
                <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 text-slate-300 ${hasImage ? 'hidden' : 'flex'}`}>
                    <HiOutlineCube className="text-3xl" />
                </div>

                {/* Out of stock overlay */}
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
                        <span className="text-xs font-bold text-rose-600 bg-white/80 px-3 py-1 rounded-full shadow-sm">
                            SIN STOCK
                        </span>
                    </div>
                )}
            </div>

            {/* Información del producto */}
            <div className="p-3 flex flex-col gap-1 flex-1 border-t border-slate-100">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 truncate font-semibold" title={product.brand?.name || 'GENÉRICO'}>
                    {product.brand?.name || 'GENÉRICO'}
                </div>

                <h6 className="text-[13px] font-semibold leading-[1.3] line-clamp-2 text-slate-800 min-h-[34px]" title={product.name}>
                    {product.name}
                </h6>

                <div className="flex items-center justify-between mt-auto pt-1.5">
                    <span className="text-sm font-bold text-indigo-600 tabular-nums">
                        <NumericFormat
                            displayType="text"
                            value={displayPrice}
                            thousandSeparator={true}
                            prefix={'Q'}
                            decimalScale={2}
                            fixedDecimalScale={true}
                        />
                    </span>
                    <button
                        type="button"
                        aria-label="Agregar producto"
                        className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${isOutOfStock
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-90 shadow-sm shadow-indigo-200'
                            }`}
                        disabled={isOutOfStock}
                        onClick={(e) => {
                            e.stopPropagation()
                            onSelect(product)
                        }}
                    >
                        <HiPlus className="text-sm" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PosProductCard
