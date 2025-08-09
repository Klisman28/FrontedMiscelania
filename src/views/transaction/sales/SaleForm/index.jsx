import React, { useRef, useState } from 'react'
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
import PaymentSummary from './components/PaymentSummary'
import ReceiptPrintView from '../shared/PrintBoleta'
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
        <form onSubmit={handleSubmit(handleSaveAndIncrement)} >
            <FormContainer className="mx-auto p-0 m-0 max-w-full">
                {/* Contenedor principal con varias columnas */}
                <div className="lg:flex lg:gap-6">

                    {/* Panel lateral (opcional) */}
                    {/* <ProductsSidebar handleAppendProduct={handleAppendProduct} /> */}

                    <Card  className="   w-full md:w-11/12 lg:w-9/12    p-3 lg:p-4  border border-gray-200shadow-none receipt-layout  *:first-letter:mx-auto  ">                        {/* Búsqueda rápida de productos */}
                        <SearchProduct handleAppendProduct={handleAppendProduct} />

                        <div className="flex flex-col ">
                            {/* Lista de productos en la orden */}
                            <div className="mb-4 lg:mb-0  overflow-y-auto min-h-[225px]   " style={{ minHeight: '225px' }}>
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
                            <div className="lg:w-80 flex-shrink-0">
                                <PaymentSummary control={control} watch={watch} />
                            </div>
                        </div>
                    </Card>

                    {/* Columna derecha: información básica del comprobante */}
                    <div className="2xl:w-10/12 xxl:w-10/12 sm:w-1/2    md:w-10/12    lg:w-10/12   flex-none hide-on-print  px-0 sm:px-2  ">
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
