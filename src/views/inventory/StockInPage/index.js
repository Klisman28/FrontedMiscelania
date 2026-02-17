import React, { useState, useEffect } from 'react'
import { Card, Button, FormItem, FormContainer, Input, Select } from 'components/ui'
import toast from 'react-hot-toast'
import { AdaptableCard } from 'components/shared'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { injectReducer } from 'store/index'
import warehousesReducer, { getWarehouses } from 'store/warehouses/warehousesSlice'
import productsReducer, { resetCreateState, resetSearchResults } from 'store/products/productsSlice'
import inventoryReducer, { stockIn, resetStockInState } from 'store/inventory/inventorySlice'
import ProductSearchSelect from 'components/inventory/ProductSearchSelect'
import ProductCreateModal from 'components/products/ProductCreateModal'

injectReducer('warehouses', warehousesReducer)
injectReducer('products', productsReducer)
injectReducer('inventory', inventoryReducer)

const validationSchema = yup.object().shape({
    warehouseId: yup.number().required('La bodega es requerida').typeError('La bodega es requerida'),
    productId: yup.number().required('El producto es requerido').typeError('El producto es requerido'),
    quantity: yup.number().typeError('Debe ser un número válido').positive('Debe ser mayor a 0').required('La cantidad es requerida'),
    description: yup.string()
})

const StockInPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { warehouses } = useSelector((state) => state.warehouses)
    const { success: stockInSuccess, error: stockInError } = useSelector((state) => state.inventory)
    const { createdProduct } = useSelector((state) => state.products)

    const [isProductModalOpen, setIsProductModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [selectedWarehouseId, setSelectedWarehouseId] = useState(null)

    const { control, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            warehouseId: '',
            productId: '',
            quantity: '',
            description: ''
        }
    })

    const warehouseIdValue = watch('warehouseId')

    useEffect(() => {
        dispatch(getWarehouses())
    }, [dispatch])

    useEffect(() => {
        if (stockInSuccess) {
            toast.success('Stock ingresado exitosamente.')

            // Reset form and state
            reset()
            setSelectedProduct(null)
            dispatch(resetStockInState())
            dispatch(resetSearchResults())

            // Optional: Navigate to warehouse stock page
            if (selectedWarehouseId) {
                // Uncomment to navigate automatically
                // navigate(`/warehouses/${selectedWarehouseId}/stock`)
            }
        }
    }, [stockInSuccess, dispatch, reset, navigate, selectedWarehouseId])

    useEffect(() => {
        if (stockInError) {
            toast.error(stockInError)
            dispatch(resetStockInState())
        }
    }, [stockInError, dispatch])

    useEffect(() => {
        if (createdProduct) {
            // Auto-select the newly created product
            setSelectedProduct(createdProduct)
            setValue('productId', createdProduct.id)
            dispatch(resetCreateState())
        }
    }, [createdProduct, setValue, dispatch])

    const onSubmit = async (values) => {
        setSelectedWarehouseId(values.warehouseId)
        await dispatch(stockIn({
            warehouseId: Number(values.warehouseId),
            productId: Number(values.productId),
            quantity: Number(values.quantity),
            description: values.description || undefined
        }))
    }

    const handleProductSelect = (product) => {
        setSelectedProduct(product)
        if (product) {
            setValue('productId', product.id)
        } else {
            setValue('productId', '')
        }
    }

    const handleOpenProductModal = () => {
        setIsProductModalOpen(true)
    }

    const handleProductCreated = (newProduct) => {
        setSelectedProduct(newProduct)
        setValue('productId', newProduct.id)
        setIsProductModalOpen(false)
    }

    const handleViewWarehouseStock = () => {
        if (warehouseIdValue) {
            navigate(`/warehouses/${warehouseIdValue}/stock`)
        }
    }

    const warehouseOptions = warehouses.map(w => ({ value: w.id, label: w.name }))

    return (
        <>
            <AdaptableCard className="h-full" bodyClass="h-full">
                <div className="lg:flex items-center justify-between mb-4">
                    <h3 className="mb-4 lg:mb-0">Recargar Stock (Entrada)</h3>
                    {warehouseIdValue && (
                        <Button
                            size="sm"
                            variant="plain"
                            onClick={handleViewWarehouseStock}
                        >
                            Ver Stock de esta Bodega
                        </Button>
                    )}
                </div>

                <Card>
                    <FormContainer>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormItem
                                    label="Bodega"
                                    invalid={!!errors.warehouseId}
                                    errorMessage={errors.warehouseId?.message}
                                    asterisk
                                >
                                    <Controller
                                        name="warehouseId"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                options={warehouseOptions}
                                                placeholder="Seleccione bodega"
                                                onChange={(option) => field.onChange(option?.value)}
                                                value={warehouseOptions.find(opt => opt.value === field.value)}
                                            />
                                        )}
                                    />
                                </FormItem>

                                <FormItem
                                    label="Producto"
                                    invalid={!!errors.productId}
                                    errorMessage={errors.productId?.message}
                                    asterisk
                                >
                                    <ProductSearchSelect
                                        onSelect={handleProductSelect}
                                        onCreateClick={handleOpenProductModal}
                                        selectedProduct={selectedProduct}
                                    />
                                </FormItem>

                                <FormItem
                                    label="Cantidad"
                                    invalid={!!errors.quantity}
                                    errorMessage={errors.quantity?.message}
                                    asterisk
                                >
                                    <Controller
                                        name="quantity"
                                        control={control}
                                        render={({ field }) => (
                                            <Input {...field} type="number" min="1" step="1" placeholder="Ej: 20" />
                                        )}
                                    />
                                </FormItem>

                                <FormItem
                                    label="Descripción / Referencia"
                                    invalid={!!errors.description}
                                    errorMessage={errors.description?.message}
                                >
                                    <Controller
                                        name="description"
                                        control={control}
                                        render={({ field }) => (
                                            <Input {...field} placeholder='Ej: "Compra - factura 001-00045"' />
                                        )}
                                    />
                                </FormItem>
                            </div>

                            <div className="flex justify-end mt-6">
                                <Button
                                    variant="solid"
                                    type="submit"
                                    loading={useSelector(state => state.inventory.loading)}
                                >
                                    Guardar Ingreso
                                </Button>
                            </div>
                        </form>
                    </FormContainer>
                </Card>
            </AdaptableCard>

            <ProductCreateModal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                onProductCreated={handleProductCreated}
            />
        </>
    )
}

export default StockInPage
