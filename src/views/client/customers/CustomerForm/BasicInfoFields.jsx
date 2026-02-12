import React, { useEffect } from 'react'
import { Input, FormItem, Switcher } from 'components/ui'
import { Field } from 'formik'
import { NumberFormatBase } from 'react-number-format'

const NumberInput = props => {
    return <Input {...props} value={props.field.value} />
}

const NumberFormatInput = ({ onValueChange, ...rest }) => {
    return (
        <NumberFormatBase
            customInput={Input}
            type="text"
            onValueChange={onValueChange}
            autoComplete="off"
            {...rest}
        />
    )
}

const BasicInfoFields = props => {
    const { values, touched, errors, setFieldValue } = props

    // Efecto para manejar el cambio de switch
    useEffect(() => {
        if (values.isFinalConsumer) {
            setFieldValue('nit', 'CF')
        } else if (values.nit === 'CF') {
            setFieldValue('nit', '')
        }
    }, [values.isFinalConsumer, setFieldValue])

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormItem
                label="Nombre"
                invalid={errors.firstName && touched.firstName}
                errorMessage={errors.firstName}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="firstName"
                    placeholder="Ej: Juan"
                    component={Input}
                    autoFocus
                />
            </FormItem>

            <FormItem
                label="Apellidos"
                invalid={errors.lastName && touched.lastName}
                errorMessage={errors.lastName}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="lastName"
                    placeholder="Ej: Pérez García"
                    component={Input}
                />
            </FormItem>

            <div className="flex items-center gap-4 border p-4 rounded-lg bg-gray-50 h-full">
                <div className="flex flex-col">
                    <label className="font-semibold text-gray-700 mb-1 block">Consumidor Final</label>
                    <div className="flex items-center gap-2">
                        <Field name="isFinalConsumer">
                            {({ field, form }) => (
                                <Switcher
                                    field={field}
                                    form={form}
                                    checked={field.value}
                                    onChange={(checked) => {
                                        form.setFieldValue(field.name, checked)
                                    }}
                                />
                            )}
                        </Field>
                        <span className="text-sm text-gray-500">
                            {values.isFinalConsumer ? 'Sí (Venta rápida)' : 'No (Cliente con NIT)'}
                        </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                        Úsalo para ventas rápidas sin NIT
                    </p>
                </div>
            </div>

            <FormItem
                label="NIT"
                invalid={errors.nit && touched.nit}
                errorMessage={errors.nit}
                extra={!values.isFinalConsumer && <span className="text-gray-400 text-xs ml-1">(Opcional)</span>}
            >
                <Field name="nit">
                    {({ field, form }) => {
                        return (
                            <NumberFormatInput
                                form={form}
                                field={field}
                                placeholder={values.isFinalConsumer ? "CF" : "100282115"}
                                customInput={NumberInput}
                                onValueChange={e => {
                                    form.setFieldValue(field.name, e.value)
                                }}
                                disabled={values.isFinalConsumer}
                            />
                        )
                    }}
                </Field>
            </FormItem>
        </div>
    )
}

export default BasicInfoFields
