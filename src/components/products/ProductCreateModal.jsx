import React, { useEffect } from 'react'
import { Dialog, FormContainer, FormItem, Input, Button, Notification, toast } from 'components/ui'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { createProduct, resetCreateState } from 'store/products/productsSlice'

const validationSchema = yup.object().shape({
    name: yup.string().required('El nombre es requerido'),
    sku: yup.string().required('El SKU es requerido'),
    cost: yup.number().typeError('Debe ser un número').required('El costo es requerido').min(0, 'Debe ser mayor o igual a 0'),
    price: yup.number().typeError('Debe ser un número').required('El precio es requerido').min(0, 'Debe ser mayor o igual a 0')
        .test('price-gte-cost', 'El precio debe ser mayor o igual al costo', function (value) {
            const { cost } = this.parent
            return value >= cost
        })
})

const ProductCreateModal = ({ isOpen, onClose, onProductCreated }) => {
    const dispatch = useDispatch()
    const { creating, createSuccess, errorCreate, createdProduct } = useSelector((state) => state.products)

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            name: '',
            sku: '',
            cost: 0,
            price: 0
        }
    })

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
            // Handle specific error for duplicate SKU
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
        await dispatch(createProduct({
            name: values.name,
            sku: values.sku,
            cost: parseFloat(values.cost),
            price: parseFloat(values.price)
        }))
    }

    const handleClose = () => {
        dispatch(resetCreateState())
        reset()
        onClose()
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            onRequestClose={handleClose}
        >
            <div className="flex flex-col h-full justify-between">
                <h5 className="mb-4">Crear Nuevo Producto</h5>
                <FormContainer>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormItem
                            label="Nombre del Producto"
                            invalid={!!errors.name}
                            errorMessage={errors.name?.message}
                        >
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="Ej. Computadora HP 15" />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label="SKU"
                            invalid={!!errors.sku}
                            errorMessage={errors.sku?.message}
                        >
                            <Controller
                                name="sku"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="Ej. HP15-2026" />
                                )}
                            />
                        </FormItem>
                        <div className="grid grid-cols-2 gap-4">
                            <FormItem
                                label="Costo"
                                invalid={!!errors.cost}
                                errorMessage={errors.cost?.message}
                            >
                                <Controller
                                    name="cost"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} type="number" step="0.01" prefix="$" placeholder="850" />
                                    )}
                                />
                            </FormItem>
                            <FormItem
                                label="Precio de Venta"
                                invalid={!!errors.price}
                                errorMessage={errors.price?.message}
                            >
                                <Controller
                                    name="price"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} type="number" step="0.01" prefix="$" placeholder="1000" />
                                    )}
                                />
                            </FormItem>
                        </div>
                        <div className="text-right mt-6">
                            <Button
                                className="ltr:mr-2 rtl:ml-2"
                                variant="plain"
                                type="button"
                                onClick={handleClose}
                            >
                                Cancelar
                            </Button>
                            <Button variant="solid" loading={creating} type="submit">
                                Guardar
                            </Button>
                        </div>
                    </form>
                </FormContainer>
            </div>
        </Dialog>
    )
}

export default ProductCreateModal
