import React from 'react'
import { AdaptableCard } from 'components/shared'
import { Input, FormItem } from 'components/ui'
import { Field } from 'formik'
import { NumberFormatBase } from 'react-number-format'

export const categories = [
    { label: 'Bags', value: 'bags' },
    { label: 'Cloths', value: 'cloths' },
    { label: 'Devices', value: 'devices' },
    { label: 'Shoes', value: 'shoes' },
    { label: 'Watches', value: 'watches' }
]

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

const InvoceFields = props => {

    const { touched, errors } = props

    return (
        <AdaptableCard className="mb-4" divider>
            <h5>Factura</h5>
            <p className="mb-6">Ingrese el número y serie inicial de la factura. Apartir de este número se va iniciar el autocompletado cuando se realice una nueva venta</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1">
                    <FormItem
                        label="Serie de la Factura"
                        invalid={errors.invoceSerie && touched.invoceSerie}
                        errorMessage={errors.invoceSerie}
                    >
                        <Field name="invoceSerie">
                            {({ field, form }) => {
                                return (
                                    <NumberFormatInput
                                        form={form}
                                        field={field}
                                        placeholder="Serie"
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
                <div className="col-span-1">
                    <FormItem
                        label="Número Inicial de la Factura"
                        invalid={errors.invoceNum && touched.invoceNum}
                        errorMessage={errors.invoceNum}
                    >
                        <Field name="invoceNum">
                            {({ field, form }) => {
                                return (
                                    <NumberFormatInput
                                        form={form}
                                        field={field}
                                        placeholder="Número"
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
            </div>
        </AdaptableCard>
    )
}

export default InvoceFields