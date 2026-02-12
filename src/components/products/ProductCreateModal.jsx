import React, { useEffect } from 'react'
import { Dialog, FormContainer, FormItem, Input, Button, Notification, toast, Select } from 'components/ui'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { createProduct, resetCreateState } from 'store/products/productsSlice'
import { injectReducer } from 'store/index'
import productFormReducer, { getBrands, getSubategories, getProductUnits } from 'views/catalogue/products/ProductForm/store/formSlice'
import { CURRENCY_SYMBOL } from 'utils/currency'

injectReducer('productForm', productFormReducer)

// Simplified validation for quick product creation
const validationSchema = yup.object().shape({
    name: yup.string().required('El nombre es requerido').min(4, 'Mínimo 4 caracteres'),
    sku: yup.string().required('El SKU es requerido'),
    cost: yup.number().typeError('Debe ser un número').required('El costo es requerido').min(0, 'Debe ser mayor o igual a 0'),
    price: yup.number().typeError('Debe ser un número').required('El precio es requerido').min(0, 'Debe ser mayor o igual a 0')
        .test('price-gte-cost', 'El precio debe ser mayor o igual al costo', function (value) {
            const { cost } = this.parent
            return value >= cost
        }),
    subcategoryId: yup.number().required('La subcategoría es requerida').typeError('La subcategoría es requerida'),
    unitId: yup.number().required('La unidad es requerida').typeError('La unidad es requerida'),
    brandId: yup.number().nullable() // Optional
})

const ProductCreateModal = ({ isOpen, onClose, onProductCreated }) => {
    const dispatch = useDispatch()
    const { creating, createSuccess, errorCreate, createdProduct } = useSelector((state) => state.products)

    // Catalog data from Redux - accessing state.productForm.data.*
    const brandList = useSelector((state) => state.productForm?.data?.brandList || [])
    const subcategoryList = useSelector((state) => state.productForm?.data?.subcategoryList || [])
    const unitList = useSelector((state) => state.productForm?.data?.unitList || [])

    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            name: '',
            sku: '',
            cost: 0,
            price: 0,
            subcategoryId: '',
            unitId: '',
            brandId: ''
        }
    })

    // Load catalogs when modal opens
    useEffect(() => {
        if (isOpen) {
            dispatch(getSubategories())
            dispatch(getProductUnits())
            dispatch(getBrands())
        }
    }, [isOpen, dispatch])

    // Auto-select default subcategory when catalogs load
    useEffect(() => {
        if (subcategoryList.length > 0) {
            // Try to find "General" or "Sin categoría"
            const defaultSubcategory = subcategoryList.find(s =>
                s.name?.toLowerCase().includes('general') ||
                s.name?.toLowerCase().includes('sin categoría') ||
                s.name?.toLowerCase().includes('sin categoria')
            )
            if (defaultSubcategory) {
                setValue('subcategoryId', defaultSubcategory.id)
            } else {
                // If no default found, select first one
                setValue('subcategoryId', subcategoryList[0]?.id)
            }
        }
    }, [subcategoryList, setValue])

    // Auto-select default unit when catalogs load
    useEffect(() => {
        if (unitList.length > 0) {
            // Try to find "Unidad"
            const defaultUnit = unitList.find(u =>
                u.name?.toLowerCase() === 'unidad' ||
                u.symbol?.toLowerCase() === 'und' ||
                u.symbol?.toLowerCase() === 'uni'
            )
            if (defaultUnit) {
                setValue('unitId', defaultUnit.id)
            } else {
                // If no default found, select first one
                setValue('unitId', unitList[0]?.id)
            }
        }
    }, [unitList, setValue])

    // Auto-select default brand (optional)
    useEffect(() => {
        if (brandList.length > 0) {
            // Try to find "Genérica" or "Generic"
            const defaultBrand = brandList.find(b =>
                b.name?.toLowerCase().includes('genérica') ||
                b.name?.toLowerCase().includes('generic') ||
                b.name?.toLowerCase().includes('generica')
            )
            if (defaultBrand) {
                setValue('brandId', defaultBrand.id)
            }
        }
    }, [brandList, setValue])

    useEffect(() => {
        if (createSuccess && createdProduct) {
            toast.push(
                <Notification title="Éxito" type="success">
                    Producto creado exitosamente.
                </Notification>,
                { placement: 'top-center' }
            )
            if (onProductCreated) {
                onProductCreated(createdProduct)
            }
            handleClose()
        }
    }, [createSuccess, createdProduct, onProductCreated])

    useEffect(() => {
        if (errorCreate) {
            let errorMessage = errorCreate
            if (errorCreate.toLowerCase().includes('sku') || errorCreate.toLowerCase().includes('unique') || errorCreate.toLowerCase().includes('duplicado')) {
                errorMessage = 'El SKU ya existe. Por favor, usa uno diferente.'
            }

            toast.push(
                <Notification title="Error" type="danger">
                    {errorMessage}
                </Notification>,
                { placement: 'top-center' }
            )
        }
    }, [errorCreate])

    const onSubmit = async (values) => {
        // Prepare payload - only send brandId if it has a value
        const payload = {
            name: values.name,
            sku: values.sku,
            cost: parseFloat(values.cost),
            price: parseFloat(values.price),
            subcategoryId: Number(values.subcategoryId),
            unitId: Number(values.unitId)
        }

        // Add brandId only if selected
        if (values.brandId) {
            payload.brandId = Number(values.brandId)
        }

        await dispatch(createProduct(payload))
    }

    const handleClose = () => {
        dispatch(resetCreateState())
        reset()
        onClose()
    }

    const brandOptions = brandList.map(b => ({ value: b.id, label: b.name }))
    const subcategoryOptions = subcategoryList.map(s => ({ value: s.id, label: s.name }))
    const unitOptions = unitList.map(u => ({ value: u.id, label: `${u.name} (${u.symbol})` }))

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            onRequestClose={handleClose}
            width={600}
        >
            <div className="flex flex-col h-full justify-between">
                <h5 className="mb-4">Crear Nuevo Producto (Rápido)</h5>
                <p className="text-sm text-gray-600 mb-4">
                    Complete la información básica del producto. Luego podrá ingresar el stock inicial.
                </p>
                <FormContainer>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormItem
                            label="Nombre del Producto"
                            invalid={!!errors.name}
                            errorMessage={errors.name?.message}
                            asterisk
                        >
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="Ej. Laptop HP 15" autoFocus />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            label="SKU / Código"
                            invalid={!!errors.sku}
                            errorMessage={errors.sku?.message}
                            asterisk
                        >
                            <Controller
                                name="sku"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="Ej. HP15-2024" />
                                )}
                            />
                        </FormItem>

                        <div className="grid grid-cols-2 gap-4">
                            <FormItem
                                label="Costo"
                                invalid={!!errors.cost}
                                errorMessage={errors.cost?.message}
                                asterisk
                            >
                                <Controller
                                    name="cost"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} type="number" step="0.01" prefix={CURRENCY_SYMBOL} placeholder="850.00" />
                                    )}
                                />
                            </FormItem>

                            <FormItem
                                label="Precio de Venta"
                                invalid={!!errors.price}
                                errorMessage={errors.price?.message}
                                asterisk
                            >
                                <Controller
                                    name="price"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} type="number" step="0.01" prefix={CURRENCY_SYMBOL} placeholder="1000.00" />
                                    )}
                                />
                            </FormItem>
                        </div>

                        <FormItem
                            label="Subcategoría"
                            invalid={!!errors.subcategoryId}
                            errorMessage={errors.subcategoryId?.message}
                            asterisk
                        >
                            <Controller
                                name="subcategoryId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={subcategoryOptions}
                                        placeholder="Seleccione subcategoría"
                                        onChange={(option) => field.onChange(option?.value)}
                                        value={subcategoryOptions.find(opt => opt.value === field.value)}
                                        isLoading={subcategoryList.length === 0}
                                    />
                                )}
                            />
                        </FormItem>

                        <div className="grid grid-cols-2 gap-4">
                            <FormItem
                                label="Unidad"
                                invalid={!!errors.unitId}
                                errorMessage={errors.unitId?.message}
                                asterisk
                            >
                                <Controller
                                    name="unitId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={unitOptions}
                                            placeholder="Seleccione unidad"
                                            onChange={(option) => field.onChange(option?.value)}
                                            value={unitOptions.find(opt => opt.value === field.value)}
                                            isLoading={unitList.length === 0}
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem
                                label="Marca"
                                invalid={!!errors.brandId}
                                errorMessage={errors.brandId?.message}
                            >
                                <Controller
                                    name="brandId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={brandOptions}
                                            placeholder="Opcional"
                                            isClearable
                                            onChange={(option) => field.onChange(option?.value || null)}
                                            value={brandOptions.find(opt => opt.value === field.value)}
                                            isLoading={brandList.length === 0}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>

                        <div className="text-right mt-6 pt-4 border-t border-gray-200">
                            <Button
                                className="ltr:mr-2 rtl:ml-2"
                                variant="plain"
                                type="button"
                                onClick={handleClose}
                                disabled={creating}
                            >
                                Cancelar
                            </Button>
                            <Button variant="solid" loading={creating} type="submit">
                                Crear Producto
                            </Button>
                        </div>
                    </form>
                </FormContainer>
            </div>
        </Dialog>
    )
}

export default ProductCreateModal
