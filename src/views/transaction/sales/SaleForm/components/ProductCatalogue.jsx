import React, { useEffect, useState, useMemo } from 'react'
import { Button, Avatar, Spinner } from 'components/ui'
import { useDispatch, useSelector } from 'react-redux'
import { getStoreProducts, getSubcategories, getBrands, getCategories } from '../store/formSlice'
import { HiPlus, HiOutlineCube } from 'react-icons/hi'
import { NumericFormat } from 'react-number-format'
import classNames from 'classnames'

const ProductCatalogue = ({ onProductSelect }) => {
    const dispatch = useDispatch()

    // Select data from store securely
    const { subcategories: rawSubcategories, products: rawProducts } = useSelector(
        (state) => state.saleForm?.data?.catalogue || { subcategories: [], products: [], categories: [], brands: [] }
    )
    const searchTerm = useSelector((state) => state.saleForm?.data?.searchTerm || '')

    const [loading, setLoading] = useState(false)
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null) // null = Todos

    // Safe extraction
    const products = Array.isArray(rawProducts) ? rawProducts : []

    // Derived Subcategories Logic
    const subcategories = useMemo(() => {
        const subs = Array.isArray(rawSubcategories) ? rawSubcategories : (Array.isArray(rawSubcategories?.data) ? rawSubcategories.data : [])

        if (subs.length > 0) {
            return subs
        }

        // Fallback: Derive from products
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

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            await Promise.all([
                dispatch(getStoreProducts()),
                dispatch(getSubcategories()),
                dispatch(getCategories()),
                dispatch(getBrands())
            ])
            setLoading(false)
        }
        fetchData()
    }, [dispatch])

    // Filter Logic
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // 1. Search Term Filter
            if (searchTerm) {
                const term = searchTerm.toLowerCase()
                const nameMatch = product.name?.toLowerCase().includes(term)
                const codeMatch = product.code?.toLowerCase().includes(term)
                const skuMatch = product.sku?.toLowerCase().includes(term)
                if (!nameMatch && !codeMatch && !skuMatch) return false
            }

            // 2. Subcategory Filter
            if (selectedSubcategoryId !== null) {
                const prodSubId = product.subcategoryId || product.subcategory?.id
                if (String(prodSubId) !== String(selectedSubcategoryId)) return false
            }

            return true
        })
    }, [products, searchTerm, selectedSubcategoryId])

    // Limit to 6 items
    const visibleProducts = filteredProducts.slice(0, 8)
    const remainingCount = Math.max(0, filteredProducts.length - 8)

    // Reset selection when search changes (optional, but good UX to avoid empty states)
    // User requirement: "Si el usuario escribe en el buscador, filtra dentro de la categoría seleccionada."
    // So we do NOT reset subcategory on search. Good.

    // Helper for initials
    const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : 'PR'

    return (
        <div className="mt-2 flex flex-col h-full">
            {/* 1. Subcategory Chips Bar - Scroll horizontal con fade */}
            <div className="mb-4 relative">
                {/* Fade left */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
                {/* Fade right */}
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide items-center px-1">
                    {/* Chip "Todos" */}
                    <div
                        onClick={() => setSelectedSubcategoryId(null)}
                        className={classNames(
                            "cursor-pointer rounded-full px-6 h-8 flex items-center whitespace-nowrap text-xs font-medium transition-all border select-none shrink-0",
                            selectedSubcategoryId === null
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        )}
                    >
                        Todos
                    </div>

                    {/* Dynamic Subcategories */}
                    {subcategories.map(sub => (
                        <div style={{ fontSize: "10px" }}
                            key={sub.id}
                            onClick={() => setSelectedSubcategoryId(sub.id)}
                            className={classNames(
                                "cursor-pointer rounded-full px-2 h-9 flex items-center whitespace-nowrap  font-semibold transition-all border select-none shrink-0",
                                String(selectedSubcategoryId) === String(sub.id)
                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                            )}
                        >
                            {sub.name}
                        </div>
                    ))}

                    {/* Padding for scroll */}
                    <div className="min-w-[10px]" />
                </div>
            </div>

            {/* Loading State */}
            {
                loading && products.length === 0 ? (
                    <div className="flex justify-center items-center py-20">
                        <Spinner size="40px" />
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto pr-1 pb-4">
                        {/* 2. Product Grid - Mayor densidad visual */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 animate-fade-in content-start">
                            {visibleProducts.map((product) => {
                                const imageSrc = product.img || product.imageUrl
                                const hasImage = imageSrc && imageSrc !== ""

                                // Stock Logic (Solo visual)
                                const stock = product.stock || 0
                                const minStock = product.minStock || 5
                                let stockColor = "text-emerald-700 bg-emerald-50 border-emerald-200"
                                if (stock <= 0) stockColor = "text-rose-700 bg-rose-50 border-rose-200"
                                else if (stock <= minStock) stockColor = "text-amber-700 bg-amber-50 border-amber-200"

                                return (
                                    <div
                                        key={product.id}
                                        className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md hover:border-slate-300 transition-all group relative"
                                        onClick={() => onProductSelect(product)}
                                    >
                                        {/* Stock Badge - Top Right Absoluto */}
                                        <div className="absolute top-2 right-2 z-10">
                                            <div className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border whitespace-nowrap ${stockColor}`}>
                                                {stock} uds
                                            </div>
                                        </div>

                                        {/* Imagen/Placeholder - Altura fija h-16 */}
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

                                            {/* Fallback */}
                                            <div className={`w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-700 text-slate-300 ${hasImage ? 'hidden' : 'flex'}`}>
                                                <HiOutlineCube className="text-2xl" />
                                            </div>
                                        </div>

                                        {/* Cuerpo - Padding p-3 */}
                                        <div className="p-3 flex flex-col gap-1.5">
                                            {/* Marca - Arriba */}
                                            <div className="text-[11px] uppercase tracking-wide text-slate-500 truncate font-semibold">
                                                {product.brand?.name || 'GENÉRICO'}
                                            </div>

                                            {/* Nombre - line-clamp-2 */}
                                            <h6 className="text-sm font-semibold leading-5 line-clamp-2 text-slate-900 min-h-[40px]">
                                                {product.name}
                                            </h6>

                                            {/* Precio y botón + */}
                                            <div className="flex items-center justify-between mt-auto pt-2">
                                                <span className="text-sm font-bold text-indigo-600 tabular-nums">
                                                    <NumericFormat
                                                        displayType="text"
                                                        value={product.price}
                                                        thousandSeparator={true}
                                                        prefix={'Q'}
                                                        decimalScale={2}
                                                        fixedDecimalScale={true}
                                                    />
                                                </span>
                                                <button
                                                    type="button"
                                                    className={`h-9 w-9 rounded-full flex items-center justify-center transition-all ${stock <= 0
                                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                        : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
                                                        }`}
                                                    disabled={stock <= 0}
                                                >
                                                    <HiPlus className="text-base" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}

                            {/* Empty State - Mejorado */}
                            {visibleProducts.length === 0 && (
                                <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
                                    <div className="bg-slate-100 p-4 rounded-full mb-4">
                                        <HiOutlineCube className="w-10 h-10 text-slate-300" />
                                    </div>
                                    <p className="font-semibold text-slate-700 mb-1">
                                        No se encontraron productos en tienda
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        {searchTerm
                                            ? `Intenta con otro término de búsqueda`
                                            : selectedSubcategoryId
                                                ? `No hay productos con stock en esta categoría`
                                                : `Agrega stock a la tienda para comenzar`}
                                    </p>
                                </div>
                            )}

                            {/* 3. Card "Ver más productos" - Dashed minimal */}
                            {remainingCount > 0 && (
                                <div className="border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/50 hover:bg-slate-50 hover:border-slate-400 flex flex-col items-center justify-center gap-2 text-slate-600 cursor-pointer transition-all group min-h-[160px]">
                                    <span className="font-bold text-3xl group-hover:scale-110 transition-transform">+{remainingCount}</span>
                                    <span className="text-xs font-semibold uppercase tracking-wide">Ver más productos</span>
                                </div>
                            )}
                        </div>
                    </div>
                )
            }
        </div >
    )
}

export default ProductCatalogue
