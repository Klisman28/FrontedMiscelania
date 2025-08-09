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

const BasicInfoFields = props => {

    const { touched, errors } = props

    return (
        <>
            <FormItem
                label="Nombre"
                invalid={errors.name && touched.name}
                errorMessage={errors.name}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="name"
                    placeholder="Nombre"
                    component={Input}
                />
            </FormItem>
           
            
            <FormItem
                label="NIT"
                invalid={errors.ruc && touched.ruc}
                errorMessage={errors.ruc}
            >
                <Field name="ruc">
                    {({ field, form }) => {
                        return (
                            <NumberFormatInput
                                form={form}
                                field={field}
                                placeholder="NIT"
                                customInput={NumberInput}
                                onValueChange={e => {
                                    form.setFieldValue(field.name, e.value)
                                }}
                            />
                        )
                    }}
                </Field>
            </FormItem>
        </>
    )
}

export default BasicInfoFields
