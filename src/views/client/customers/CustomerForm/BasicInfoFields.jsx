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

    const { values, touched, errors } = props

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
                label="Primer Apellido"
                invalid={errors.firstLastname && touched.firstLastname}
                errorMessage={errors.firstLastname}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="firstLastname"
                    placeholder="Primer Apellido"
                    component={Input}
                />
            </FormItem>
            <FormItem
                label="Segundo Apellido"
                invalid={errors.secondLastname && touched.secondLastname}
                errorMessage={errors.secondLastname}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="secondLastname"
                    placeholder="Segundo Apellido"
                    component={Input}
                />
            </FormItem>
            <FormItem
                label="NIT"
                invalid={errors.dni && touched.dni}
                errorMessage={errors.dni}
            >
                <Field name="dni">
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
