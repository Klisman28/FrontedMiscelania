import React, { useEffect } from 'react'
import { Dialog, FormContainer, FormItem, Input, Button, Notification, toast, Switcher } from 'components/ui'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { createWarehouse, updateWarehouse, getWarehouses, setSelectedWarehouse } from 'store/warehouses/warehousesSlice'

const validationSchema = yup.object().shape({
    name: yup.string().required('El nombre es requerido'),
    address: yup.string().nullable(),
    code: yup.string().nullable(),
    active: yup.boolean()
})

const WarehouseFormModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch()
    const selectedWarehouse = useSelector((state) => state.warehouses.selectedWarehouse)
    const { loading } = useSelector((state) => state.warehouses)

    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            name: '',
            address: '',
            code: '',
            active: true
        }
    })

    useEffect(() => {
        if (selectedWarehouse) {
            setValue('name', selectedWarehouse.name)
            setValue('address', selectedWarehouse.address)
            setValue('code', selectedWarehouse.code)
            setValue('active', selectedWarehouse.active !== undefined ? selectedWarehouse.active : true)
        } else {
            reset({
                name: '',
                address: '',
                code: '',
                active: true
            })
        }
    }, [selectedWarehouse, setValue, reset])

    const onSubmit = async (values) => {
        try {
            if (selectedWarehouse) {
                await dispatch(updateWarehouse({ id: selectedWarehouse.id, data: values })).unwrap()
                toast.push(
                    <Notification title="Éxito" type="success">
                        Bodega actualizada exitosamente.
                    </Notification>
                )
            } else {
                await dispatch(createWarehouse(values)).unwrap()
                toast.push(
                    <Notification title="Éxito" type="success">
                        Bodega creada exitosamente.
                    </Notification>
                )
            }
            dispatch(getWarehouses())
            handleClose()
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    {error?.message || 'Ocurrió un error'}
                </Notification>
            )
        }
    }

    const handleClose = () => {
        dispatch(setSelectedWarehouse(null))
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
                <h5 className="mb-4">{selectedWarehouse ? 'Editar Bodega' : 'Nueva Bodega'}</h5>
                <div className="max-h-[65vh] overflow-y-auto">
                    <FormContainer>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormItem
                                label="Nombre de la Bodega"
                                invalid={errors.name}
                                errorMessage={errors.name?.message}
                            >
                                <Input
                                    type="text"
                                    placeholder="Ej. Bodega Central"
                                    {...register('name')}
                                />
                            </FormItem>
                            <FormItem
                                label="Código (Opcional)"
                                invalid={errors.code}
                                errorMessage={errors.code?.message}
                            >
                                <Input
                                    type="text"
                                    placeholder="Ej. BOD-001"
                                    {...register('code')}
                                />
                            </FormItem>
                            <FormItem
                                label="Dirección"
                                invalid={errors.address}
                                errorMessage={errors.address?.message}
                            >
                                <Input
                                    type="text"
                                    placeholder="Ej. Calle Principal 123"
                                    {...register('address')}
                                />
                            </FormItem>
                            <FormItem
                                label="Activa"
                                invalid={errors.active}
                                errorMessage={errors.active?.message}
                            >
                                <Controller
                                    control={control}
                                    name="active"
                                    render={({ field }) => (
                                        <Switcher
                                            checked={field.value}
                                            onChange={(checked) => field.onChange(checked)}
                                        />
                                    )}
                                />
                            </FormItem>
                            <div className="text-right mt-6">
                                <Button
                                    className="ltr:mr-2 rtl:ml-2"
                                    variant="plain"
                                    type="button"
                                    onClick={handleClose}
                                >
                                    Cancelar
                                </Button>
                                <Button variant="solid" loading={loading} type="submit">
                                    {selectedWarehouse ? 'Actualizar' : 'Guardar'}
                                </Button>
                            </div>
                        </form>
                    </FormContainer>
                </div>
            </div>
        </Dialog>
    )
}

export default WarehouseFormModal
