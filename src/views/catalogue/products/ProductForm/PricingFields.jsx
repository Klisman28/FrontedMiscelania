import React from 'react'
import { Input, FormItem } from 'components/ui'
import { NumericFormat } from 'react-number-format'
import { Field } from 'formik'

const CurrencyInput = (props) => {
  return <Input {...props} value={props.field.value} prefix="Q " className="tabular-nums text-right" />
}

const NumberFormatInput = ({ onValueChange, ...rest }) => {
  return (
    <NumericFormat
      customInput={Input}
      type="text"
      onValueChange={onValueChange}
      autoComplete="off"
      {...rest}
    />
  )
}

const PricingFields = (props) => {
  const { touched, errors } = props

  const calculatePrice = (form, value, field) => {
    if (field === 'cost') {
      const cost = parseFloat(value)
      const utility = parseFloat(form.values.utility)
      if (!isNaN(cost) && !isNaN(utility)) {
        form.setFieldValue('price', cost + utility)
      } else {
        form.setFieldValue('price', '')
      }
    } else {
      const utility = parseFloat(value)
      const cost = parseFloat(form.values.cost)
      if (!isNaN(cost) && !isNaN(utility)) {
        form.setFieldValue('price', cost + utility)
      } else {
        form.setFieldValue('price', '')
      }
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      <div className="mb-6">
        <h4 className="text-lg font-bold text-gray-900">Precios</h4>
        <p className="text-sm text-gray-500 mt-1">Costos y márgenes</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Campo: Costo */}
        <div className="col-span-1">
          <FormItem
            label="Costo *"
            className="mb-0"
            labelClass="text-xs font-semibold uppercase tracking-wide text-gray-500"
            invalid={errors.cost && touched.cost}
            errorMessage={errors.cost}
          >
            <Field name="cost">
              {({ field, form }) => (
                <NumberFormatInput
                  form={form}
                  field={field}
                  placeholder="0.00"
                  customInput={CurrencyInput}
                  onValueChange={(e) => {
                    form.setFieldValue(field.name, e.value)
                    calculatePrice(form, e.value, 'cost')
                  }}
                />
              )}
            </Field>
          </FormItem>
        </div>

        {/* Campo: Utilidad */}
        <div className="col-span-1">
          <FormItem
            label="Utilidad *"
            className="mb-0"
            labelClass="text-xs font-semibold uppercase tracking-wide text-gray-500"
            invalid={errors.utility && touched.utility}
            errorMessage={errors.utility}
          >
            <Field name="utility">
              {({ field, form }) => (
                <NumberFormatInput
                  form={form}
                  field={field}
                  placeholder="0.00"
                  customInput={CurrencyInput}
                  onValueChange={(e) => {
                    form.setFieldValue(field.name, e.value)
                    calculatePrice(form, e.value, 'utility')
                  }}
                />
              )}
            </Field>
          </FormItem>
        </div>

        {/* Campo: Precio (calculado automáticamente, deshabilitado) */}
        <div className="col-span-1">
          <FormItem
            label="Precio"
            className="mb-0"
            labelClass="text-xs font-semibold uppercase tracking-wide text-gray-500"
            invalid={errors.price && touched.price}
            errorMessage={errors.price}
          >
            <Field name="price">
              {({ field, form }) => (
                <NumberFormatInput
                  form={form}
                  field={field}
                  disabled
                  placeholder="0.00"
                  className="bg-slate-50 text-slate-500 cursor-not-allowed border-dashed tabular-nums text-right font-bold"
                  customInput={CurrencyInput}
                  onValueChange={(e) => {
                    form.setFieldValue(field.name, e.value)
                  }}
                />
              )}
            </Field>
          </FormItem>
        </div>
      </div>
    </div>
  )
}

export default PricingFields
