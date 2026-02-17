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
        <div className="space-y-4">

            {/* 1) Toggle Ticket / Factura - Segmented Control Minimal */}
            <FormItem className="mb-0">
                <Controller
                    control={control}
                    name="type"
                    render={({ field: { onChange, value } }) => (
                        <div className="bg-slate-100 rounded-2xl p-1 flex h-11">
                            <div
                                className={classNames(
                                    "flex-1 flex items-center justify-center gap-2 rounded-xl cursor-pointer transition-all font-semibold text-sm select-none",
                                    value === 'Ticket'
                                        ? "bg-white shadow-sm text-indigo-600"
                                        : "text-slate-600 hover:text-slate-900"
                                )}
                                onClick={() => onChange('Ticket')}
                            >
                                <HiOutlineTicket className="text-[18px]" />
                                <span>Ticket</span>
                            </div>
                            <div
                                className={classNames(
                                    "flex-1 flex items-center justify-center gap-2 rounded-xl cursor-pointer transition-all font-semibold text-sm select-none",
                                    value === 'Factura'
                                        ? "bg-white shadow-sm text-indigo-600"
                                        : "text-slate-600 hover:text-slate-900"
                                )}
                                onClick={() => onChange('Factura')}
                            >
                                <HiOutlineDocumentText className="text-[18px]" />
                                <span>Factura</span>
                            </div>
                        </div>
                    )}
                />
                {errors.type && <div className="text-red-500 text-xs mt-1 min-h-[16px]">{errors.type.message}</div>}
            </FormItem>

            {/* 2) Serie/Num y Fecha en Grid */}
            <div className="grid grid-cols-2 gap-3">
                {/* Serie/Num - Grupo compacto */}
                <FormItem
                    label={watchType !== 'Ticket' ? 'Serie/Num' : 'Número'}
                    className="mb-0"
                    invalid={errors.number || errors.serie}
                >
                    {watchType !== 'Ticket' ? (
                        /* Serie y Número juntos */
                        <div className="flex items-center h-11 rounded-xl border border-slate-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-indigo-200 focus-within:border-indigo-300">
                            <Controller
                                control={control}
                                name="serie"
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        className="w-14 text-center font-mono tabular-nums text-sm border-0 focus:ring-0 bg-transparent px-2"
                                        placeholder="001"
                                    />
                                )}
                            />
                            <span className="text-slate-400 px-1">-</span>
                            <Controller
                                control={control}
                                name="number"
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        className="flex-1 text-right font-mono tabular-nums text-sm font-semibold border-0 focus:ring-0 bg-transparent pr-3"
                                        placeholder="000000"
                                    />
                                )}
                            />
                        </div>
                    ) : (
                        /* Solo Número para Ticket */
                        <Controller
                            control={control}
                            name="number"
                            render={({ field }) => (
                                <input
                                    {...field}
                                    className="w-full h-11 rounded-xl border border-slate-300 bg-white px-3 text-center font-mono tabular-nums text-sm font-semibold focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
                                    placeholder="000000"
                                />
                            )}
                        />
                    )}
                </FormItem>

                {/* Fecha con ícono calendario */}
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
                                clearable={false}
                                inputPrefix={null}
                                inputSuffix={null}
                                className="custom-datepicker-h11"
                            />
                        )}
                    />
                </FormItem>
            </div>
            {(errors.serie || errors.number) && (
                <div className="text-red-500 text-xs min-h-[16px]">
                    {errors.serie?.message || errors.number?.message}
                </div>
            )}

            {/* 3) Cliente - Dropdown (solo si no es Ticket) */}
            {watchType !== 'Ticket' && (
                <div className="animate-fade-in-down">
                    <FormItem
                        label="Cliente"
                        className="mb-0"
                        invalid={errors.client}
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
