import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Input, Spinner, Button, toast, Notification } from 'components/ui'
import { HiSearch, HiX } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux'
import { searchProducts, setSearchTerm as setGlobalSearchTerm } from '../store/formSlice'

/**
 * ProductQuickAddBar
 * 
 * Barra de búsqueda/escaneo rápido para agregar productos al carrito
 * tipo POS, sin modal.
 * 
 * Features:
 * - Búsqueda con debounce (300ms) cuando el usuario escribe
 * - Búsqueda inmediata cuando se presiona Enter (escaneo)
 * - Dropdown navegable con teclado (↑↓)
 * - Auto-incremento de cantidad si el producto ya está en el carrito
 * - Caché de búsquedas en memoria
 * - Foco automático (F2)
 */
const ProductQuickAddBar = ({
    handleAppendProduct,
    currentProducts = [],
    warehouseId = null,
    autoFocus = false
}) => {
    const dispatch = useDispatch()
    const inputRef = useRef(null)
    const dropdownRef = useRef(null)
    const searchTimeoutRef = useRef(null)
    const searchCacheRef = useRef(new Map()) // Caché en memoria

    const [searchTerm, setSearchTerm] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const [isSearching, setIsSearching] = useState(false)

    const productList = useSelector((state) => state.saleForm.data.productList)


    // Sync local search term to Redux for global filtering (e.g. in ProductCatalogue)
    useEffect(() => {
        dispatch(setGlobalSearchTerm(searchTerm))
    }, [searchTerm, dispatch])

    // Auto-focus al montar (si está activado)
    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus()
        }
    }, [autoFocus])

    // Detectar click fuera para cerrar dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false)
                setSelectedIndex(-1)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Atajo F2 para focus
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'F2') {
                e.preventDefault()
                inputRef.current?.focus()
                inputRef.current?.select()
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [])

    // Función para buscar productos
    const performSearch = useCallback(async (term, isEnterKey = false) => {
        if (!term || term.trim().length === 0) {
            setShowDropdown(false)
            return
        }

        // Revisar caché primero
        const cached = searchCacheRef.current.get(term.toLowerCase())
        if (cached && !isEnterKey) {
            setShowDropdown(true)
            return
        }

        setIsSearching(true)
        try {
            const result = await dispatch(searchProducts({ search: term }))
            const products = result.payload?.data || []

            // Guardar en caché
            searchCacheRef.current.set(term.toLowerCase(), true)

            // Si es un escaneo (Enter) y hay coincidencia exacta, agregar directamente
            if (isEnterKey && products.length > 0) {
                const exactMatch = products.find(p =>
                    p.sku?.toLowerCase() === term.toLowerCase() ||
                    p.code?.toLowerCase() === term.toLowerCase() ||
                    p.id?.toString() === term
                )

                if (exactMatch) {
                    // Coincidencia exacta - agregar directamente
                    handleAddProduct(exactMatch)
                    return
                } else if (products.length === 1) {
                    // Solo un resultado - agregar directamente
                    handleAddProduct(products[0])
                    return
                }
            }

            setShowDropdown(true)
        } catch (error) {
            console.error('Error searching products:', error)
            toast.push(
                <Notification title="Error" type="danger">
                    Error al buscar productos
                </Notification>,
                { placement: 'top-center', duration: 3000 }
            )
        } finally {
            setIsSearching(false)
        }
    }, [dispatch])

    // Manejo del cambio de input (con debounce)
    const handleInputChange = (e) => {
        const value = e.target.value
        setSearchTerm(value)
        setSelectedIndex(-1)

        // Limpiar timeout anterior
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }

        // Debounce de 300ms para tipeo normal
        searchTimeoutRef.current = setTimeout(() => {
            performSearch(value)
        }, 300)
    }

    // Manejo de teclas
    const handleKeyDown = (e) => {
        // Enter: buscar inmediatamente o agregar producto seleccionado
        if (e.key === 'Enter') {
            e.preventDefault()

            if (showDropdown && productList.length > 0) {
                // Si hay dropdown visible, agregar el producto seleccionado
                const index = selectedIndex >= 0 ? selectedIndex : 0
                handleAddProduct(productList[index])
            } else {
                // Buscar inmediatamente (escaneo) con flag isEnterKey=true
                if (searchTimeoutRef.current) {
                    clearTimeout(searchTimeoutRef.current)
                }
                performSearch(searchTerm, true) // <-- IMPORTANTE: true indica escaneo
            }
            return
        }

        // Escape: cerrar dropdown y limpiar
        if (e.key === 'Escape') {
            e.preventDefault()
            setShowDropdown(false)
            setSearchTerm('')
            setSelectedIndex(-1)
            return
        }

        // Navegación con flechas
        if (!showDropdown || productList.length === 0) return

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setSelectedIndex(prev =>
                prev < productList.length - 1 ? prev + 1 : prev
            )
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        }
    }

    // Agregar producto al carrito
    const handleAddProduct = (product) => {
        if (!product) return

        // Verificar stock
        if (product.stock <= 0) {
            toast.push(
                <Notification title="Stock Agotado" type="warning">
                    {product.name} no tiene stock disponible
                </Notification>,
                { placement: 'top-center', duration: 3000 }
            )
            return
        }

        // Verificar si ya está en el carrito
        const existingProduct = currentProducts.find(p => p.productId === product.id)

        if (existingProduct) {
            // Mostrar notificación de incremento
            toast.push(
                <Notification title="Producto agregado" type="success">
                    +1 agregado: {product.name}
                </Notification>,
                { placement: 'bottom-end', duration: 2000 }
            )
        }

        // Llamar al handler (que maneja incremento o adición)
        handleAppendProduct(product)

        // Limpiar búsqueda
        setSearchTerm('')
        setShowDropdown(false)
        setSelectedIndex(-1)
        inputRef.current?.focus()
    }

    // Agregar producto al hacer click
    const handleClickProduct = (product) => {
        handleAddProduct(product)
    }

    // Limpiar búsqueda
    const handleClear = () => {
        setSearchTerm('')
        setShowDropdown(false)
        setSelectedIndex(-1)
        inputRef.current?.focus()
    }

    // Scroll automático al elemento seleccionado
    useEffect(() => {
        if (selectedIndex >= 0 && dropdownRef.current) {
            const selectedElement = dropdownRef.current.querySelector(`[data-index="${selectedIndex}"]`)
            selectedElement?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
        }
    }, [selectedIndex])

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {/* Input de búsqueda/escaneo - POS Search */}
            <div className="relative">
                {/* Icono lupa a la izquierda (absolute) */}
                <div className="absolute mx-2 left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                    <HiSearch className="text-xl text-slate-400" />
                </div>

                <input
                    ref={inputRef}
                    type="text"
                    placeholder="        Escanear o buscar por nombre / SKU / código (Enter o F2)"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                    className="relative w-full h-12 rounded-2xl border border-slate-300 bg-white pl-12 pr-4 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all outline-none"
                />


                {/* Indicador de carga */}
                {isSearching && (
                    <div className="absolute right-24 top-1/2 -translate-y-1/2">
                        <Spinner size={18} />
                    </div>
                )}

                {/* Botón clear (cuando hay texto) */}
                {searchTerm && (
                    <button
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-red-500 transition-colors bg-slate-100 hover:bg-red-50 rounded-full p-1.5"
                        type="button"
                    >
                        <HiX className="text-base" />
                    </button>
                )}
            </div>

            {/* Dropdown de resultados */}
            {showDropdown && productList.length > 0 && (
                <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg max-h-80 overflow-y-auto">
                    <div className="py-1">
                        {productList.map((product, index) => (
                            <div
                                key={product.id}
                                data-index={index}
                                className={`px-4 py-3 cursor-pointer transition-colors ${index === selectedIndex
                                    ? 'bg-indigo-50 dark:bg-indigo-900/30'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                onClick={() => handleClickProduct(product)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                                            {product.name}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            SKU: {product.sku || product.code || 'N/A'}
                                            {product.brand?.name && ` | ${product.brand.name}`}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 ml-4">
                                        <div className="text-right">
                                            <div className="font-medium text-gray-900 dark:text-gray-100">
                                                Q {parseFloat(product.price).toFixed(2)}
                                            </div>
                                            <div className={`text-xs ${product.stock > 10
                                                ? 'text-green-600 dark:text-green-400'
                                                : product.stock > 0
                                                    ? 'text-yellow-600 dark:text-yellow-400'
                                                    : 'text-red-600 dark:text-red-400'
                                                }`}>
                                                Stock: {product.stock}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer con ayuda de teclado */}
                    <div className="border-t border-gray-200 dark:border-gray-600 px-4 py-2 bg-gray-50 dark:bg-gray-700/50">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">↑↓</kbd> navegar
                            <span className="mx-1">•</span>
                            <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">Enter</kbd> agregar
                            <span className="mx-1">•</span>
                            <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">Esc</kbd> cerrar
                        </p>
                    </div>
                </div>
            )}

            {/* Sin resultados */}
            {showDropdown && !isSearching && productList.length === 0 && searchTerm && (
                <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg p-4">
                    <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
                        Sin resultados para "{searchTerm}"
                    </p>
                </div>
            )}
        </div>
    )
}

export default ProductQuickAddBar
