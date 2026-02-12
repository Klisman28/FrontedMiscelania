import React from 'react'
import { Input, FormItem } from 'components/ui'
import { Field } from 'formik'
import { NumberFormatBase } from 'react-number-format'

const NumberInput = props => {
    return <Input {...props} value={props.field.value} className="h-11 rounded-xl border-slate-300 focus:ring-2 focus:ring-slate-200 focus:border-slate-400 tabular-nums font-mono text-slate-800 placeholder:text-slate-400" />
}

const NumberFormatInput = ({ onValueChange, ...rest }) => {
    return (
        <NumberFormatBase
            customInput={NumberInput}
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
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 h-full flex flex-col">
            <div className="mb-6">
                <h5 className="text-lg font-bold text-slate-900 tracking-tight">Factura</h5>
                <p className="text-sm text-slate-500 mt-1">
                    Ingrese el número y serie inicial de la factura. Se usará para autocompletar la numeración en nuevas ventas.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1">
                    <FormItem
                        label="Serie de la Factura"
                        labelClass="text-xs font-medium text-slate-600 mb-1.5"
                        invalid={errors.invoceSerie && touched.invoceSerie}
                        errorMessage={errors.invoceSerie}
                        className="mb-0"
                    >
                        <Field name="invoceSerie">
                            {({ field, form }) => {
                                return (
                                    <NumberFormatInput
                                        form={form}
                                        field={field}
                                        placeholder="F001"
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
                        labelClass="text-xs font-medium text-slate-600 mb-1.5"
                        invalid={errors.invoceNum && touched.invoceNum}
                        errorMessage={errors.invoceNum}
                        className="mb-0"
                    >
                        <Field name="invoceNum">
                            {({ field, form }) => {
                                return (
                                    <NumberFormatInput
                                        form={form}
                                        field={field}
                                        placeholder="0001"
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
        </div>
    )
}

export default InvoceFields