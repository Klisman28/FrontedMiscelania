import { useRef, useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormContainer, Button, Card } from 'components/ui'
import { StickyFooter } from 'components/shared'
import { AiOutlineSave, AiOutlineStop } from 'react-icons/ai'
import { HiOutlineCreditCard, HiOutlineTrash } from 'react-icons/hi'
import * as Yup from 'yup'
import dayjs from 'dayjs'
import { toast, Notification } from 'components/ui'
import { useForm, useFieldArray } from 'react-hook-form'
import { useReactToPrint } from 'react-to-print'
import { yupResolver } from '@hookform/resolvers/yup'
import BasicInfoFields from './BasicInfoFields'
import OrderProducts from './OrderProducts'
import SearchProduct from './components/SearchProducts'
import ProductQuickAddBar from './components/ProductQuickAddBar'
import KeyboardShortcutsHelper from './components/KeyboardShortcutsHelper'
import PaymentSummary from './components/PaymentSummary'
import ProductCatalogue from './components/ProductCatalogue'
import ReceiptPrintView from '../shared/PrintBoleta'
import SaleFormC from '../SaleForm/store/SaleForm.css'
import { getStores } from 'store/warehouses/warehousesSlice'
import warehousesReducer from 'store/warehouses/warehousesSlice'
// import ProductsSidebar from './components/ProductsSidebar' // Si lo usas
// import OptionsFields from './OptionsFields'               // Si lo usas

import { injectReducer } from 'store/index'
import reducer from './store'

injectReducer('saleForm', reducer)
injectReducer('warehouses', warehousesReducer)



// Esquema de validación para los productos
const productsSchema = Yup.object({
    name: Yup.string(),
    brand: Yup.string(),
    unit: Yup.string(),
    productId: Yup.number().required(),
    quantity: Yup.number().positive('Cantidad debe ser mayor a 0').required("Es requerido"),
    price: Yup.number().required(),
    subtotal: Yup.number().required(),
    stock: Yup.number(),
})

// Esquema de validación general
// Validation schema moved inside component to access state

const SaleForm = (props) => {
    const { typeAction, initialData, onFormSubmit, onDiscard } = props
    const printRef = useRef(null)
    const formRef = useRef(null)
    const [printData, setPrintData] = useState(null)

    // Redux
    const dispatch = useDispatch()
    const storeList = useSelector((state) => state.warehouses?.stores || [])
    const user = useSelector((state) => state.auth.user)

    // Initial Data Fetch
    // Fetch only stores (tiendas) for POS
    useEffect(() => {
        dispatch(getStores())
    }, [dispatch])

    // Creamos la ref local para apuntar al <form> que se va a imprimir

    // Ejemplo de data que quisieras imprimir

    // Esquema de validación general con acceso a estado
    const validationSchema = useMemo(() => Yup.object().shape({
        warehouseId: Yup.mixed().test('is-valid-store', 'Seleccione una tienda', (value) => {
            // Guard clause: si la lista no ha cargado, no bloqueamos
            if (Array.isArray(storeList) && storeList.length === 0) return true;

            // Aceptamos números o cadenas numéricas, pero no NaN ni null/undefined
            if (value === null || value === undefined || value === '') return false;
            return !isNaN(Number(value));
        }),
        serie: Yup.string().when('type', {
            is: (val) => val !== 'Ticket',
            then: Yup.string()
                .required("Serie es requerida")
                .matches(/[0-9]/, { message: "La serie solo admite números" })
                .min(3, "Serie demasiado corta")
                .max(3, "Serie demasiado larga")
        }),
        number: Yup.string()
            .required("Número es requerido")
            .matches(/[0-9]/, { message: "Número solo admite números" })
            .min(1, "Número demasiado corto")
            .max(3, "Número demasiado largo"),
        type: Yup.string().required("Tipo de comprobante es requerido"),
        client: Yup.object().when('type', {
            is: (val) => val !== "Ticket",
            then: Yup.object({
                value: Yup.string().required("Seleccione un cliente"),
                label: Yup.string().required("Seleccione un cliente")
            })
        }),
        products: Yup.array().of(productsSchema).min(1, "Seleccione al menos un producto"),
        applyIgv: Yup.boolean(),
        dateIssue: Yup.date().required("La fecha es requerida")
    }), [storeList])

    // Inicializamos react-hook-form
    const handleSaveAndIncrement = (data) => {
        // console.log('CLICK COBRAR')
        // console.log('PAYLOAD', data)
        // Primero ejecutamos la lógica original de guardado
        onFormSubmit(data);

        // Luego incrementamos el ticket para la próxima vez
        incrementarTicket(setValue, data.number);
    };

    const onError = (errors, e) => {
        console.log('VALIDATION ERRORS', errors); // Keep this for visibility on errors
        let message = "Revise los campos requeridos";
        if (errors.products) {
            message = "Agrega al menos un producto válido";
        } else if (errors.warehouseId) {
            message = "Seleccione una tienda (o no se pudo determinar automáticamente)";
        } else if (errors.client) {
            message = "Seleccione un cliente válido";
        }

        toast.push(
            <Notification title="Error de Validación" type="danger" duration={3000}>
                {message}
            </Notification>,
            { placement: 'top-center' }
        )
    };
    const {
        formState: { errors, isSubmitting },
        handleSubmit,
        control,
        setValue,
        getValues,
        watch,
        resetField,
        register,
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(validationSchema),
        defaultValues: initialData
    })

    // Watch for changes to calculate live total for the button
    const watchedProducts = watch('products', [])
    const totalAmount = watchedProducts.reduce((acc, curr) => acc + (parseFloat(curr.subtotal) || 0), 0)

    // Register warehouseId manually since we are removing the hidden input
    useEffect(() => {
        register('warehouseId', { required: true });
    }, [register]);

    // Store Resolution Logic — solo tiendas
    useEffect(() => {
        if (Array.isArray(storeList) && storeList.length > 0) {
            // Check if form already has warehouseId
            const currentId = getValues('warehouseId')

            // Only set if not already set or invalid
            if (!currentId) {
                let targetStore = null;

                // Priority 1: User default (if valid and is a store)
                if (user?.defaultWarehouseId) {
                    targetStore = storeList.find(w => w.id === user.defaultWarehouseId && w.active)
                }

                // Priority 2: First active store
                if (!targetStore) {
                    targetStore = storeList.find(w => w.active)
                }

                if (targetStore) {
                    console.log('DEBUG: Setting default store:', targetStore.id, targetStore.name);
                    setValue('warehouseId', Number(targetStore.id), { shouldValidate: true, shouldDirty: true })
                } else {
                    console.warn('No active stores (tiendas) found.')
                }
            }
        }
    }, [storeList, user, setValue, getValues])

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

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'products'
    })

    // Manejo de la cantidad de productos
    const handleChangeQuantity = (index, increse = true) => {
        const stock = getValues(`products.${index}.stock`)
        const qty = parseInt(getValues(`products.${index}.quantity`))
        const indexText = `products.${index}.quantity`

        if (increse) {
            if (stock >= qty + 1) {
                setValue(indexText, qty + 1)
            } else {
                setValue(indexText, stock)
                toast.push(
                    <Notification title="¡Stock Limitado!" type="danger" duration={3000}>
                        La cantidad máxima que puede agregar es {stock}
                    </Notification>,
                    { placement: 'top-center' }
                )
            }
        } else {
            if (qty > 1) {
                setValue(indexText, qty - 1)
            }
        }

        const newQty = parseInt(getValues(`products.${index}.quantity`))
        const price = parseFloat(getValues(`products.${index}.price`))
        const subtotal = newQty * price
        setValue(`products.${index}.subtotal`, subtotal)
    }

    // Agregar un producto a la lista
    const handleAppendProduct = (product) => {
        const index = fields.findIndex(item => item.productId === product.id)
        if (index === -1) {
            append({
                name: product.name,
                brand: product.brand.name,
                unit: product.unit.symbol,
                productId: product.id,
                quantity: 1,
                price: parseFloat(product.price),
                subtotal: parseFloat(product.price),
                stock: parseInt(product.stock),
                description: product.description
            })
        } else {
            // Si ya existe, incrementamos la cantidad
            handleChangeQuantity(index, true)
        }
    }

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    })

    function incrementarTicket(setValue, numeroActual) {
        // Convierte a número, suma 1, y vuelve a formatear con ceros a la izquierda (mínimo 5 dígitos)
        const siguiente = String(Number(numeroActual) + 1).padStart(String(numeroActual).length, '0')
        setValue('number', siguiente)
    }

    const onClickPrint = () => {
        const data = getValues()
        // data.serie, data.number, data.client, etc.

        // Por ejemplo, usar la serie y número para el comprobante
        // y el label de 'client' como clienteNombre
        const newPrintData = {
            comprobante: `${data.serie}-${data.number}`, // "001-1"
            fecha: dayjs(data.dateIssue).format('DD/MM/YYYY'), // convierte la fecha al formato que quieras
            clienteNombre: data.client?.label || 'Consumidor Final',
            clienteRtn: data.client?.value || '0000000000000',
            productos: data.products.map((p) => ({
                cantidad: p.quantity,
                precio: p.price,
                descripcion: p.name,
                total: p.subtotal,
            })),
            subtotal: data.products.reduce((acc, curr) => acc + curr.subtotal, 0),
            total: data.products.reduce((acc, curr) => acc + curr.subtotal, 0),
        }

        setPrintData(newPrintData)
        handlePrint()
    }

    const onPreSubmit = async () => {
        let wId = getValues('warehouseId')

        console.log('DEBUG: val just before submit:', wId, typeof wId)

        // Fix 1: Emergency fallback if null but stores available
        if (!wId && Array.isArray(storeList) && storeList.length > 0) {
            const fallback = storeList.find(w => w.active) || storeList[0];
            if (fallback) {
                console.log('DEBUG: Emergency fallback applied:', fallback.id)
                setValue('warehouseId', Number(fallback.id), { shouldValidate: true })
                wId = fallback.id
            }
        }

        // Fix 2: Force number type if it's a string
        if (wId !== null && wId !== undefined) {
            const numId = Number(wId)
            if (!isNaN(numId)) {
                setValue('warehouseId', numId, { shouldValidate: true })
            }
        }

        await handleSubmit(handleSaveAndIncrement, onError)()
    }


    return (
        <form ref={formRef} onSubmit={(e) => e.preventDefault()} >
            {/* Hidden input removed to avoid validation conflicts with manual registration */}
            <FormContainer className="sale-form">
                {/* Contenedor principal con varias columnas */}
                {/* Contenedor principal Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Columna Izquierda: Búsqueda y Catálogo (2 columnas) */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <Card className="flex-1 shadow-sm border-gray-200 h-full flex flex-col" bodyClass="flex flex-col h-full">

                            {/* Header: Atajos + Bodega */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                <div className="flex-1">
                                    <KeyboardShortcutsHelper />
                                </div>
                                <div className="flex items-center self-start sm:self-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-full shrink-0">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                                    <span className="text-xs font-bold text-slate-600 dark:text-gray-300 uppercase tracking-wide truncate max-w-[180px]">
                                        {storeList.find(w => w.id === watch('warehouseId'))?.name || 'Sin tienda'}
                                    </span>
                                </div>
                            </div>

                            {/* Barra de búsqueda */}
                            <div className="mb-2 relative z-20">
                                <ProductQuickAddBar
                                    handleAppendProduct={handleAppendProduct}
                                    currentProducts={fields}
                                    warehouseId={watch('warehouseId')}
                                    autoFocus={true}
                                />
                                <div className="mt-2 text-center absolute right-0 top-full hidden">
                                    {/* Ocultamos el link de filtros avanzados por ahora para limpiar UI, o lo movemos dentro del search */}
                                </div>
                            </div>

                            {/* Catálogo Visual */}
                            <div className="flex-1 min-h-0">
                                <ProductCatalogue onProductSelect={handleAppendProduct} />
                            </div>
                        </Card>
                    </div>

                    {/* Columna Derecha: Recibo / Orden (1 columna) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm sticky top-4 flex flex-col h-full overflow-hidden">

                            {/* Header con gradiente — igual a Compras */}
                            <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-3.5 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <HiOutlineCreditCard className="text-white/90 text-lg" />
                                    <span className="text-sm font-bold text-white tracking-wide">
                                        Orden de Venta
                                    </span>
                                </div>
                                {/* Badge contador de items */}
                                <div className="flex items-center gap-1.5 bg-white/20 px-2.5 py-1 rounded-full">
                                    <span className="text-xs font-bold text-white tabular-nums">
                                        {fields.length}
                                    </span>
                                    <span className="text-[10px] text-white/80 font-medium">
                                        {fields.length === 1 ? 'item' : 'items'}
                                    </span>
                                </div>
                            </div>

                            {/* 1. Info del Ticket */}
                            <div className="p-4 sm:p-5">
                                <BasicInfoFields
                                    control={control}
                                    errors={errors}
                                    setValue={setValue}
                                    watch={watch}
                                    resetField={resetField}
                                />
                            </div>

                            {/* Divisor */}
                            <div className="border-t border-slate-100" />

                            {/* 2. Lista de Productos */}
                            <div className="flex-1 overflow-y-auto min-h-[280px] bg-slate-50/30">
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

                            {/* 3. Totales + SAT */}
                            <div className="p-4 sm:p-5 bg-white">
                                <PaymentSummary control={control} watch={watch} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer con botones de acción POS */}
                <StickyFooter
                    className="-mx-8 px-8 flex items-center justify-between py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-upper"
                    stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-upper"
                >
                    <div className="flex items-center">
                        <div className="md:flex items-center gap-4">
                            <div className="hidden md:block text-gray-500 text-sm">
                                {watchedProducts.length} productos en orden
                            </div>
                            <Button
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                icon={<HiOutlineTrash />}
                                onClick={() => onDiscard?.()}
                                type="button"
                            >
                                Cancelar
                            </Button>
                        </div>
                    </div>

                    <div className="md:flex items-center gap-4">
                        <Button
                            size="lg"
                            variant="solid"
                            loading={isSubmitting}
                            icon={<HiOutlineCreditCard className="text-xl" />}
                            className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white min-w-[200px] shadow-lg hover:shadow-indigo-500/50 transition-all transform hover:-translate-y-0.5 rounded-xl text-lg font-bold tracking-wide"
                            type="button"
                            onClick={onPreSubmit}
                        >
                            <span className="mr-2">COBRAR</span>
                            <span className="bg-white/20 px-2 py-0.5 rounded text-white font-mono text-base">
                                Q{totalAmount.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </Button>
                    </div>
                </StickyFooter>
            </FormContainer>
        </form>
    )
}

// Valores por defecto
SaleForm.defaultProps = {
    initialData: {
        warehouseId: null,
        serie: '001',
        number: '000001',
        type: 'Ticket',
        client: {},
        dateIssue: dayjs(new Date()).toDate(),
        products: [],
        applyIgv: false,
    },
    typeAction: 'create'
}

export default SaleForm
