import React, { useState, useEffect, useRef } from 'react'
import { Input, Spinner, Button } from 'components/ui'
import { HiSearch, HiPlus } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux'
import { searchProducts, resetSearchResults } from 'store/products/productsSlice'
import { CURRENCY_SYMBOL } from 'utils/currency'

const ProductSearchSelect = ({ onSelect, onCreateClick, selectedProduct }) => {
    const dispatch = useDispatch()
    const [searchTerm, setSearchTerm] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)
    const { searchResults = [], loadingSearch } = useSelector((state) => state.products || {})
    const searchTimeoutRef = useRef(null)
    const wrapperRef = useRef(null)

    useEffect(() => {
        // Click outside to close dropdown
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    useEffect(() => {
        if (searchTerm.trim().length > 0) {
            // Debounce search
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current)
            }
            searchTimeoutRef.current = setTimeout(() => {
                dispatch(searchProducts(searchTerm))
                setShowDropdown(true)
            }, 300)
        } else {
            dispatch(resetSearchResults())
            setShowDropdown(false)
        }

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current)
            }
        }
    }, [searchTerm, dispatch])

    const handleSelectProduct = (product) => {
        onSelect(product)
        setSearchTerm(product.name)
        setShowDropdown(false)
    }

    const handleCreateProduct = () => {
        setShowDropdown(false)
        onCreateClick()
    }

    return (
        <div className="relative" ref={wrapperRef}>
            <Input
                prefix={<HiSearch className="text-lg" />}
                placeholder="Buscar producto por nombre o SKU..."
                value={selectedProduct ? selectedProduct.name : searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value)
                    if (selectedProduct) {
                        onSelect(null) // Deselect if user starts typing again
                    }
                }}
                onFocus={() => {
                    if (searchTerm || searchResults?.length > 0) {
                        setShowDropdown(true)
                    }
                }}
            />

            {showDropdown && (
                <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {loadingSearch ? (
                        <div className="flex items-center justify-center p-4">
                            <Spinner size={30} />
                        </div>
                    ) : searchResults?.length > 0 ? (
                        <>
                            <div className="py-1">
                                {searchResults.map((product) => (
                                    <div
                                        key={product.id}
                                        className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={() => handleSelectProduct(product)}
                                    >
                                        <div className="font-semibold">{product.name}</div>
                                        <div className="text-xs text-gray-500">
                                            SKU: {product.sku} | Precio: {CURRENCY_SYMBOL}{product.price} | Stock: {product.stock || 0}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-600 p-2">
                                <Button
                                    size="sm"
                                    variant="plain"
                                    icon={<HiPlus />}
                                    onClick={handleCreateProduct}
                                    block
                                >
                                    Crear Nuevo Producto
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="p-4">
                            <div className="text-center text-gray-500 mb-2">
                                Sin resultados para "{searchTerm}"
                            </div>
                            <Button
                                size="sm"
                                variant="solid"
                                icon={<HiPlus />}
                                onClick={handleCreateProduct}
                                block
                            >
                                Crear Producto
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default ProductSearchSelect
