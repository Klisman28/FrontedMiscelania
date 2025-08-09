import React, { useState, useRef, useEffect } from 'react'
import classNames from 'classnames'
import { Dialog, Button, Badge } from 'components/ui'
import { searchProducts } from '../store/formSlice'
import useThemeClass from 'utils/hooks/useThemeClass'
import debounce from 'lodash/debounce'
import { HiOutlineSearch, HiShoppingCart } from 'react-icons/hi'
import Highlighter from 'react-highlight-words'
import { useDispatch, useSelector } from 'react-redux'
import { FiPackage, FiAlertTriangle } from 'react-icons/fi'

export const SearchProducts = ({ handleAppendProduct }) => {

    const [searchDialogOpen, setSearchDialogOpen] = useState(false)
    const productList = useSelector((state) => state.purchasForm.data.productList)

    const dispatch = useDispatch()
    const inputRef = useRef()
    const { textTheme } = useThemeClass()

    const handleSearchOpen = () => {
        setSearchDialogOpen(true)
    }

    const handleSearchClose = () => {
        setSearchDialogOpen(false)
    }

    const debounceFn = debounce(handleDebounceFn, 200)

    async function handleDebounceFn(query) {

        if (!query) {
            return
        }

        await dispatch(searchProducts({ search: query }))
    }

    const handleSearch = (e) => {
        debounceFn(e.target.value)
    }

    useEffect(() => {
        if (searchDialogOpen) {
            let timeout = setTimeout(() => inputRef.current?.focus(), 100)
            return () => {
                clearTimeout(timeout)
            }
        }
    }, [searchDialogOpen])

    const handleClick = (product) => {
        handleAppendProduct(product)
        setSearchDialogOpen(false)
    }

    return (
        <>
            <div
                className="text-2xl bg-slate-200 py-2 px-4 rounded-full flex items-center"
                onClick={handleSearchOpen}
            >
                <HiOutlineSearch />
                <span className='text-sm pl-4'>Buscar Producto...</span>
            </div>
            <Dialog
                contentClassName="p-0"
                isOpen={searchDialogOpen}
                closable={false}
                onRequestClose={handleSearchClose}
            >
                <div>
                    <div className="px-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-600">
                        <div className="flex items-center">
                            <HiOutlineSearch className="text-xl" />
                            <input
                                ref={inputRef}
                                className="ring-0 outline-none block w-full p-4 text-base bg-transparent text-gray-900 dark:text-gray-100"
                                placeholder="Search..."
                                onChange={handleSearch}
                            />
                        </div>
                        <Button size="xs" onClick={handleSearchClose}>Cerrar</Button>
                    </div>
                    <div className="py-4 px-5 max-h-[550px] overflow-y-auto">
                        <h6 className="mb-2">Productos</h6>
                        {
                            productList.map(product => (
                                <div className="mb-1" key={product.id}>
                                    <div
                                        className={
                                            classNames(
                                                'flex items-center justify-between rounded-lg p-2 cursor-pointer user-select',
                                                'bg-gray-50 dark:bg-gray-700/60 hover:bg-gray-100 dark:hover:bg-gray-700/90'
                                            )
                                        }
                                        onClick={() => handleClick(product)}
                                    >
                                        <div className="flex items-center">
                                            <div
                                                className={
                                                    classNames(
                                                        'mr-2 rounded-md ring-1 ring-slate-900/5 shadow-sm text-xl group-hover:shadow h-6 w-6 flex items-center justify-center bg-white dark:bg-gray-700',
                                                        textTheme,
                                                        'dark:text-gray-100'
                                                    )
                                                }
                                            >
                                                {/* <Avatar icon={<FiPackage/>} /> */}
                                                <FiPackage />
                                                {/* {icon && navigationIcon[icon]} */}
                                            </div>
                                            <div className="text-gray-900 dark:text-gray-300 flex items-center space-x-4">
                                                <Highlighter
                                                    autoEscape
                                                    highlightClassName={classNames(textTheme, 'underline bg-transparent font-semibold dark:text-white')}
                                                    searchWords={[inputRef.current?.value || '']}
                                                    textToHighlight={product.name}
                                                />
                                                <div className="flex items-center gap-2">
                                                    <Badge className="bg-blue-600" />
                                                    <span className="capitalize font-semibold" >
                                                        {product.brand.name}
                                                    </span>
                                                </div>
                                                <div>
                                                    costo: Q/. {product.cost}
                                                </div>
                                            </div>
                                        </div>
                                        <HiShoppingCart className={classNames(textTheme, 'text-lg')} />
                                    </div>
                                </div>
                            ))
                        }
                        {
                            (productList.length === 0) && (
                                <div className="my-10 text-center text-amber-500 text-sm flex items-center justify-center space-x-2">
                                    <FiAlertTriangle className='h-4 w-4' />
                                    <span>
                                        No hay productos que coencidan con la busqueda
                                    </span>
                                    <span className="heading-text">'{inputRef.current?.value}'</span>
                                </div>
                            )
                        }
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default SearchProducts
