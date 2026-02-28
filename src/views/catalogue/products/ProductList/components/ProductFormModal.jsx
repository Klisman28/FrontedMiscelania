import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { Dialog, Button, FormItem, FormContainer, Input, Select, Notification, toast } from 'components/ui'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { HiOutlineCloudUpload, HiTrash, HiX, HiRefresh, HiPhotograph, HiOutlineLocationMarker, HiPlus, HiMinus, HiOutlineCube } from 'react-icons/hi'
import ProductsApi from 'services/products.api'
import warehouseService from 'services/warehouseService'
import { parseApiError } from 'utils/parseApiError'
import { validateImageFile } from 'utils/fileValidators'
import useProductCatalogs from 'hooks/useProductCatalogs'
import dayjs from 'dayjs'

const getValidationSchema = (mode) => Yup.object().shape({
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
    expirationDate: Yup.date().nullable().typeError('Fecha inválida').transform((curr, orig) => orig === '' ? null : curr),
    // Warehouse & stock fields only validated in create mode
    ...(mode === 'create' ? {
        warehouseId: Yup.string().required('Seleccione dónde guardar el producto'),
        initialStock: Yup.number().typeError('Debe ser un número').min(0, 'No puede ser negativo').default(0),
        stockDescription: Yup.string().default('Stock inicial al crear producto')
    } : {
        warehouseId: Yup.string().nullable(),
        initialStock: Yup.number().nullable(),
        stockDescription: Yup.string().nullable()
    })
})

const ProductFormModal = ({
    open,
    onClose,
    initialValues,
    mode = 'create',
    onSaved
}) => {
    // Validation schema depends on mode
    const validationSchema = useMemo(() => getValidationSchema(mode), [mode])

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
    const [imageRemoved, setImageRemoved] = useState(false)
    const [warehouses, setWarehouses] = useState([])
    const [warehousesLoading, setWarehousesLoading] = useState(false)
    const fileInputRef = useRef(null)

    // ── Stock adjustment state (edit mode) ──
    const [stockAdjustOpen, setStockAdjustOpen] = useState(false)
    const [stockAdjustType, setStockAdjustType] = useState('IN') // 'IN' | 'OUT'
    const [stockAdjustQty, setStockAdjustQty] = useState('')
    const [stockAdjustWarehouse, setStockAdjustWarehouse] = useState('')
    const [stockAdjustDesc, setStockAdjustDesc] = useState('')
    const [stockAdjustLoading, setStockAdjustLoading] = useState(false)
    // Live stock counter — starts from prop, updates after each adjustment
    const [currentStock, setCurrentStock] = useState(initialValues?.stock ?? 0)

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
            expirationDate: '',
            warehouseId: '',
            initialStock: 0,
            stockDescription: 'Stock inicial al crear producto'
        }
    })

    const selectedImage = watch('image')
    const selectedCategoryId = watch('categoryId')

    // Fetch warehouses for location selector
    const loadWarehouses = useCallback(async () => {
        setWarehousesLoading(true)
        try {
            const response = await warehouseService.fetchWarehouses({ active: true })
            const list = response?.data?.data || response?.data || []
            setWarehouses(Array.isArray(list) ? list : [])
        } catch (err) {
            console.error('Error loading warehouses:', err)
            setWarehouses([])
        } finally {
            setWarehousesLoading(false)
        }
    }, [])

    // Effect: Cargar catálogos y warehouses al abrir modal
    useEffect(() => {
        if (open) {
            loadAll()
            loadWarehouses()
            // Reset stock adjustment state
            setStockAdjustOpen(false)
            setStockAdjustType('IN')
            setStockAdjustQty('')
            setStockAdjustWarehouse('')
            setStockAdjustDesc('')
            // Sync live stock counter from prop
            setCurrentStock(initialValues?.stock ?? 0)
        }
    }, [open, loadAll, loadWarehouses, initialValues])

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
                setImageRemoved(false)

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
                    expirationDate: '',
                    warehouseId: '',
                    initialStock: 0,
                    stockDescription: 'Stock inicial al crear producto'
                })
                setImageRemoved(false)
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
        } else if (imageRemoved) {
            setPreview(null)
        } else if (initialValues?.imageUrl && !selectedImage) {
            setPreview(initialValues.imageUrl)
        } else {
            setPreview(null)
        }
    }, [selectedImage, initialValues, imageRemoved])

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
            setImageRemoved(false)
        }
    }

    const handleRemoveImage = () => {
        setValue('image', null)
        setImageRemoved(true)
        setPreview(null)
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleChangeImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
            fileInputRef.current.click()
        }
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
            setImageRemoved(false)
        }
    }

    // ── Handle stock adjustment (edit mode) ──
    const handleStockAdjust = async () => {
        const qty = Number(stockAdjustQty)
        if (!stockAdjustWarehouse) {
            toast.push(<Notification title="Error" type="danger">Seleccione una ubicación</Notification>)
            return
        }
        if (!qty || qty <= 0) {
            toast.push(<Notification title="Error" type="danger">Ingrese una cantidad válida mayor a 0</Notification>)
            return
        }

        setStockAdjustLoading(true)
        try {
            const payload = {
                warehouseId: Number(stockAdjustWarehouse),
                productId: Number(initialValues.id),
                quantity: qty,
                description: stockAdjustDesc || (stockAdjustType === 'IN' ? 'Ingreso manual desde edición' : 'Salida manual desde edición')
            }

            if (stockAdjustType === 'IN') {
                await warehouseService.addStock(payload)
            } else {
                await warehouseService.removeStock(payload)
            }

            const selectedWh = warehouses.find(w => String(w.id) === String(stockAdjustWarehouse))
            toast.push(
                <Notification title={stockAdjustType === 'IN' ? 'Stock ingresado' : 'Stock retirado'} type="success" duration={3000}>
                    {qty} unidades {stockAdjustType === 'IN' ? 'agregadas a' : 'retiradas de'} {selectedWh?.name || 'ubicación'}
                </Notification>
            )

            // ── Refresh UI immediately ──
            // 1. Update local stock counter in the modal
            setCurrentStock(prev => stockAdjustType === 'IN' ? prev + qty : prev - qty)
            // 2. Trigger Redux re-fetch so the product list updates behind the modal
            onSaved && onSaved()

            // Reset fields
            setStockAdjustQty('')
            setStockAdjustDesc('')
            setStockAdjustOpen(false)
        } catch (err) {
            const errMsg = err?.response?.data?.message || parseApiError(err)
            toast.push(<Notification title="Error de stock" type="danger" duration={4000}>{errMsg}</Notification>)
        } finally {
            setStockAdjustLoading(false)
        }
    }

    const onSubmit = async (values) => {
        setIsSubmitting(true)
        setUploadProgress(0)

        const formData = new FormData()

        // Append basic fields (excluding categoryId since backend does not expect it)
        // In edit mode, exclude 'stock' — stock only changes via inventory movements
        const fields = mode === 'edit'
            ? ['name', 'sku', 'price', 'cost', 'stockMin', 'description', 'subcategoryId', 'brandId', 'unitId']
            : ['name', 'sku', 'price', 'cost', 'stockMin', 'description', 'subcategoryId', 'brandId', 'unitId', 'initialStock', 'warehouseId', 'stockDescription']
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
            // New image selected → send file
            formData.append('image', values.image)
        } else if (imageRemoved) {
            // User explicitly removed image → tell backend to clear it
            formData.append('imageUrl', '')
            formData.append('removeImage', 'true')
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
            const createdProduct = data.data || data

            // Backend will handle the 'initialStock' inside the '/products' endpoint automatically in a single step
            if (mode === 'create' && values.warehouseId && Number(values.initialStock) > 0) {
                const selectedWh = warehouses.find(w => String(w.id) === String(values.warehouseId))
                const whType = selectedWh?.type === 'tienda' ? 'Tienda' : 'Bodega'
                toast.push(
                    <Notification title="Producto y Stock registrados" type="success" duration={3500}>
                        Se registró el producto y {values.initialStock} unidades en {whType} — {selectedWh?.name || 'ubicación'}
                    </Notification>
                )
            }

            toast.push(
                <Notification title="Éxito" type="success">
                    {data.message || `Producto ${mode === 'create' ? 'creado' : 'actualizado'} correctamente`}
                </Notification>
            )
            onSaved && onSaved(createdProduct)
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
                                <FormItem label="Stock Mínimo" invalid={errors.stockMin} errorMessage={errors.stockMin?.message}>
                                    <Input {...register('stockMin')} type="number" />
                                </FormItem>
                                <FormItem label="Fecha de Vencimiento" invalid={errors.expirationDate} errorMessage={errors.expirationDate?.message}>
                                    <Input type="date" {...register('expirationDate')} />
                                </FormItem>
                            </div>

                            {/* ── Ubicación & Stock Inicial (modo crear) ── */}
                            {mode === 'create' && (
                                <div className="border border-indigo-100 bg-indigo-50/40 rounded-xl p-4 space-y-3 mt-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <HiOutlineLocationMarker className="text-indigo-500 text-lg" />
                                        <span className="text-sm font-semibold text-indigo-700">Ubicación y Stock</span>
                                    </div>
                                    <FormItem label="Ubicación destino" invalid={errors.warehouseId} errorMessage={errors.warehouseId?.message} asterisk>
                                        <Controller
                                            name="warehouseId"
                                            control={control}
                                            render={({ field }) => {
                                                const tiendas = warehouses.filter(w => w.type === 'tienda')
                                                const bodegas = warehouses.filter(w => w.type !== 'tienda')
                                                const groupedOptions = [
                                                    {
                                                        label: '🏪 Tiendas',
                                                        options: tiendas.map(w => ({
                                                            value: String(w.id),
                                                            label: `Tienda - ${w.name}${w.code ? ` (${w.code})` : ''}`,
                                                            type: w.type
                                                        }))
                                                    },
                                                    {
                                                        label: '📦 Bodegas',
                                                        options: bodegas.map(w => ({
                                                            value: String(w.id),
                                                            label: `Bodega - ${w.name}${w.code ? ` (${w.code})` : ''}`,
                                                            type: w.type
                                                        }))
                                                    }
                                                ].filter(g => g.options.length > 0)
                                                const allOptions = groupedOptions.flatMap(g => g.options)
                                                return (
                                                    <Select
                                                        options={groupedOptions}
                                                        {...field}
                                                        value={allOptions.find(o => o.value === field.value) || null}
                                                        onChange={val => field.onChange(val?.value || '')}
                                                        placeholder={warehousesLoading ? 'Cargando ubicaciones...' : 'Seleccione dónde guardar'}
                                                        isDisabled={warehousesLoading}
                                                        isLoading={warehousesLoading}
                                                        noOptionsMessage={() => 'No hay ubicaciones disponibles'}
                                                        formatOptionLabel={(option) => (
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm">{option.label}</span>
                                                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${option.type === 'tienda' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                                    {option.type === 'tienda' ? 'POS' : 'Almacén'}
                                                                </span>
                                                            </div>
                                                        )}
                                                        formatGroupLabel={(group) => (
                                                            <div className="flex items-center gap-1.5 py-1">
                                                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{group.label}</span>
                                                                <span className="text-[10px] text-slate-400">({group.options.length})</span>
                                                            </div>
                                                        )}
                                                    />
                                                )
                                            }}
                                        />
                                    </FormItem>
                                    <FormItem label="Stock Inicial" invalid={errors.initialStock} errorMessage={errors.initialStock?.message}>
                                        <Input {...register('initialStock')} type="number" min="0" placeholder="0" />
                                    </FormItem>
                                    {Number(watch('initialStock')) > 0 && (
                                        <FormItem label="Descripción (movimiento)" invalid={errors.stockDescription} errorMessage={errors.stockDescription?.message}>
                                            <textarea
                                                {...register('stockDescription')}
                                                rows={2}
                                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 outline-none transition-all resize-none"
                                                placeholder="Stock inicial al crear producto"
                                            />
                                        </FormItem>
                                    )}
                                </div>
                            )}

                            {/* ── Ajuste de Stock (modo editar) ── */}
                            {mode === 'edit' && initialValues && (
                                <div className="border border-emerald-200 bg-gradient-to-br from-emerald-50/60 to-teal-50/40 rounded-xl p-4 mt-1 transition-all">
                                    {/* Header con stock actual */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-emerald-100 rounded-lg">
                                                <HiOutlineCube className="text-emerald-600 text-lg" />
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-gray-800">Inventario</span>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <span className="text-xs text-gray-500">Stock global:</span>
                                                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded transition-all ${currentStock <= (initialValues.stockMin || 0)
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-emerald-100 text-emerald-700'
                                                        }`}>
                                                        {currentStock} uds
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {!stockAdjustOpen && (
                                            <Button
                                                size="xs"
                                                variant="solid"
                                                className="!bg-emerald-600 hover:!bg-emerald-700"
                                                icon={<HiPlus />}
                                                onClick={() => setStockAdjustOpen(true)}
                                                type="button"
                                            >
                                                Ajustar
                                            </Button>
                                        )}
                                    </div>

                                    {/* Panel expandible */}
                                    {stockAdjustOpen && (
                                        <div className="space-y-3 pt-3 border-t border-emerald-200/60 animate-fadeIn">
                                            {/* Tipo de ajuste */}
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setStockAdjustType('IN')}
                                                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all border ${stockAdjustType === 'IN'
                                                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-200'
                                                        : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-600'
                                                        }`}
                                                >
                                                    <HiPlus className="text-sm" /> Ingreso
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setStockAdjustType('OUT')}
                                                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all border ${stockAdjustType === 'OUT'
                                                        ? 'bg-red-500 text-white border-red-500 shadow-sm shadow-red-200'
                                                        : 'bg-white text-gray-600 border-gray-200 hover:border-red-300 hover:text-red-500'
                                                        }`}
                                                >
                                                    <HiMinus className="text-sm" /> Salida
                                                </button>
                                            </div>

                                            {/* Ubicación */}
                                            <div>
                                                <label className="text-xs font-medium text-gray-600 mb-1 block">Ubicación</label>
                                                <Select
                                                    options={(() => {
                                                        const tiendas = warehouses.filter(w => w.type === 'tienda')
                                                        const bodegas = warehouses.filter(w => w.type !== 'tienda')
                                                        return [
                                                            { label: '🏪 Tiendas', options: tiendas.map(w => ({ value: String(w.id), label: w.name, type: w.type })) },
                                                            { label: '📦 Bodegas', options: bodegas.map(w => ({ value: String(w.id), label: w.name, type: w.type })) }
                                                        ].filter(g => g.options.length > 0)
                                                    })()}
                                                    value={warehouses.map(w => ({ value: String(w.id), label: w.name })).find(o => o.value === stockAdjustWarehouse) || null}
                                                    onChange={val => setStockAdjustWarehouse(val?.value || '')}
                                                    placeholder={warehousesLoading ? 'Cargando...' : 'Seleccione ubicación'}
                                                    isDisabled={warehousesLoading}
                                                    isLoading={warehousesLoading}
                                                    size="sm"
                                                    formatOptionLabel={(option) => (
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs">{option.label}</span>
                                                            {option.type && (
                                                                <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${option.type === 'tienda' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                                    {option.type === 'tienda' ? 'POS' : 'Almacén'}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                />
                                            </div>

                                            {/* Cantidad + Descripción */}
                                            <div className="grid grid-cols-3 gap-2">
                                                <div className="col-span-1">
                                                    <label className="text-xs font-medium text-gray-600 mb-1 block">Cantidad</label>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        size="sm"
                                                        placeholder="0"
                                                        value={stockAdjustQty}
                                                        onChange={e => setStockAdjustQty(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="text-xs font-medium text-gray-600 mb-1 block">Motivo (opcional)</label>
                                                    <Input
                                                        size="sm"
                                                        placeholder="Ej: Reabastecimiento"
                                                        value={stockAdjustDesc}
                                                        onChange={e => setStockAdjustDesc(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            {/* Acciones */}
                                            <div className="flex items-center justify-end gap-2 pt-1">
                                                <Button
                                                    size="xs"
                                                    type="button"
                                                    onClick={() => {
                                                        setStockAdjustOpen(false)
                                                        setStockAdjustQty('')
                                                        setStockAdjustDesc('')
                                                    }}
                                                    disabled={stockAdjustLoading}
                                                >
                                                    Cancelar
                                                </Button>
                                                <Button
                                                    size="xs"
                                                    variant="solid"
                                                    type="button"
                                                    loading={stockAdjustLoading}
                                                    className={stockAdjustType === 'IN' ? '!bg-emerald-600 hover:!bg-emerald-700' : '!bg-red-500 hover:!bg-red-600'}
                                                    onClick={handleStockAdjust}
                                                >
                                                    {stockAdjustType === 'IN' ? 'Agregar stock' : 'Retirar stock'}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
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
                                {/* Hidden file input for programmatic trigger */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <div
                                    className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center min-h-[160px] relative transition-colors ${isDragging ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-gray-50'
                                        }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    {preview ? (
                                        <div className="relative group w-full h-full flex flex-col items-center">
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="max-h-[120px] object-contain rounded"
                                            />
                                            <div className="flex items-center gap-2 mt-3">
                                                <Button
                                                    size="xs"
                                                    variant="solid"
                                                    icon={<HiPhotograph />}
                                                    onClick={handleChangeImageClick}
                                                    type="button"
                                                >
                                                    Cambiar
                                                </Button>
                                                <Button
                                                    size="xs"
                                                    variant="solid"
                                                    color="red-600"
                                                    icon={<HiTrash />}
                                                    onClick={handleRemoveImage}
                                                    type="button"
                                                >
                                                    Eliminar
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            className="text-center cursor-pointer w-full h-full"
                                            onClick={handleChangeImageClick}
                                        >
                                            <HiOutlineCloudUpload className="text-4xl text-gray-400 mx-auto mb-2" />
                                            <p className="text-xs text-gray-500 mb-1">Arrastra o haz clic para subir</p>
                                            <p className="text-xs text-gray-400">JPG, PNG, WEBP — Máx 2MB</p>
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
