import React, { useEffect } from 'react'
import { InputGroup, Input, FormItem, Select, Card, DatePicker, Radio, A } from 'components/ui'
import { useSelector } from 'react-redux'
import 'dayjs/locale/es'
import { Controller } from 'react-hook-form'
import { getCustomers, getEnterprises, getConfig } from './store/formSlice'
import { useDispatch } from 'react-redux'

const { Addon } = InputGroup

const BasicInfoFields = ({ control, errors, setValue, watch, resetField }) => {

    const dispatch = useDispatch()

    const customerList = useSelector((state) => state.saleForm.data.customerList)
    console.log('datos de cliente', customerList);

    const enterpriseList = useSelector((state) => state.saleForm.data.enterpriseList)
    const configData = useSelector((state) => state.saleForm.data.configData)

    const watchType = watch('type', 'Ticket')

    const customerOptions = customerList.map((customer) => {
        return {
            value: customer.id,
            label: `${customer.fullname} (${customer.dni})`
        }
    })

    const enterpriseOptions = enterpriseList.map((enterprise) => {
        return {
            value: enterprise.id,
            label: `${enterprise.name} (${enterprise.ruc})`
        }
    })

      const mergedOptions = [...customerOptions, ...enterpriseOptions]


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
    }, [watchType])

    return (
        <Card>
            <h5 className="mb-4">Información Básica</h5>
            <FormItem
                label="Tipo Comprobante"
                invalid={errors.type}
                errorMessage={errors.type && errors.type.message}
            >
                <Controller
                    control={control}
                    name="type"
                    render={({ field: { onChange, value } }) => (
                        <Radio.Group
                            value={value}
                            onChange={onChange}
                            vertical
                        >
                            <Radio value="Ticket">Ticket</Radio>

                            <Radio value="Factura">Factura</Radio>
                        </Radio.Group>
                    )}
                />
            </FormItem>
            <FormItem
                label={watchType !== 'Ticket' ? 'Serie / Num' : 'Num'}
                invalid={errors.serie}
            >
                <InputGroup className="">
                    {watchType !== 'Ticket' &&
                        <Controller
                            control={control}
                            name="serie"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    className="w-1/4"
                                    placeholder="serie"
                                    value={value}
                                    onChange={onChange}
                                />
                            )}
                        />
                    }
                    <Addon>
                        {watchType !== 'Ticket' ?
                            <span className='font-bold'>/</span> :
                            <span className='font-bold'>#</span>
                        }
                    </Addon>
                    <Controller
                        control={control}
                        name="number"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                className="w-3/4"
                                placeholder="número"
                                value={value}
                                onChange={onChange}
                            />
                        )}
                    />
                </InputGroup>
                <div className='text-red-500'>
                    {errors.serie && errors.serie?.message}
                </div>
                <div className='text-red-500'>
                    {errors.number && errors.number?.message}
                </div>
            </FormItem>
            <FormItem
                label="Fecha"
                invalid={errors.dateIssue}
                errorMessage={(errors.dateIssue) && (errors.dateIssue?.type === "typeError") ? "La fecha debe tener un formato válido" : errors.dateIssue?.message}
            >
                <Controller
                    control={control}
                    name="dateIssue"
                    render={({ field: { onChange, value } }) => (
                        <DatePicker
                            locale='es'
                            inputFormat="DD MMM YYYY"
                            value={value}
                            disabled
                            onChange={onChange}
                        />
                    )}
                />
            </FormItem>
            {watchType !== 'Ticket' &&
                <FormItem
                    label="Cliente"
                    invalid={true}
                    errorMessage={(errors.client && errors.client.value) && errors.client.value.message}
                >
                    <Controller
                        control={control}
                        name="client"
                        render={({ field: { onChange, value } }) => (
                            <Select
                                placeholder="Seleccione un cliente..."
                                options={watchType === 'Factura' ? mergedOptions :  enterpriseOptions}
                                value={value}
                                onChange={onChange}
                            />
                        )}
                    />
                </FormItem>
            }
        </Card>
    )
}

export default BasicInfoFields