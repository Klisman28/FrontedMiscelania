import React from 'react'
import { Input, FormItem, DatePicker, Radio } from 'components/ui'
import { Field } from 'formik'
import { NumberFormatBase } from 'react-number-format'
import 'dayjs/locale/es'

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
                label="CUI"
                invalid={errors.dni && touched.dni}
                errorMessage={errors.dni}
            >
                <Field name="dni">
                    {({ field, form }) => {
                        return (
                            <NumberFormatInput
                                form={form}
                                field={field}
                                placeholder="CUI"
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
                label="Cumpleaños"
                invalid={errors.birthdate && touched.birthdate}
                errorMessage={errors.birthdate}
            >
                <Field name="birthdate" placeholder="Fecha Nac...">
                    {({ field, form }) => (
                       <DatePicker
                       locale="es"
                       selected={field.value}
                       onChange={(date) => form.setFieldValue(field.name, date)}
                       showYearDropdown  // Habilita la opción para seleccionar el año
                       yearDropdownItemNumber={100} // Permite ver hasta 100 años en el selector
                       scrollableYearDropdown  // Hace el selector de años desplazable
                       placeholderText="Selecciona una fecha"
                   />
                    )}
                </Field>
            </FormItem>
            <FormItem
                label="Sexo"
                asterisk
                invalid={errors.gender && touched.gender}
                errorMessage={errors.gender}
            >
                <Field name="gender">
                    {({ field, form }) => (
                        <Radio.Group
                            value={values.gender}
                            onChange={val => form.setFieldValue(field.name, val)}
                        >
                            <Radio value="Masculino">Masculino</Radio>
                            <Radio value="Femenino">Femenino</Radio>
                        </Radio.Group>
                    )}
                </Field>
            </FormItem>
        </>
    )
}

export default BasicInfoFields
