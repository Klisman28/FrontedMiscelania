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

const optional = (<span className="text-gray-400 text-xs font-normal ml-1">(Opcional)</span>)

const ContactFields = props => {

    const { touched, errors } = props

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormItem
                label="Email"
                invalid={errors.email && touched.email}
                errorMessage={errors.email}
                extra={optional}
            >
                <Field
                    type="email"
                    autoComplete="off"
                    name="email"
                    placeholder="juan@example.com"
                    component={Input}
                />
            </FormItem>

            <FormItem
                label="Teléfono"
                invalid={errors.telephone && touched.telephone}
                errorMessage={errors.telephone}
                extra={optional}
            >
                <Field name="telephone">
                    {({ field, form }) => {
                        return (
                            <NumberFormatInput
                                form={form}
                                field={field}
                                placeholder="555-1234"
                                customInput={NumberInput}
                                onValueChange={e => {
                                    form.setFieldValue(field.name, e.value)
                                }}
                            />
                        )
                    }}
                </Field>
            </FormItem>

            <FormItem
                label="Dirección"
                invalid={errors.address && touched.address}
                errorMessage={errors.address}
                extra={optional}
                className="col-span-1 md:col-span-2"
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="address"
                    placeholder="Calle Principal 123, Zona 1"
                    component={Input}
                />
            </FormItem>
        </div>
    )
}

export default ContactFields
