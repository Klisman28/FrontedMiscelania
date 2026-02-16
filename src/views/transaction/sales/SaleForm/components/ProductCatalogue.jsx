import React, { useEffect, useState, useMemo } from 'react'
import { Card, Button, Avatar, Spinner } from 'components/ui'
import { useDispatch, useSelector } from 'react-redux'
import { getAllProducts, getSubcategories, getBrands, getCategories } from '../store/formSlice'
import { HiPlus, HiOutlineCube, HiCheck } from 'react-icons/hi'
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
                dispatch(getAllProducts()),
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
    const visibleProducts = filteredProducts.slice(0, 6)
    const remainingCount = Math.max(0, filteredProducts.length - 6)

    // Reset selection when search changes (optional, but good UX to avoid empty states)
    // User requirement: "Si el usuario escribe en el buscador, filtra dentro de la categoría seleccionada."
    // So we do NOT reset subcategory on search. Good.

    // Helper for initials
    const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : 'PR'

    return (
        <div className="mt-4 flex flex-col h-full">
            {/* 1. Subcategory Chips Bar */}
            <div className="mb-4">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide items-center">
                    {/* Chip "Todos" */}
                    <div
                        onClick={() => setSelectedSubcategoryId(null)}
                        className={classNames(
                            "cursor-pointer rounded-full px-4 py-1.5 whitespace-nowrap text-sm font-semibold transition-all duration-200 border flex items-center gap-1.5 shadow-sm select-none",
                            selectedSubcategoryId === null
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-indigo-200"
                                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-indigo-600"
                        )}
                    >
                        {selectedSubcategoryId === null && <HiCheck className="text-white text-sm" />}
                        Todos
                    </div>

                    {/* Dynamic Subcategories */}
                    {subcategories.map(sub => (
                        <div
                            key={sub.id}
                            onClick={() => setSelectedSubcategoryId(sub.id)}
                            className={classNames(
                                "cursor-pointer rounded-full px-4 py-1.5 whitespace-nowrap text-sm font-semibold transition-all duration-200 border flex items-center gap-1.5 shadow-sm select-none",
                                String(selectedSubcategoryId) === String(sub.id)
                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-indigo-200"
                                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-indigo-600"
                            )}
                        >
                            {String(selectedSubcategoryId) === String(sub.id) && <HiCheck className="text-white text-sm" />}
                            {sub.name}
                        </div>
                    ))}

                    {/* Padding for scroll */}
                    <div className="min-w-[10px]" />
                </div>
            </div>

            {/* Loading State */}
            {loading && products.length === 0 ? (
                <div className="flex justify-center items-center py-20">
                    <Spinner size="40px" />
                </div>
            ) : (
                <>
                    {/* 2. Product Grid (Max 6) */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 animate-fade-in content-start">
                        {visibleProducts.map((product) => {
                            const imageSrc = product.img || product.imageUrl
                            const hasImage = imageSrc && imageSrc !== ""

                            return (
                                <Card
                                    key={product.id}
                                    className="cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-100 group relative overflow-hidden bg-white hover:-translate-y-1 flex flex-col h-[160px]"
                                    onClick={() => onProductSelect(product)}
                                    bodyClass="p-0 h-full flex flex-col"
                                >
                                    <div className="flex h-full">
                                        <div className="relative w-[40%] bg-gray-100 overflow-hidden flex items-center justify-center">
                                            {hasImage ? (
                                                <img
                                                    src={imageSrc}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none'
                                                        if (e.target.nextSibling) {
                                                            e.target.nextSibling.classList.remove('hidden')
                                                            e.target.nextSibling.classList.add('flex')
                                                        }
                                                    }}
                                                />
                                            ) : null}

                                            <div className={`w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-300 ${hasImage ? 'hidden' : 'flex'}`}>
                                                <Avatar size={35} className="bg-indigo-100 text-indigo-600 font-bold" shape="circle">
                                                    {getInitials(product.name)}
                                                </Avatar>
                                            </div>

                                            {/* Overlay on Hover */}
                                            <div className="absolute inset-0 bg-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>

                                        <div className="w-[60%] p-2 flex flex-col justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider truncate w-full mb-0.5">
                                                    {product.brand?.name || 'Genérico'}
                                                </span>
                                                <h6 className="text-xs font-bold text-gray-800 line-clamp-3 leading-tight group-hover:text-indigo-600 transition-colors">
                                                    {product.name}
                                                </h6>
                                            </div>

                                            <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
                                                <span className="font-extrabold text-indigo-700 text-sm">
                                                    <NumericFormat
                                                        displayType="text"
                                                        value={product.price}
                                                        thousandSeparator={true}
                                                        prefix={'Q'}
                                                        decimalScale={2}
                                                        fixedDecimalScale={true}
                                                    />
                                                </span>
                                                <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                                    <HiPlus className="text-xs" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            )
                        })}

                        {/* Empty State */}
                        {visibleProducts.length === 0 && (
                            <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400">
                                <HiOutlineCube className="w-12 h-12 mb-2 opacity-20" />
                                <p className="font-medium text-gray-500">
                                    {searchTerm
                                        ? `No hay productos para "${searchTerm}" en esta categoría`
                                        : "No hay productos disponibles"}
                                </p>
                                {selectedSubcategoryId !== null && (
                                    <Button
                                        size="sm"
                                        variant="plain"
                                        className="mt-2 text-indigo-600"
                                        onClick={() => setSelectedSubcategoryId(null)}
                                    >
                                        Ver todos los productos
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 3. See More Indicator */}
                    {remainingCount > 0 && (
                        <div className="mt-4 flex justify-center">
                            <span className="text-sm text-gray-500 font-medium bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                                +{remainingCount} productos más disponibles...
                            </span>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default ProductCatalogue
