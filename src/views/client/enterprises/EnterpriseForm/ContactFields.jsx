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
                    placeholder="correo@empresa.com"
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
                                placeholder="+502 5555-5555"
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
                    placeholder="https://empresa.com"
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
                    placeholder="Colonia..., Ciudad..."
                    component={Input}
                />
            </FormItem>
        </div>
    )
}

export default ContactFields
