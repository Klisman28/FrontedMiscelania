import React, { useEffect, useState } from 'react'
import { Dialog, Button, FormItem, FormContainer, Input, Select, Notification, toast } from 'components/ui'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { HiOutlineCloudUpload, HiTrash, HiX, HiRefresh } from 'react-icons/hi'
import ProductsApi from 'services/products.api'
import { parseApiError } from 'utils/parseApiError'
import { validateImageFile } from 'utils/fileValidators'
import useProductCatalogs from 'hooks/useProductCatalogs' // Nuevo Hook
import dayjs from 'dayjs'

const validationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es requerido'),
    sku: Yup.string().required('SKU es requerido'),
    price: Yup.number().typeError('Debe ser un número').required('El precio es requerido'),
    cost: Yup.number().typeError('Debe ser un número').nullable(),
    stock: Yup.number().typeError('Debe ser un número').default(0),
    stockMin: Yup.number().typeError('Debe ser un número').default(5),
    categoryId: Yup.string().nullable(),
    subcategoryId: Yup.string().nullable(),
    brandId: Yup.string().nullable(),
    unitId: Yup.string().nullable(),
    expirationDate: Yup.date().nullable().typeError('Fecha inválida').transform((curr, orig) => orig === '' ? null : curr)
})

const ProductFormModal = ({
    open,
    onClose,
    initialValues,
    mode = 'create',
    onSaved
}) => {
    // 1. Hook de catálogos (Nuevo)
    const {
        categories,
        subcategories,
        brands,
        units,
        loading: catalogsLoading,
        error: catalogsError,
        loadAll,
        loadSubcategories
    } = useProductCatalogs()

    const [preview, setPreview] = useState(null)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDragging, setIsDragging] = useState(false)

    // Form
    const { register, handleSubmit, control, reset, setValue, formState: { errors }, watch } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            name: '',
            sku: '',
            price: '',
            cost: '',
            stock: 0,
            stockMin: 5,
            categoryId: '',
            subcategoryId: '',
            brandId: '',
            unitId: '',
            image: null,
            expirationDate: ''
        }
    })

    const selectedImage = watch('image')
    const selectedCategoryId = watch('categoryId')

    // Effect: Cargar catálogos al abrir modal
    useEffect(() => {
        if (open) {
            loadAll()
        }
    }, [open, loadAll])

    // Effect: Reset Form & Handle Edit Mode
    useEffect(() => {
        if (open) {
            if (mode === 'edit' && initialValues) {
                // Formatting Date
                const expDate = initialValues.expirationDate
                    ? dayjs(initialValues.expirationDate).format('YYYY-MM-DD')
                    : ''

                reset({
                    name: initialValues.name || '',
                    sku: initialValues.sku || '',
                    price: initialValues.price || 0,
                    cost: initialValues.cost || 0,
                    stock: initialValues.stock || 0,
                    stockMin: initialValues.stockMin || 5,
                    categoryId: initialValues.categoryId ? String(initialValues.categoryId) : '',
                    subcategoryId: initialValues.subcategoryId ? String(initialValues.subcategoryId) : '',
                    brandId: initialValues.brandId ? String(initialValues.brandId) : '',
                    unitId: initialValues.unitId ? String(initialValues.unitId) : '',
                    image: null,
                    expirationDate: expDate
                })

                // Cargar subcategorías si hay categoría seleccionada
                if (initialValues.categoryId) {
                    loadSubcategories(initialValues.categoryId)
                }

            } else {
                reset({
                    name: '',
                    sku: '',
                    price: '',
                    cost: '',
                    stock: 0,
                    stockMin: 5,
                    categoryId: '',
                    subcategoryId: '',
                    brandId: '',
                    unitId: '',
                    image: null,
                    expirationDate: ''
                })
            }
            setUploadProgress(0)
            setIsSubmitting(false)
        }
    }, [open, mode, initialValues, reset, loadSubcategories])


    // Effect for Image Preview
    useEffect(() => {
        if (selectedImage instanceof File) {
            const objectUrl = URL.createObjectURL(selectedImage)
            setPreview(objectUrl)
            return () => URL.revokeObjectURL(objectUrl)
        } else if (initialValues?.imageUrl && !selectedImage) {
            setPreview(initialValues.imageUrl)
        } else {
            setPreview(null)
        }
    }, [selectedImage, initialValues])

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const { valid, error } = validateImageFile(file)
            if (!valid) {
                toast.push(
                    <Notification title="Error de archivo" type="danger">
                        {error}
                    </Notification>
                )
                e.target.value = ''
                return
            }
            setValue('image', file)
        }
    }

    const handleRemoveImage = () => {
        setValue('image', null)
    }

    // DND Handlers
    const handleDragOver = (e) => {
        e.preventDefault(); e.stopPropagation(); setIsDragging(true)
    }
    const handleDragLeave = (e) => {
        e.preventDefault(); e.stopPropagation(); setIsDragging(false)
    }
    const handleDrop = (e) => {
        e.preventDefault(); e.stopPropagation(); setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) {
            const { valid, error } = validateImageFile(file)
            if (!valid) {
                toast.push(
                    <Notification title="Error de archivo" type="danger">{error}</Notification>
                )
                return
            }
            setValue('image', file)
        }
    }

    const onSubmit = async (values) => {
        setIsSubmitting(true)
        setUploadProgress(0)

        const formData = new FormData()

        // Append basic fields
        const fields = ['name', 'sku', 'price', 'cost', 'stock', 'stockMin', 'categoryId', 'subcategoryId', 'brandId', 'unitId']
        fields.forEach(field => {
            if (values[field] !== null && values[field] !== undefined && values[field] !== '') {
                formData.append(field, values[field])
            }
        })

        // Handle Expiration Date
        if (values.expirationDate) {
            formData.append('expirationDate', values.expirationDate)
        }

        // Handle Image
        if (values.image instanceof File) {
            formData.append('image', values.image)
        }

        try {
            const onProgress = (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                setUploadProgress(percentCompleted)
            }

            let response
            if (mode === 'create') {
                response = await ProductsApi.createProduct(formData, onProgress)
            } else {
                response = await ProductsApi.updateProduct(initialValues.id, formData, onProgress)
            }

            const { data } = response
            toast.push(
                <Notification title="Éxito" type="success">
                    {data.message || `Producto ${mode === 'create' ? 'creado' : 'actualizado'} correctamente`}
                </Notification>
            )
            onSaved && onSaved(data.data || data)
            onClose()

        } catch (error) {
            const msg = parseApiError(error)
            toast.push(
                <Notification title="Error" type="danger">
                    {msg}
                </Notification>
            )
        } finally {
            setIsSubmitting(false)
            setUploadProgress(0)
        }
    }

    return (
        <Dialog
            isOpen={open}
            onClose={onClose}
            onRequestClose={onClose}
            width={800}
            closable={!isSubmitting}
        >
            <div className="flex justify-between items-center mb-4">
                <h5>{mode === 'create' ? 'Nuevo Producto' : 'Editar Producto'}</h5>
                <button className="text-gray-500 hover:text-gray-700" onClick={onClose} disabled={isSubmitting}>
                    <HiX className="text-xl" />
                </button>
            </div>

            <FormContainer>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Column */}
                        <div className="space-y-4">
                            <FormItem label="Nombre del Producto" invalid={errors.name} errorMessage={errors.name?.message} asterisk>
                                <Input {...register('name')} placeholder="Ej: Coca Cola 600ml" />
                            </FormItem>

                            <FormItem label="SKU / Código" invalid={errors.sku} errorMessage={errors.sku?.message} asterisk>
                                <Input {...register('sku')} placeholder="Ej: 75010553000" />
                            </FormItem>

                            <div className="grid grid-cols-2 gap-4">
                                <FormItem label="Precio Venta" invalid={errors.price} errorMessage={errors.price?.message} asterisk>
                                    <Input {...register('price')} type="number" step="0.01" prefix="Q" />
                                </FormItem>
                                <FormItem label="Costo Compra" invalid={errors.cost} errorMessage={errors.cost?.message}>
                                    <Input {...register('cost')} type="number" step="0.01" prefix="Q" />
                                </FormItem>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormItem label="Stock Actual" invalid={errors.stock} errorMessage={errors.stock?.message}>
                                    <Input {...register('stock')} type="number" />
                                </FormItem>
                                <FormItem label="Stock Mínimo" invalid={errors.stockMin} errorMessage={errors.stockMin?.message}>
                                    <Input {...register('stockMin')} type="number" />
                                </FormItem>
                            </div>

                            <FormItem label="Fecha de Vencimiento" invalid={errors.expirationDate} errorMessage={errors.expirationDate?.message}>
                                <Input type="date" {...register('expirationDate')} />
                            </FormItem>
                        </div>

                        {/* Second Column */}
                        <div className="space-y-4">

                            {/* CATEGORY & SUBCATEGORY */}
                            <FormItem
                                label="Categoría"
                                invalid={errors.categoryId}
                            >
                                <Controller
                                    name="categoryId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            options={categories}
                                            {...field}
                                            value={categories.find(c => c.value === field.value)}
                                            onChange={val => {
                                                field.onChange(val?.value)
                                                // Reset subcategory when category changes
                                                setValue('subcategoryId', '')
                                                // Cargar subcategorías nuevas
                                                loadSubcategories(val?.value)
                                            }}
                                            placeholder={catalogsLoading ? "Cargando..." : "Seleccione..."}
                                            isDisabled={catalogsLoading}
                                            isLoading={catalogsLoading}
                                            noOptionsMessage={() => "No hay categorías"}
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem label="Subcategoría">
                                <Controller
                                    name="subcategoryId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            options={subcategories}
                                            {...field}
                                            value={subcategories.find(c => c.value === field.value)}
                                            onChange={val => field.onChange(val?.value)}
                                            placeholder={!selectedCategoryId ? "Seleccione Categoría primero" : "Seleccione..."}
                                            isDisabled={!selectedCategoryId || catalogsLoading}
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem label="Marca">
                                <Controller
                                    name="brandId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            options={brands}
                                            {...field}
                                            value={brands.find(c => c.value === field.value)}
                                            onChange={val => field.onChange(val?.value)}
                                            placeholder={catalogsLoading ? "Cargando..." : "Seleccione..."}
                                            isDisabled={catalogsLoading}
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem label="Unidad">
                                <Controller
                                    name="unitId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            options={units}
                                            {...field}
                                            value={units.find(c => c.value === field.value)}
                                            onChange={val => field.onChange(val?.value)}
                                            placeholder={catalogsLoading ? "Cargando..." : "Seleccione..."}
                                            isDisabled={catalogsLoading}
                                        />
                                    )}
                                />
                            </FormItem>

                            {catalogsError && (
                                <div className="text-red-500 text-sm flex items-center justify-between bg-red-50 p-2 rounded">
                                    <span>Error cargando listas</span>
                                    <Button size="xs" icon={<HiRefresh />} onClick={loadAll} type="button">Reintentar</Button>
                                </div>
                            )}

                            <FormItem label="Imagen del Producto">
                                <div
                                    className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center min-h-[160px] relative transition-colors ${isDragging ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-gray-50'
                                        }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    {preview ? (
                                        <div className="relative group w-full h-full flex justify-center">
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="max-h-[140px] object-contain rounded"
                                            />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded">
                                                <Button
                                                    size="sm"
                                                    variant="solid"
                                                    color="red-600"
                                                    icon={<HiTrash />}
                                                    onClick={handleRemoveImage}
                                                    type="button"
                                                >
                                                    Quitar
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <HiOutlineCloudUpload className="text-4xl text-gray-400 mx-auto mb-2" />
                                            <p className="text-xs text-gray-500 mb-1">Arrastra o click</p>
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                    )}
                                </div>
                            </FormItem>

                            {isSubmitting && uploadProgress > 0 && (
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                                    <div
                                        className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                    <p className="text-xs text-center mt-1 text-indigo-600 font-semibold">{uploadProgress}% Subido</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="text-right mt-6 pt-4 border-t border-gray-200">
                        <Button className="mr-2" onClick={onClose} type="button" disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button variant="solid" type="submit" loading={isSubmitting}>
                            {mode === 'create' ? 'Guardar' : 'Actualizar'}
                        </Button>
                    </div>
                </form>
            </FormContainer>
        </Dialog>
    )
}

export default ProductFormModal
