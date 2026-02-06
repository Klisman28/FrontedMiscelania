import React, { useRef, useState, useEffect } from 'react'
import { FormContainer, Button, Card } from 'components/ui'
import { StickyFooter } from 'components/shared'
import { AiOutlineSave } from 'react-icons/ai'
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
import ReceiptPrintView from '../shared/PrintBoleta'
import SaleFormC from '../SaleForm/store/SaleForm.css'
// import ProductsSidebar from './components/ProductsSidebar' // Si lo usas
// import OptionsFields from './OptionsFields'               // Si lo usas

import { injectReducer } from 'store/index'
import reducer from './store'

injectReducer('saleForm', reducer)



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
const validationSchema = Yup.object().shape({
    warehouseId: Yup.number().required("Seleccione una bodega"),
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
})

const SaleForm = (props) => {
    const { typeAction, initialData, onFormSubmit, onDiscard } = props
    const printRef = useRef(null)
    const formRef = useRef(null)
    const [printData, setPrintData] = useState(null)

    // Creamos la ref local para apuntar al <form> que se va a imprimir

    // Ejemplo de data que quisieras imprimir

    // Inicializamos react-hook-form
    const handleSaveAndIncrement = (data) => {
        // Primero ejecutamos la lógica original de guardado
        onFormSubmit(data);

        // Luego incrementamos el ticket para la próxima vez
        incrementarTicket(setValue, data.number);
    };
    const {
        formState: { errors },
        handleSubmit,
        control,
        setValue,
        getValues,
        watch,
        resetField,
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(validationSchema),
        defaultValues: initialData
    })

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


    return (
        <form ref={formRef} onSubmit={handleSubmit(handleSaveAndIncrement)} >
            <FormContainer className="sale-form">
                {/* Contenedor principal con varias columnas */}
                <div className="sf-layout">

                    {/* Panel lateral (opcional) */}
                    {/* <ProductsSidebar handleAppendProduct={handleAppendProduct} /> */}

                    <Card className="sf-left-card">
                        {/* Helper de atajos de teclado */}
                        <KeyboardShortcutsHelper />

                        {/* Barra de búsqueda/escaneo tipo POS (nuevo flujo principal) */}
                        <div className="sf-search mb-4">
                            <ProductQuickAddBar
                                handleAppendProduct={handleAppendProduct}
                                currentProducts={fields}
                                warehouseId={watch('warehouseId')}
                                autoFocus={true}
                            />
                            {/* Modal de búsqueda avanzada (fallback opcional) */}
                            <div className="mt-2">
                                <SearchProduct handleAppendProduct={handleAppendProduct}>
                                    <Button
                                        size="sm"
                                        variant="plain"
                                        className="w-full text-sm"
                                    >
                                        o buscar con filtros avanzados...
                                    </Button>
                                </SearchProduct>
                            </div>
                        </div>
                        <div className="sf-content">
                            {/* Lista de productos en la orden */}
                            <div className="sf-products-list" >
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

                            {/* Opciones de IGV / Resumen de pago */}
                            <div className="sf-subtotal-row">
                                <PaymentSummary control={control} watch={watch} />
                            </div>

                        </div>
                    </Card>

                    {/* Columna derecha: información básica del comprobante */}
                    <div className="sf-right-panel hide-on-print">
                        <BasicInfoFields
                            control={control}
                            errors={errors}
                            setValue={setValue}
                            watch={watch}
                            resetField={resetField}
                        />
                    </div>
                </div>

                {/* Footer con botones de acción */}
                <StickyFooter
                    className="-mx-8 px-8 flex items-center justify-end py-4"
                    stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                >
                    <div className="md:flex sm:flex-row sm:flex-wrap items-center hide-on-print">
                        {/* Botón Descartar */}
                        <Button
                            size="sm"
                            className="ltr:mr-1 rtl:ml-1"
                            onClick={() => onDiscard?.()}
                            type="button"
                        >
                            Descartar
                        </Button>

                        {/* Botón para imprimir */}
                        <Button
                            size="sm"
                            className="ltr:mr-1 rtl:ml-1"
                            onClick={onClickPrint}
                            type="button"
                        >
                            Imprimir
                            <div style={{ display: 'none' }}>
                                <ReceiptPrintView data={printData} ref={printRef} />
                            </div>
                        </Button>

                        {/* Botón para guardar */}
                        <Button
                            size="sm"
                            variant="solid"
                            loading={false}
                            icon={<AiOutlineSave />}
                            type="submit"
                        >
                            {typeAction === 'create' ? ' Guardar' : 'Actualizar'}
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
