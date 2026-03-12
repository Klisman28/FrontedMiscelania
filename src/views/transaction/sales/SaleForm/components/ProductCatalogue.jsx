import React, { useEffect, useState, useMemo } from 'react'
import { Spinner } from 'components/ui'
import { useDispatch, useSelector } from 'react-redux'
import { getStoreProducts, getSubcategories, getBrands, getCategories } from '../store/formSlice'
import { HiOutlineCube } from 'react-icons/hi'
import classNames from 'classnames'
import PosProductCard from 'components/shared/PosProductCard'
import PosProductSkeleton from 'components/shared/PosProductSkeleton'

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

    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm)

    // Debounce the searchTerm from Redux before querying the backend
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
        }, 300)
        return () => clearTimeout(handler)
    }, [searchTerm])

    // Fetch master catalogs on mount
    useEffect(() => {
        dispatch(getSubcategories())
        dispatch(getCategories())
        dispatch(getBrands())
    }, [dispatch])

    // Fetch paginated products from server when filters change
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            await dispatch(getStoreProducts({
                search: debouncedSearchTerm,
                subcategoryId: selectedSubcategoryId,
                pageSize: 50 // Traemos suficientes para mostrar en la grilla y permitir 'Ver Más'
            }))
            setLoading(false)
        }
        fetchProducts()
    }, [dispatch, debouncedSearchTerm, selectedSubcategoryId])

    // The visible products are now driven by the server's response
    // We limit display to a certain number and show remaining
    const visibleProducts = products.slice(0, 8)

    // Para no romper la UI, calculamos si hay más productos según el total del paginador
    // Como el endpoint devuelve 50 items pero mostramos 8, podemos decir que hay más
    const remainingCount = Math.max(0, products.length - 8)

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

            {/* Loading State - Skeletons en lugar de Spinner */}
            {
                loading && products.length === 0 ? (
                    <div className="flex-1 overflow-y-hidden pr-1 pb-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 content-start">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <PosProductSkeleton key={i} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto pr-1 pb-4">
                        {/* 2. Product Grid - Mayor densidad visual */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 animate-fade-in content-start">
                            {visibleProducts.map((product) => (
                                <PosProductCard
                                    key={product.id}
                                    product={product}
                                    onSelect={onProductSelect}
                                />
                            ))}

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
