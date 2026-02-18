import React, { useEffect, useState, useMemo } from 'react'
import { Spinner } from 'components/ui'
import { useDispatch, useSelector } from 'react-redux'
import {
    getAllProducts,
    getProductsByWarehouse,
    getSubcategories,
    getBrands,
    getCategories,
} from '../store/formSlice'
import { HiPlus, HiOutlineCube, HiOutlineOfficeBuilding } from 'react-icons/hi'
import { NumericFormat } from 'react-number-format'
import classNames from 'classnames'

/**
 * ProductCatalogue — Compras
 * Muestra productos filtrados por la bodega seleccionada.
 * Si no hay bodega seleccionada, muestra un estado de "selecciona bodega".
 * Si la bodega no tiene productos, muestra estado vacío.
 */
const ProductCatalogue = ({ onProductSelect, warehouseId }) => {
    const dispatch = useDispatch()

    const { subcategories: rawSubcategories, products: rawProducts, loading } = useSelector(
        (state) => state.purchasForm?.data?.catalogue || { subcategories: [], products: [], loading: false }
    )
    const searchTerm = useSelector((state) => state.purchasForm?.data?.searchTerm || '')

    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null)

    const products = Array.isArray(rawProducts) ? rawProducts : []

    // Subcategorías derivadas de los productos actuales
    const subcategories = useMemo(() => {
        const subs = Array.isArray(rawSubcategories)
            ? rawSubcategories
            : (Array.isArray(rawSubcategories?.data) ? rawSubcategories.data : [])

        if (subs.length > 0) return subs

        // Fallback: derivar de productos
        const map = new Map()
        products.forEach(p => {
            if (p.subcategoryId) {
                if (!map.has(p.subcategoryId)) {
                    map.set(p.subcategoryId, {
                        id: p.subcategoryId,
                        name: p.subcategory?.name || 'General'
                    })
                }
            }
        })
        return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
    }, [rawSubcategories, products])

    // Cargar subcategorías, marcas y categorías una sola vez
    useEffect(() => {
        dispatch(getSubcategories())
        dispatch(getCategories())
        dispatch(getBrands())
    }, [dispatch])

    // Recargar productos cuando cambia la bodega
    useEffect(() => {
        setSelectedSubcategoryId(null) // reset filtro al cambiar bodega
        if (warehouseId) {
            dispatch(getProductsByWarehouse(warehouseId))
        } else {
            dispatch(getAllProducts())
        }
    }, [dispatch, warehouseId])

    // Filtro por búsqueda + subcategoría
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            if (searchTerm) {
                const term = searchTerm.toLowerCase()
                const nameMatch = product.name?.toLowerCase().includes(term)
                const codeMatch = product.code?.toLowerCase().includes(term)
                const skuMatch = product.sku?.toLowerCase().includes(term)
                if (!nameMatch && !codeMatch && !skuMatch) return false
            }
            if (selectedSubcategoryId !== null) {
                const prodSubId = product.subcategoryId || product.subcategory?.id
                if (String(prodSubId) !== String(selectedSubcategoryId)) return false
            }
            return true
        })
    }, [products, searchTerm, selectedSubcategoryId])

    const visibleProducts = filteredProducts.slice(0, 8)
    const remainingCount = Math.max(0, filteredProducts.length - 8)

    // ── Estado: sin bodega seleccionada ──────────────────────
    if (!warehouseId) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                    <HiOutlineOfficeBuilding className="w-8 h-8 text-indigo-300" />
                </div>
                <p className="text-sm font-bold text-slate-500 mb-1">Selecciona una bodega</p>
                <p className="text-xs text-slate-400 max-w-[220px]">
                    Elige una bodega en el panel derecho para ver los productos disponibles
                </p>
            </div>
        )
    }

    // ── Estado: cargando ──────────────────────────────────────
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <Spinner size="40px" />
                <p className="text-xs text-slate-400 mt-3">Cargando productos...</p>
            </div>
        )
    }

    return (
        <div className="mt-2 flex flex-col h-full">

            {/* Chips de subcategoría */}
            <div className="mb-4 relative">
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide items-center px-1">
                    {/* Chip "Todos" */}
                    <div
                        onClick={() => setSelectedSubcategoryId(null)}
                        className={classNames(
                            "cursor-pointer rounded-full px-5 h-8 flex items-center whitespace-nowrap text-xs font-semibold transition-all border select-none shrink-0",
                            selectedSubcategoryId === null
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        )}
                    >
                        Todos
                    </div>

                    {subcategories.map(sub => (
                        <div
                            key={sub.id}
                            onClick={() => setSelectedSubcategoryId(sub.id)}
                            className={classNames(
                                "cursor-pointer rounded-full px-3 h-8 flex items-center whitespace-nowrap text-[10px] font-semibold transition-all border select-none shrink-0",
                                String(selectedSubcategoryId) === String(sub.id)
                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                            )}
                        >
                            {sub.name}
                        </div>
                    ))}

                    <div className="min-w-[10px]" />
                </div>
            </div>

            {/* Grid de productos */}
            <div className="flex-1 overflow-y-auto pr-1 pb-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 animate-fade-in content-start">

                    {visibleProducts.map((product) => {
                        const imageSrc = product.img || product.imageUrl
                        const hasImage = imageSrc && imageSrc !== ""
                        const stock = product.stock || 0
                        const minStock = product.minStock || 5

                        let stockColor = "text-emerald-700 bg-emerald-50 border-emerald-200"
                        if (stock <= 0) stockColor = "text-rose-700 bg-rose-50 border-rose-200"
                        else if (stock <= minStock) stockColor = "text-amber-700 bg-amber-50 border-amber-200"

                        return (
                            <div
                                key={product.id}
                                className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md hover:border-indigo-200 transition-all group relative"
                                onClick={() => onProductSelect(product)}
                            >
                                {/* Badge stock */}
                                <div className="absolute top-2 right-2 z-10">
                                    <div className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border whitespace-nowrap ${stockColor}`}>
                                        {stock} uds
                                    </div>
                                </div>

                                {/* Imagen / Placeholder */}
                                <div className="relative h-16 w-full bg-slate-50 overflow-hidden shrink-0">
                                    {hasImage ? (
                                        <img
                                            src={imageSrc}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            onError={(e) => {
                                                e.target.style.display = 'none'
                                                if (e.target.nextSibling) {
                                                    e.target.nextSibling.classList.remove('hidden')
                                                    e.target.nextSibling.classList.add('flex')
                                                }
                                            }}
                                        />
                                    ) : null}
                                    <div className={`w-full h-full flex items-center justify-center bg-slate-100 text-slate-300 ${hasImage ? 'hidden' : 'flex'}`}>
                                        <HiOutlineCube className="text-2xl" />
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-3 flex flex-col gap-1.5">
                                    <div className="text-[10px] uppercase tracking-wide text-slate-500 truncate font-semibold">
                                        {product.brand?.name || 'GENÉRICO'}
                                    </div>
                                    <h6 className="text-sm font-semibold leading-5 line-clamp-2 text-slate-900 min-h-[40px]">
                                        {product.name}
                                    </h6>
                                    <div className="flex items-center justify-between mt-auto pt-2">
                                        <span className="text-sm font-bold text-indigo-600 tabular-nums">
                                            <NumericFormat
                                                displayType="text"
                                                value={product.price ?? product.cost ?? 0}
                                                thousandSeparator
                                                prefix="Q"
                                                decimalScale={2}
                                                fixedDecimalScale
                                            />
                                        </span>
                                        <button
                                            type="button"
                                            className="h-9 w-9 rounded-full flex items-center justify-center bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 transition-all"
                                        >
                                            <HiPlus className="text-base" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    {/* Estado vacío */}
                    {visibleProducts.length === 0 && (
                        <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
                            <div className="bg-slate-100 p-4 rounded-full mb-4">
                                <HiOutlineCube className="w-10 h-10 text-slate-300" />
                            </div>
                            <p className="font-semibold text-slate-600 mb-1">
                                {searchTerm ? 'Sin resultados' : 'Sin productos en esta bodega'}
                            </p>
                            <p className="text-sm text-slate-400 max-w-[220px]">
                                {searchTerm
                                    ? `No hay productos que coincidan con "${searchTerm}"`
                                    : selectedSubcategoryId
                                        ? 'No hay productos en esta categoría para la bodega seleccionada'
                                        : 'Esta bodega no tiene productos registrados'}
                            </p>
                        </div>
                    )}

                    {/* Ver más */}
                    {remainingCount > 0 && (
                        <div className="border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/50 hover:bg-slate-50 hover:border-slate-400 flex flex-col items-center justify-center gap-2 text-slate-600 cursor-pointer transition-all group min-h-[160px]">
                            <span className="font-bold text-3xl group-hover:scale-110 transition-transform">+{remainingCount}</span>
                            <span className="text-xs font-semibold uppercase tracking-wide">Ver más</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProductCatalogue
