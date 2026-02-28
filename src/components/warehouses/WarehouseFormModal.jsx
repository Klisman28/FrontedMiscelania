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
    active: yup.boolean(),
    type: yup.string().oneOf(['tienda', 'bodega']).required('El tipo es requerido')
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
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            name: '',
            address: '',
            code: '',
            active: true,
            type: 'bodega'
        }
    })

    const watchedType = watch('type')

    useEffect(() => {
        if (selectedWarehouse) {
            setValue('name', selectedWarehouse.name)
            setValue('address', selectedWarehouse.address)
            setValue('code', selectedWarehouse.code)
            setValue('active', selectedWarehouse.active !== undefined ? selectedWarehouse.active : true)
            setValue('type', selectedWarehouse.type || 'bodega')
        } else {
            reset({
                name: '',
                address: '',
                code: '',
                active: true,
                type: 'bodega'
            })
        }
    }, [selectedWarehouse, setValue, reset])

    const onSubmit = async (values) => {
        try {
            if (selectedWarehouse) {
                await dispatch(updateWarehouse({ id: selectedWarehouse.id, data: values })).unwrap()
                toast.push(
                    <Notification title="Éxito" type="success">
                        Ubicación actualizada exitosamente.
                    </Notification>
                )
            } else {
                await dispatch(createWarehouse(values)).unwrap()
                toast.push(
                    <Notification title="Éxito" type="success">
                        Ubicación creada exitosamente.
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
                <h5 className="mb-4">{selectedWarehouse ? 'Editar Ubicación' : 'Nueva Ubicación'}</h5>
                <div className="max-h-[65vh] overflow-y-auto">
                    <FormContainer>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* ─── Type Selector (Tienda / Bodega) ─── */}
                            <FormItem
                                label="Tipo de Ubicación"
                                invalid={errors.type}
                                errorMessage={errors.type?.message}
                            >
                                <Controller
                                    control={control}
                                    name="type"
                                    render={({ field }) => (
                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => field.onChange('tienda')}
                                                className={`flex-1 py-2.5 px-4 rounded-xl border-2 text-sm font-semibold transition-all ${field.value === 'tienda'
                                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                                                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                                                    }`}
                                            >
                                                🏪 Tienda (POS)
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => field.onChange('bodega')}
                                                className={`flex-1 py-2.5 px-4 rounded-xl border-2 text-sm font-semibold transition-all ${field.value === 'bodega'
                                                    ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-sm'
                                                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                                                    }`}
                                            >
                                                📦 Bodega
                                            </button>
                                        </div>
                                    )}
                                />
                            </FormItem>
                            <FormItem
                                label={watchedType === 'tienda' ? 'Nombre de la Tienda' : 'Nombre de la Bodega'}
                                invalid={errors.name}
                                errorMessage={errors.name?.message}
                            >
                                <Input
                                    type="text"
                                    placeholder={watchedType === 'tienda' ? 'Ej. Tienda Centro' : 'Ej. Bodega Central'}
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
