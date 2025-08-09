import React, { forwardRef, useEffect } from 'react'
import { FormContainer, Button } from 'components/ui'
import { StickyFooter, Container } from 'components/shared'
import BasicInfoFields from './BasicInfoFields'
import OrderProducts from './OrderProducts'
import { AiOutlineSave } from 'react-icons/ai'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { injectReducer } from 'store/index'
import reducer from './store'
import { getSuppliers } from './store/formSlice'
import SearchProduct from './components/SearchProducts'
import PaymentSummary from './components/PaymentSummary'
import OptionsFields from './OptionsFields'


import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

injectReducer('purchasForm', reducer)

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

    const dispatch = useDispatch()

    const {
        formState: { errors },
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

    // console.log(errors);

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
            append({
                name: product.name,
                brand: product.brand.name,
                unit: product.unit.symbol,
                productId: product.id,
                quantity: 1,
                cost: parseFloat(product.cost),
                subtotal: parseFloat(product.cost),
            })
        } else {
            handleChangeQuantity(index, true);
        }
    }

    useEffect(() => {
        dispatch(getSuppliers())
    }, [dispatch])

    return (
        <Container className="h-full">
            <div className="mb-4">
                <div className="flex items-center mb-2">
                    <h3>
                        <span>Registrar Compra</span>
                    </h3>
                </div>
            </div>
            <form onSubmit={handleSubmit(onFormSubmit)} ref={ref}>
                <FormContainer>
                    <div className="xl:flex gap-4">
                        <div className="w-full">
                            <div>
                                <SearchProduct handleAppendProduct={handleAppendProduct} />
                            </div>
                            <div className="mb-4 text-black" style={{ minHeight: '225px' }}>

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

                            <div className="xl:grid grid-cols-2 gap-4">
                                <OptionsFields control={control} />
                                <PaymentSummary watch={watch} />
                            </div>
                            {/* <Activity data={data.activity} /> */}
                        </div>
                        <div className="xl:max-w-[360px] w-full">
                            <BasicInfoFields control={control} errors={errors} setValue={setValue} watch="" />
                        </div>
                    </div>
                    <StickyFooter
                        className="-mx-8 px-8 flex items-center justify-end py-4"
                        stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    >
                        <div className="md:flex items-center">
                            <Button
                                size="sm"
                                className="ltr:mr-3 rtl:ml-3"
                                onClick={() => onDiscard?.()}
                                type="button"
                            >
                                Descartar
                            </Button>
                            <Button
                                size="sm"
                                variant="solid"
                                loading={false}
                                icon={<AiOutlineSave />}
                                type="submit"
                            >
                                {(typeAction === 'create') ? ' Guardar' : 'Actualizar'}
                            </Button>
                        </div>
                    </StickyFooter>
                </FormContainer>
            </form>
        </Container>
    )
})

PurchasForm.defaultProps = {
    initialData: {
        supplier: {},
        dateIssue: '',
        products: [],
        applyIgv: false,
    },
    typeAction: 'create'
}

export default PurchasForm