import React, { useEffect } from 'react'
import { InputGroup, Input, FormItem, Select, Card, DatePicker } from 'components/ui'
import { useSelector, useDispatch } from 'react-redux'
import 'dayjs/locale/es'
import { Controller } from 'react-hook-form'
import { getCustomers, getEnterprises, getConfig } from './store/formSlice'
import { getWarehouses } from 'store/warehouses/warehousesSlice'
import { HiOutlineTicket, HiOutlineDocumentText, HiOutlineCalendar, HiOutlineUser, HiOutlineHashtag } from 'react-icons/hi'
import classNames from 'classnames'

const { Addon } = InputGroup

const BasicInfoFields = ({ control, errors, setValue, watch, resetField }) => {

    const dispatch = useDispatch()

    const customerList = useSelector((state) => state.saleForm.data.customerList)
    const enterpriseList = useSelector((state) => state.saleForm.data.enterpriseList)
    const configData = useSelector((state) => state.saleForm.data.configData)
    const warehouseList = useSelector((state) => state.warehouses?.warehouses || [])

    const watchType = watch('type', 'Ticket')

    const customerOptions = customerList.map((customer) => ({
        value: customer.id,
        label: `${customer.fullname} (${customer.dni})`
    }))

    const enterpriseOptions = enterpriseList.map((enterprise) => ({
        value: enterprise.id,
        label: `${enterprise.name} (${enterprise.ruc})`
    }))

    const mergedOptions = [...customerOptions, ...enterpriseOptions]

    useEffect(() => {
        dispatch(getWarehouses())
    }, [dispatch])


    useEffect(() => {
        const handleGetConfig = async () => {
            const res = await dispatch(getConfig())
            setValue('number', res.payload.data?.ticketNum)
        }
        handleGetConfig()
    }, [])

    useEffect(() => {
        resetField('client')

        if (watchType === 'Ticket') {
            setValue('number', configData?.ticketNum)
        }

        if (watchType === 'Boleta') {
            dispatch(getCustomers())
            setValue('number', configData?.boletaNum)
            setValue('serie', configData?.boletaSerie)
        }

        if (watchType === 'Factura') {
            dispatch(getEnterprises())
            setValue('number', configData?.invoceNum)
            setValue('serie', configData?.invoceSerie)
        }
    }, [watchType, configData, dispatch, setValue, resetField])

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
                        invalid={errors.client && errors.client.value}
                        errorMessage={(errors.client && errors.client.value) && errors.client.value.message}
                    >
                        <Controller
                            control={control}
                            name="client"
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    placeholder="Buscar cliente..."
                                    options={watchType === 'Factura' ? mergedOptions : customerOptions}
                                    components={{
                                        Control: ({ children, ...props }) => (
                                            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-1.5 focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 bg-white">
                                                <HiOutlineUser className="text-lg text-gray-400 mr-2" />
                                                {children}
                                            </div>
                                        )
                                    }}
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