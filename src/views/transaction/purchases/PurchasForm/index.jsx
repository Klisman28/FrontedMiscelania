import React, { forwardRef, useEffect, useRef } from 'react'
import { FormContainer, Button, Card } from 'components/ui'
import { StickyFooter } from 'components/shared'
import BasicInfoFields from './BasicInfoFields'
import OrderProducts from './OrderProducts'
import { AiOutlineSave } from 'react-icons/ai'
import { HiOutlineTrash, HiOutlineShoppingCart } from 'react-icons/hi'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { injectReducer } from 'store/index'
import reducer from './store'
import { getSuppliers } from './store/formSlice'
import { getWarehouses } from 'store/warehouses/warehousesSlice'
import warehousesReducer from 'store/warehouses/warehousesSlice'
import SearchProduct from './components/SearchProducts'
import ProductQuickAddBar from './components/ProductQuickAddBar'
import KeyboardShortcutsHelper from './components/KeyboardShortcutsHelper'
import PaymentSummary from './components/PaymentSummary'
import OptionsFields from './OptionsFields'
import ProductCatalogue from './components/ProductCatalogue'

import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

injectReducer('purchasForm', reducer)
injectReducer('warehouses', warehousesReducer)

const productsSchema = Yup.object({
    name: Yup.string(),
    brand: Yup.string(),
    unit: Yup.string(),
    productId: Yup.number().required(),
    quantity: Yup.number().positive('Ingrese un número mayor a 0').required("Es requerido"),
    cost: Yup.number().required(),
    subtotal: Yup.number().required()
});

const validationSchema = Yup.object().shape({
    warehouseId: Yup.number().required("Seleccione una bodega"),
    supplier: Yup.object({
        value: Yup.string().required("El proveedor es requerido"),
        label: Yup.string().required("El proveedor es requerido")
    }),
    products: Yup.array().of(productsSchema).min(1, "¡Seleccionar al menos un producto!"),
    applyIgv: Yup.boolean(),
    dateIssue: Yup.date().required("La fecha es requerida")
})

const PurchasForm = forwardRef((props, ref) => {

    const { typeAction, initialData, onFormSubmit, onDiscard } = props
    const formRef = useRef(null)
    const dispatch = useDispatch()

    // Selectors
    const warehouseList = useSelector((state) => state.warehouses?.warehouses || [])

    const {
        formState: { errors, isSubmitting },
        handleSubmit,
        control,
        setValue,
        getValues,
        watch,
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(validationSchema),
        defaultValues: initialData
    })

    // Watch products for live total calculation (igual que en Ventas)
    const watchedProducts = watch('products', [])
    const totalAmount = watchedProducts.reduce((acc, curr) => acc + (parseFloat(curr.subtotal) || 0), 0)

    const { fields, append, remove } = useFieldArray({
        control,
        name: "products"
    })

    const handleChangeQuantity = (index, increse = true) => {
        const qty = parseInt(getValues(`products.${index}.quantity`));
        const indexText = `products.${index}.quantity`;

        if (increse) {
            setValue(indexText, (qty + 1));
        } else {
            if (qty > 1) {
                setValue(indexText, (qty - 1));
            }
        }

        const newQty = parseInt(getValues(`products.${index}.quantity`))
        const cost = parseFloat(getValues(`products.${index}.cost`))
        const subtotal = newQty * cost
        setValue(`products.${index}.subtotal`, subtotal);
    }

    const handleAppendProduct = (product) => {
        const index = fields.findIndex(item => item.productId === product.id);

        if (index === -1) {
            const cost = parseFloat(product.cost ?? product.price ?? 0)
            const brandName = typeof product.brand === 'object' ? product.brand?.name : product.brand
            const unitSymbol = typeof product.unit === 'object' ? product.unit?.symbol : product.unit

            append({
                name: product.name,
                brand: brandName || '',
                unit: unitSymbol || '',
                productId: product.id,
                quantity: 1,
                cost: cost,
                subtotal: cost,
            })
        } else {
            handleChangeQuantity(index, true);
        }
    }

    useEffect(() => {
        dispatch(getSuppliers())
        dispatch(getWarehouses())
    }, [dispatch])

    // Atajo de teclado Ctrl+Enter para guardar
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault()
                formRef.current?.requestSubmit()
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [])

    // Bodega actualmente seleccionada (para el chip del header)
    const selectedWarehouse = warehouseList.find(w => w.id === watch('warehouseId'))

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} ref={formRef}>
            <FormContainer className="purchase-form">
                {/* Grid principal: 2 columnas (igual a Ventas) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ═══════════════════════════════════════════
                        PANEL IZQUIERDO: Búsqueda + Atajos
                        (equivalente al catálogo de Ventas)
                    ═══════════════════════════════════════════ */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <Card
                            className="flex-1 shadow-sm border-gray-200 h-full flex flex-col"
                            bodyClass="flex flex-col h-full"
                        >
                            {/* Header: Atajos + Chip de bodega */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                <div className="flex-1">
                                    <KeyboardShortcutsHelper />
                                </div>
                                <div className="flex items-center self-start sm:self-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full shrink-0">
                                    <span className={`w-2 h-2 rounded-full ${selectedWarehouse ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wide truncate max-w-[180px]">
                                        {selectedWarehouse?.name || 'Sin bodega'}
                                    </span>
                                </div>
                            </div>

                            {/* Barra de búsqueda rápida */}
                            <div className="mb-2 relative z-20">
                                <ProductQuickAddBar
                                    handleAppendProduct={handleAppendProduct}
                                    currentProducts={fields}
                                    warehouseId={watch('warehouseId')}
                                    autoFocus={true}
                                />
                            </div>

                            {/* Catálogo visual filtrado por bodega */}
                            <div className="flex-1 min-h-0">
                                <ProductCatalogue
                                    onProductSelect={handleAppendProduct}
                                    warehouseId={watch('warehouseId')}
                                />
                            </div>
                        </Card>
                    </div>

                    {/* ═══════════════════════════════════════════
                        PANEL DERECHO: Documento + Orden + Totales
                    ═══════════════════════════════════════════ */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm sticky top-4 flex flex-col overflow-hidden">

                            {/* Header del panel con gradiente indigo */}
                            <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-3.5 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <HiOutlineShoppingCart className="text-white/90 text-lg" />
                                    <span className="text-sm font-bold text-white tracking-wide">
                                        Orden de Compra
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-white/20 px-2.5 py-1 rounded-full">
                                    <span className="text-xs font-bold text-white tabular-nums">
                                        {fields.length}
                                    </span>
                                    <span className="text-[10px] text-white/80 font-medium">
                                        {fields.length === 1 ? 'item' : 'items'}
                                    </span>
                                </div>
                            </div>

                            {/* 1. Información de Compra */}
                            <div className="p-4 sm:p-5">
                                <BasicInfoFields
                                    control={control}
                                    errors={errors}
                                    setValue={setValue}
                                    watch={watch}
                                />
                            </div>

                            {/* Divisor */}
                            <div className="border-t border-slate-100" />

                            {/* 2. Lista de productos */}
                            <div className="flex-1 overflow-y-auto min-h-[200px] bg-slate-50/30">
                                <OrderProducts
                                    errors={errors}
                                    fields={fields}
                                    remove={remove}
                                    control={control}
                                    watch={watch}
                                    setValue={setValue}
                                    getValues={getValues}
                                    handleChangeQuantity={handleChangeQuantity}
                                />
                            </div>

                            {/* Divisor */}
                            <div className="border-t border-slate-100" />

                            {/* 3. SAT toggle + Totales */}
                            <div className="p-4 sm:p-5 space-y-3 bg-white">
                                <OptionsFields control={control} />
                                <PaymentSummary watch={watch} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════
                    STICKY FOOTER: Botón GUARDAR COMPRA
                    (equivalente al botón COBRAR de Ventas)
                ═══════════════════════════════════════════ */}
                <StickyFooter
                    className="-mx-8 px-8 flex items-center justify-between py-4 bg-white border-t border-gray-200 shadow-upper"
                    stickyClass="border-t bg-white border-gray-200 shadow-upper"
                >
                    {/* Izquierda: contador + descartar */}
                    <div className="flex items-center">
                        <div className="md:flex items-center gap-4">
                            <div className="hidden md:block text-gray-500 text-sm">
                                {watchedProducts.length} productos en compra
                            </div>
                            <Button
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                icon={<HiOutlineTrash />}
                                onClick={() => onDiscard?.()}
                                type="button"
                            >
                                Descartar
                            </Button>
                        </div>
                    </div>

                    {/* Derecha: botón GUARDAR COMPRA grande con total */}
                    <div className="md:flex items-center gap-4">
                        <Button
                            size="lg"
                            variant="solid"
                            loading={isSubmitting}
                            icon={<HiOutlineShoppingCart className="text-xl" />}
                            className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white min-w-[200px] shadow-lg hover:shadow-indigo-500/50 transition-all transform hover:-translate-y-0.5 rounded-xl text-lg font-bold tracking-wide"
                            type="submit"
                        >
                            <span className="mr-2">
                                {typeAction === 'create' ? 'GUARDAR COMPRA' : 'ACTUALIZAR'}
                            </span>
                            <span className="bg-white/20 px-2 py-0.5 rounded text-white font-mono text-base tabular-nums">
                                Q{totalAmount.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </Button>
                    </div>
                </StickyFooter>
            </FormContainer>
        </form>
    )
})

PurchasForm.defaultProps = {
    initialData: {
        warehouseId: null,
        supplier: {},
        dateIssue: '',
        products: [],
        applyIgv: false,
    },
    typeAction: 'create'
}

export default PurchasForm