import React, { useState, useRef, useEffect } from 'react'
import classNames from 'classnames'
import { Dialog, Button, Badge, Tag } from 'components/ui'
import { searchProducts } from '../store/formSlice'
import useThemeClass from 'utils/hooks/useThemeClass'
import debounce from 'lodash/debounce'
import { HiOutlineSearch, HiShoppingCart } from 'react-icons/hi'
import Highlighter from 'react-highlight-words'
import { useDispatch, useSelector } from 'react-redux'
import { FiAlertTriangle } from 'react-icons/fi'
import { toast, Notification } from 'components/ui'

export const SearchProducts = ({ handleAppendProduct, children }) => {

    const [searchDialogOpen, setSearchDialogOpen] = useState(false)
    const [productCode, setProductCode] = useState("") // Variable para el código del producto
    const productList = useSelector((state) => state.saleForm.data.productList)

    const dispatch = useDispatch()
    const inputRef = useRef()
    const { textTheme } = useThemeClass()

    const handleSearchOpen = () => setSearchDialogOpen(true)
    const handleSearchClose = () => setSearchDialogOpen(false)

    const debounceFn = debounce(handleDebounceFn, 200)
    async function handleDebounceFn(query) {
        if (!query) return
        await dispatch(searchProducts({ search: query }))
    }

    const handleMultipleChanges = (e) => {
        handleSearch(e); // La función original
        // Aquí puedes agregar cualquier otra función que necesites
        handleCodeInput(e); // Otra función adicional
    };
    const handleSearch = (e) => {
        debounceFn(e.target.value)
    }

    useEffect(() => {
        if (searchDialogOpen) {
            const timeout = setTimeout(() => inputRef.current?.focus(), 100)
            return () => clearTimeout(timeout)
        }
    }, [searchDialogOpen])

    const handleCodeInput = (e) => {
        const code = e.target.value
        setProductCode(code)

        if (code) {
            const foundProduct = productList.find((product) => product.sku === code) // Buscar por SKU
            if (foundProduct) {
                handleAppendProduct(foundProduct) // Agregar automáticamente al carrito
                setSearchDialogOpen(false) // Cerrar el diálogo
            }
        }
    }

    useEffect(() => {
        if (searchDialogOpen) {
            const timeout = setTimeout(() => inputRef.current?.focus(), 100)
            return () => clearTimeout(timeout)
        }
    }, [searchDialogOpen])

    const handleClick = (product) => {
        if (product.stock > 0) {
            handleAppendProduct(product)
            setSearchDialogOpen(false)
        } else {
            toast.push(
                <Notification title="¡Stock Agotado!" type="danger" duration={3000}>
                    No se puede agregar, el STOCK está agotado
                </Notification>,
                { placement: 'top-center' }
            )
        }
    }

    return (
        <>
            {/* Botón de búsqueda */}
            <div onClick={handleSearchOpen}>
                {children || (
                    <div
                        className="text-2xl bg-slate-200 py-2 px-4 rounded-full flex items-center cursor-pointer hover:bg-slate-300"
                    >
                        <HiOutlineSearch />
                        <span className="text-sm pl-4">Agregar Producto...</span>
                    </div>
                )}
            </div>

            {/* Diálogo de búsqueda */}
            <Dialog
                contentClassName="p-0"
                isOpen={searchDialogOpen}
                closable={false}
                onRequestClose={handleSearchClose}
                width={800}
            >
                <div>
                    {/* Campo de búsqueda */}
                    <div className="px-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-600">
                        <div className="flex items-center flex-1">
                            <HiOutlineSearch className="text-xl mr-2 text-gray-600 dark:text-gray-300" />
                            <input
                                ref={inputRef}
                                className="ring-0 outline-none block w-full p-3 text-base bg-transparent text-gray-900 dark:text-gray-100"
                                placeholder="Buscar productos..."
                                onChange={handleMultipleChanges}

                            />
                        </div>
                        <Button size="xs" onClick={handleSearchClose}>
                            Cerrar
                        </Button>
                    </div>

                    {/* Listado de productos */}
                    <div className="py-4 px-5 max-h-[550px] overflow-y-auto">
                        {productList.map((product) => (
                            <div
                                key={product.id}
                                className="flex items-center gap-3 p-3 mb-2 bg-gray-50 dark:bg-gray-700/60 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/90 cursor-pointer"
                                onClick={() => handleClick(product)}
                            >
                                {/* Imagen del producto */}
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="h-12 w-12 object-contain rounded-md"
                                />

                                {/* Información del producto */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full">
                                    <div>
                                        <div className='flex items-center gap-2'>
                                            <Highlighter
                                                autoEscape
                                                highlightClassName={classNames(
                                                    textTheme,
                                                    'underline bg-transparent font-semibold dark:text-white'
                                                )}
                                                searchWords={[inputRef.current?.value || '']}
                                                textToHighlight={product.name}
                                            />
                                            {/* Ícono de carrito */}
                                            <HiShoppingCart className={classNames(textTheme, 'text-lg')} />


                                        </div>

                                        <div className="flex items-center mt-1 text-sm">
                                            <Badge className="bg-blue-600 mr-2" />
                                            <span className="capitalize text-gray-700 dark:text-gray-300 font-medium">
                                                {product.brand.name}
                                            </span>

                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 mt-2 sm:mt-0">
                                        <span className="text-gray-900 dark:text-gray-100 font-medium">
                                            Q {product.price}
                                        </span>

                                        {/* Etiqueta de Stock o Agotado */}
                                        {product.stock > 0 ? (
                                            <Tag className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 rounded-md border-0">
                                                Stock: {product.stock} {product.unit.symbol}
                                            </Tag>
                                        ) : (
                                            <Tag className="bg-red-200 text-red-600 dark:bg-red-500/20 dark:text-red-100 rounded-md border-0">
                                                Agotado
                                            </Tag>
                                        )}
                                        <span className="text-gray-900 dark:text-gray-100 font-medium">
                                            Q {product.description}
                                        </span>
                                    </div>

                                </div>
                            </div>
                        ))}

                        {/* Mensaje cuando no hay resultados */}
                        {productList.length === 0 && (
                            <div className="my-10 text-center text-amber-500 text-sm flex items-center justify-center space-x-2">
                                <FiAlertTriangle className="h-4 w-4" />
                                <span>No hay productos que coincidan con el término</span>
                                <span className="heading-text">
                                    '{inputRef.current?.value}'
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default SearchProducts
