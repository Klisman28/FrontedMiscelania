import React from 'react'
import { Input, FormItem } from 'components/ui'
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

const optional = (<span className="ml-1 text-gray-400 text-xs font-normal">(Opcional)</span>)

const BasicInfoFields = props => {

    const { touched, errors } = props

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormItem
                label="Nombre de la Empresa"
                invalid={errors.name && touched.name}
                errorMessage={errors.name}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="name"
                    placeholder="Ej: Valle Banets"
                    component={Input}
                />
            </FormItem>

            <FormItem
                label="NIT"
                invalid={errors.ruc && touched.ruc}
                errorMessage={errors.ruc}
                extra={optional}
            >
                <Field name="ruc">
                    {({ field, form }) => {
                        return (
                            <NumberFormatInput
                                form={form}
                                field={field}
                                placeholder="100282115"
                                customInput={NumberInput}
                                onValueChange={e => {
                                    form.setFieldValue(field.name, e.value)
                                }}
                            />
                        )
                    }}
                </Field>
            </FormItem>
        </div>
    )
}

export default BasicInfoFields
