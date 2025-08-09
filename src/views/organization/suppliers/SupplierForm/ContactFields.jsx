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

const optional = (<span className="ml-1 opacity-60">(opcional)</span>)

const ContactFields = props => {

    const { touched, errors } = props

    return (
        <>
            <FormItem
                label="Email"
                invalid={errors.email && touched.email}
                errorMessage={errors.email}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="email"
                    placeholder="Correo Electrónico"
                    component={Input}
                />
            </FormItem>
            <FormItem
                label="Teléfono"
                invalid={errors.telephone && touched.telephone}
                errorMessage={errors.telephone}
            >
                <Field name="telephone">
                    {({ field, form }) => {
                        return (
                            <NumberFormatInput
                                form={form}
                                field={field}
                                placeholder="Teléfono"
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
                label="Sitio Web"
                invalid={errors.website && touched.website}
                errorMessage={errors.website}
                extra={optional}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="website"
                    placeholder="Sitio Web"
                    component={Input}
                />
            </FormItem>
            <FormItem
                label="Dirección"
                invalid={errors.address && touched.address}
                errorMessage={errors.address}
                extra={optional}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="address"
                    placeholder="Dirección"
                    component={Input}
                />
            </FormItem>
        </>
    )
}

export default ContactFields
