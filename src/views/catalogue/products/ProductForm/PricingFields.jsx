import React from 'react'
import { AdaptableCard } from 'components/shared'
import { Input, FormItem } from 'components/ui'
import { NumericFormat } from 'react-number-format'
import { Field } from 'formik'

/**
 * Input con prefijo de moneda.
 */
const CurrencyInput = (props) => {
  return <Input {...props} value={props.field.value} prefix="Q " />
}

/**
 * Wrapper para formatear números con react-number-format.
 */
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

  /**
   * Función para recalcular el precio
   * a partir de costo y utilidad.
   */
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
      // field === 'utility'
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
    <AdaptableCard className="mb-4" divider>
                  <p className='mb-6 text-lg italic font-semibold text-dark dark:text-light'>Información de Precios </p>


      {/*
        Usamos una sola fila con 3 columnas (md:grid-cols-3) para
        alinear Costo, Utilidad y Precio de manera más clara.
      */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Campo: Costo */}
        <div>
          <FormItem
            label="Costo *"
            invalid={errors.cost && touched.cost}
            errorMessage={errors.cost}
          >
            <Field name="cost">
              {({ field, form }) => (
                <NumberFormatInput
                  form={form}
                  field={field}
                  placeholder="Ej. 100.00"
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
        <div>
          <FormItem
            label="Utilidad *"
            invalid={errors.utility && touched.utility}
            errorMessage={errors.utility}
          >
            <Field name="utility">
              {({ field, form }) => (
                <NumberFormatInput
                  form={form}
                  field={field}
                  placeholder="Ej. 20.00"
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
        <div>
          <FormItem
            label="Precio (calculado)"
            invalid={errors.price && touched.price}
            errorMessage={errors.price}
          >
            <Field name="price">
              {({ field, form }) => (
                <NumberFormatInput
                  form={form}
                  field={field}
                  disabled
                  placeholder="Automático"
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
    </AdaptableCard>
  )
}

export default PricingFields
