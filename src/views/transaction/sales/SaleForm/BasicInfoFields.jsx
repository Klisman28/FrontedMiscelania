import React, { useEffect } from 'react'
import { InputGroup, Input, FormItem, DatePicker } from 'components/ui'
import { useSelector, useDispatch } from 'react-redux'
import 'dayjs/locale/es'
import { Controller } from 'react-hook-form'
import { getConfig } from './store/formSlice'
import { getWarehouses } from 'store/warehouses/warehousesSlice'
import { HiOutlineTicket, HiOutlineDocumentText, HiOutlineHashtag } from 'react-icons/hi'
import classNames from 'classnames'
import CustomerSelect from 'components/sales/CustomerSelect' // Importamos el nuevo componente

const { Addon } = InputGroup

const BasicInfoFields = ({ control, errors, setValue, watch, resetField }) => {

    const dispatch = useDispatch()
    const configData = useSelector((state) => state.saleForm.data.configData)
    const watchType = watch('type', 'Ticket')

    useEffect(() => {
        dispatch(getWarehouses())
    }, [dispatch])

    useEffect(() => {
        const handleGetConfig = async () => {
            const res = await dispatch(getConfig())
            setValue('number', res.payload.data?.ticketNum)
        }
        handleGetConfig()
    }, [dispatch, setValue])

    useEffect(() => {
        // Al cambiar tipo, reseteamos cliente y número
        resetField('client') // 'client' ahora será un objeto o null

        if (watchType === 'Ticket') {
            setValue('number', configData?.ticketNum)
        }

        if (watchType === 'Boleta') {
            setValue('number', configData?.boletaNum)
            setValue('serie', configData?.boletaSerie)
        }

        if (watchType === 'Factura') {
            setValue('number', configData?.invoceNum)
            setValue('serie', configData?.invoceSerie)
        }
    }, [watchType, configData, setValue, resetField])

    return (
        <div className="pb-4 border-b border-gray-200 dark:border-gray-700">

            {/* Custom Segmented Control for Type */}
            <FormItem className="mb-4">
                <Controller
                    control={control}
                    name="type"
                    render={({ field: { onChange, value } }) => (
                        <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-xl flex">
                            <div
                                className={classNames(
                                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg cursor-pointer transition-all font-semibold text-sm select-none",
                                    value === 'Ticket'
                                        ? "bg-white dark:bg-gray-600 text-indigo-600 shadow-sm ring-1 ring-black/5"
                                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                                )}
                                onClick={() => onChange('Ticket')}
                            >
                                <HiOutlineTicket className="text-lg" />
                                <span>Ticket</span>
                            </div>
                            <div
                                className={classNames(
                                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg cursor-pointer transition-all font-semibold text-sm select-none",
                                    value === 'Factura'
                                        ? "bg-white dark:bg-gray-600 text-indigo-600 shadow-sm ring-1 ring-black/5"
                                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                                )}
                                onClick={() => onChange('Factura')}
                            >
                                <HiOutlineDocumentText className="text-lg" />
                                <span>Factura</span>
                            </div>
                        </div>
                    )}
                />
                {errors.type && <div className="text-red-500 text-xs mt-1">{errors.type.message}</div>}
            </FormItem>

            {/* Grid for Number and Date */}
            <div className="grid grid-cols-2 gap-3 mb-2">
                <FormItem
                    label={watchType !== 'Ticket' ? 'Serie/Num' : 'Número'}
                    className="mb-0"
                    invalid={errors.number || errors.serie}
                >
                    <InputGroup size="sm" className="w-full">
                        {watchType !== 'Ticket' && (
                            <Controller
                                control={control}
                                name="serie"
                                render={({ field }) => (
                                    <Input {...field} className="min-w-[50px] text-center font-mono pl-1 pr-1" placeholder="Ser" />
                                )}
                            />
                        )}
                        <Addon className="bg-gray-50 text-gray-400 px-2">
                            {watchType !== 'Ticket' ? '-' : <HiOutlineHashtag />}
                        </Addon>
                        <Controller
                            control={control}
                            name="number"
                            render={({ field }) => (
                                <Input {...field} className="text-right font-mono text-gray-700 font-bold" placeholder="000000" />
                            )}
                        />
                    </InputGroup>
                </FormItem>

                <FormItem
                    label="Fecha"
                    className="mb-0"
                    invalid={errors.dateIssue}
                >
                    <Controller
                        control={control}
                        name="dateIssue"
                        render={({ field }) => (
                            <DatePicker
                                {...field}
                                locale='es'
                                inputFormat="DD/MM/YYYY"
                                placeholder="Seleccionar"
                                size="sm"
                                clearable={false}
                            />
                        )}
                    />
                </FormItem>
            </div>
            {(errors.serie || errors.number) && (
                <div className="text-red-500 text-xs mb-3">
                    {errors.serie?.message || errors.number?.message}
                </div>
            )}

            {/* Client Section - Conditionally Rendered */}
            {watchType !== 'Ticket' && (
                <div className="mt-4 animate-fade-in-down">
                    <FormItem
                        label="Cliente"
                        className="mb-0"
                        invalid={errors.client} // Check if object is invalid generally, or check errors.client?.value if structure demands
                        errorMessage={errors.client?.message || "Seleccione un cliente"}
                    >
                        <Controller
                            control={control}
                            name="client"
                            rules={{ required: watchType === 'Factura' ? "Cliente es requerido para factura" : false }}
                            render={({ field }) => (
                                <CustomerSelect
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={false}
                                />
                            )}
                        />
                    </FormItem>
                </div>
            )}
        </div>
    )
}

export default BasicInfoFields
