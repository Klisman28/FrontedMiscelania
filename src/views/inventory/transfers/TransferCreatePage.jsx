import React, { useEffect, useState, useRef } from 'react'
import { Card, Button, FormContainer, FormItem, Select, Input, Notification, toast, Table } from 'components/ui'
import { HiOutlineArrowLeft, HiOutlineSearch, HiTrash } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { getWarehouses, getWarehouseStock } from 'store/warehouses/warehousesSlice'
import { createTransfer, resetCreateState } from 'store/transfers/transfersSlice'
import { injectReducer } from 'store/index'
import reducer from 'store/transfers/transfersSlice'
import { apiSearchProducts } from 'services/catalogue/ProductService'
import debounce from 'lodash/debounce'

import warehousesReducer from 'store/warehouses/warehousesSlice'

injectReducer('warehouses', warehousesReducer)
injectReducer('transfers', reducer)

const validationSchema = Yup.object().shape({
    fromWarehouseId: Yup.string().required('Bodega Origen requerida'),
    toWarehouseId: Yup.string()
        .required('Bodega Destino requerida')
        .notOneOf([Yup.ref('fromWarehouseId')], 'Origen y Destino no pueden ser iguales'),
    items: Yup.array()
        .of(
            Yup.object().shape({
                productId: Yup.number().required(),
                quantity: Yup.number()
                    .min(1, 'Mínimo 1')
                    .required('Cantidad requerida')
                // Custom validation for stock can be tricky here, better to display error in UI or use test
            })
        )
        .min(1, 'Debe agregar al menos un producto')
})

const { Tr, Th, Td, THead, TBody } = Table

const TransferCreatePage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // Redux state
    const { warehouses } = useSelector((state) => state.warehouses)
    const { stock } = useSelector((state) => state.warehouses)
    const { creating, createSuccess, errorCreate } = useSelector((state) => state.transfers)

    // Local state for product search
    const [searchResults, setSearchResults] = useState([])
    const [searching, setSearching] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const searchInputRef = useRef()

    useEffect(() => {
        dispatch(getWarehouses({}))
        return () => { dispatch(resetCreateState()) }
    }, [dispatch])

    useEffect(() => {
        if (createSuccess) {
            toast.push(
                <Notification title="Transferencia Creada" type="success">
                    La transferencia se ha registrado exitosamente.
                </Notification>
            )
            navigate('/inventory/transfers')
        }
    }, [createSuccess, navigate])

    useEffect(() => {
        if (errorCreate) {
            toast.push(
                <Notification title="Error" type="danger">
                    {errorCreate}
                </Notification>
            )
        }
    }, [errorCreate])

    const warehouseOptions = warehouses.map(w => ({ value: w.id, label: w.name }))

    // Product Search Logic
    const handleSearch = async (query) => {
        setSearchQuery(query)
        if (!query || query.length < 2) {
            setSearchResults([])
            return
        }
        setSearching(true)
        try {
            const response = await apiSearchProducts({ search: query })
            setSearchResults(response.data?.data || [])
        } catch (error) {
            console.error("Error searching products", error)
        } finally {
            setSearching(false)
        }
    }

    const debounceSearch = useRef(debounce(handleSearch, 500)).current

    // Helper to get available stock for a product from the loaded stock list
    const getAvailableStock = (productId, currentStockList) => {
        // Assuming stock list is array of { productId, quantity, ... }
        // Adjust based on actual structure of getWarehouseStock response
        const item = currentStockList.find(s => s.productId === productId || s.product?.id === productId)
        return item ? item.quantity : 0
    }

    return (
        <Formik
            initialValues={{
                fromWarehouseId: '',
                toWarehouseId: '',
                items: [], // { productId, quantity, product: {...}, available: 0 }
                observation: ''
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                // Final validation before submit
                const invalidItems = values.items.some(item => item.quantity > item.available)
                if (invalidItems) {
                    toast.push(<Notification type="danger">Algunos productos superan el stock disponible</Notification>)
                    setSubmitting(false)
                    return
                }

                const payload = {
                    fromWarehouseId: values.fromWarehouseId,
                    toWarehouseId: values.toWarehouseId,
                    items: values.items.map(i => ({ productId: i.productId, quantity: i.quantity })),
                    observation: values.observation
                }
                dispatch(createTransfer(payload))
            }}
        >
            {({ values, touched, errors, setFieldValue, handleChange, handleSubmit, isSubmitting }) => (
                <Form onSubmit={handleSubmit}>
                    <FormContainer>
                        <div className="lg:flex items-center justify-between mb-4 gap-3">
                            <div className="flex items-center gap-2">
                                <Button size="sm" icon={<HiOutlineArrowLeft />} onClick={() => navigate('/inventory/transfers')} type="button" />
                                <h3>Nueva Transferencia</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="solid"
                                    loading={creating || isSubmitting}
                                    type="submit"
                                >
                                    Transferir
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="lg:col-span-2 flex flex-col gap-4">
                                <Card className="mb-4">
                                    <h5>Productos</h5>
                                    <div className="mt-4 relative">
                                        <Input
                                            ref={searchInputRef}
                                            placeholder="Buscar producto a agregar..."
                                            prefix={<HiOutlineSearch />}
                                            onChange={(e) => debounceSearch(e.target.value)}
                                            disabled={!values.fromWarehouseId}
                                        />
                                        {!values.fromWarehouseId && <span className="text-red-500 text-xs">Seleccione bodega origen primero</span>}

                                        {/* Search Results Dropdown */}
                                        {searchQuery && searchResults.length > 0 && (
                                            <div className="absolute z-10 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-md mt-1 w-full max-h-60 overflow-y-auto">
                                                {searchResults.map(prod => {
                                                    const inStockInfo = stock ? getAvailableStock(prod.id, stock) : 0
                                                    const isAdded = values.items.some(i => i.productId === prod.id)
                                                    return (
                                                        <div
                                                            key={prod.id}
                                                            className={`p-2 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${isAdded ? 'opacity-50' : ''}`}
                                                            onClick={() => {
                                                                if (isAdded) return
                                                                const newItem = {
                                                                    productId: prod.id,
                                                                    product: prod,
                                                                    quantity: 1,
                                                                    available: inStockInfo
                                                                }
                                                                setFieldValue('items', [...values.items, newItem])
                                                                setSearchQuery('')
                                                                if (searchInputRef.current) searchInputRef.current.value = ''
                                                                setSearchResults([])
                                                            }}
                                                        >
                                                            <div>
                                                                <div className="font-semibold">{prod.name}</div>
                                                                <div className="text-xs text-gray-500">SKU: {prod.sku || prod.code}</div>
                                                            </div>
                                                            <div className={`text-sm ${inStockInfo > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                                                Stock: {inStockInfo}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6">
                                        <Table>
                                            <THead>
                                                <Tr>
                                                    <Th>Producto</Th>
                                                    <Th>Disponible</Th>
                                                    <Th>Cantidad</Th>
                                                    <Th></Th>
                                                </Tr>
                                            </THead>
                                            <TBody>
                                                {values.items.length === 0 ? (
                                                    <Tr>
                                                        <Td colSpan="4" className="text-center">No hay items agregados</Td>
                                                    </Tr>
                                                ) : (
                                                    values.items.map((item, index) => (
                                                        <Tr key={item.productId}>
                                                            <Td>
                                                                <div className="font-bold">{item.product.name}</div>
                                                                <div className="text-xs">{item.product.sku}</div>
                                                            </Td>
                                                            <Td>{item.available}</Td>
                                                            <Td>
                                                                <Input
                                                                    type="number"
                                                                    value={item.quantity}
                                                                    min="1"
                                                                    max={item.available} // Optional: enforce in UI
                                                                    onChange={(e) => {
                                                                        const val = parseInt(e.target.value) || 0
                                                                        setFieldValue(`items[${index}].quantity`, val)
                                                                    }}
                                                                    invalid={item.quantity > item.available || item.quantity <= 0}
                                                                />
                                                                {item.quantity > item.available && <span className="text-red-500 text-xs">Excede stock</span>}
                                                            </Td>
                                                            <Td>
                                                                <Button
                                                                    size="sm"
                                                                    icon={<HiTrash />}
                                                                    variant="plain"
                                                                    color="red-600"
                                                                    onClick={() => {
                                                                        const newItems = [...values.items]
                                                                        newItems.splice(index, 1)
                                                                        setFieldValue('items', newItems)
                                                                    }}
                                                                />
                                                            </Td>
                                                        </Tr>
                                                    ))
                                                )}
                                            </TBody>
                                        </Table>
                                        {errors.items && typeof errors.items === 'string' && (
                                            <div className="text-red-500 mt-2">{errors.items}</div>
                                        )}
                                    </div>
                                </Card>
                            </div>

                            <div className="lg:col-span-1">
                                <Card className="mb-4">
                                    <h5>Detalles de Transferencia</h5>
                                    <div className="mt-4 flex flex-col gap-4">
                                        <FormItem
                                            label="Bodega Origen"
                                            invalid={errors.fromWarehouseId && touched.fromWarehouseId}
                                            errorMessage={errors.fromWarehouseId}
                                        >
                                            <Select
                                                options={warehouseOptions}
                                                value={warehouseOptions.find(o => o.value === values.fromWarehouseId)}
                                                onChange={(option) => {
                                                    setFieldValue('fromWarehouseId', option?.value || '')
                                                    setFieldValue('items', []) // Clear items on warehouse change
                                                    if (option?.value) {
                                                        dispatch(getWarehouseStock({ id: option.value }))
                                                    }
                                                }}
                                                placeholder="Seleccione origen"
                                            />
                                        </FormItem>

                                        <FormItem
                                            label="Bodega Destino"
                                            invalid={errors.toWarehouseId && touched.toWarehouseId}
                                            errorMessage={errors.toWarehouseId}
                                        >
                                            <Select
                                                options={warehouseOptions.filter(o => o.value !== values.fromWarehouseId)}
                                                value={warehouseOptions.find(o => o.value === values.toWarehouseId)}
                                                onChange={(option) => setFieldValue('toWarehouseId', option?.value || '')}
                                                placeholder="Seleccione destino"
                                                isDisabled={!values.fromWarehouseId}
                                            />
                                        </FormItem>

                                        <FormItem
                                            label="Observación"
                                            invalid={errors.observation && touched.observation}
                                            errorMessage={errors.observation}
                                        >
                                            <Input
                                                textArea
                                                placeholder="Nota opcional..."
                                                value={values.observation}
                                                onChange={handleChange}
                                                name="observation"
                                            />
                                        </FormItem>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </FormContainer>
                </Form>
            )}
        </Formik>
    )
}

export default TransferCreatePage
