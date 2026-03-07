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
import { HiOutlineCube, HiOutlineOfficeBuilding } from 'react-icons/hi'
import classNames from 'classnames'
import PosProductCard from 'components/shared/PosProductCard'
import PosProductSkeleton from 'components/shared/PosProductSkeleton'

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

    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm)

    // Debounce the searchTerm from Redux before querying the backend
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
        }, 300)
        return () => clearTimeout(handler)
    }, [searchTerm])

    // Cargar subcategorías, marcas y categorías una sola vez
    useEffect(() => {
        dispatch(getSubcategories())
        dispatch(getCategories())
        dispatch(getBrands())
    }, [dispatch])

    // Recargar productos cuando cambia la bodega o los filtros
    useEffect(() => {
        if (warehouseId) {
            dispatch(getProductsByWarehouse({
                warehouseId,
                params: {
                    search: debouncedSearchTerm,
                    subcategoryId: selectedSubcategoryId,
                    pageSize: 50 // Traemos suficientes para la grilla y el contador
                }
            }))
        } else {
            // Nota: El getAllProducts podría también beneficiarse de paginación
            // pero si no hay bodega, la pantalla pide seleccionar una bodega
        }
    }, [dispatch, warehouseId, debouncedSearchTerm, selectedSubcategoryId])

    // Filter Logic removed from client-side
    // The visible products are now driven by the server's response
    // We limit display to a certain number and show remaining
    const visibleProducts = products.slice(0, 8)
    const remainingCount = Math.max(0, products.length - 8)

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
    if (loading && products.length === 0) {
        return (
            <div className="flex-1 overflow-y-hidden pt-4 px-1 pb-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 content-start">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <PosProductSkeleton key={i} />
                    ))}
                </div>
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

                    {visibleProducts.map((product) => (
                        <PosProductCard
                            key={product.id}
                            product={product}
                            onSelect={onProductSelect}
                        />
                    ))}

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
