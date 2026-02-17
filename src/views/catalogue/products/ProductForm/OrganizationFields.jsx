import React from 'react'
import { Input, FormItem, Select } from 'components/ui'
import { Field } from 'formik'
import { useSelector } from 'react-redux'

const OrganizationFields = (props) => {
  const { values, touched, errors } = props

  const subcategoryList = useSelector((state) => state.catalogs?.subcategories ?? [])
  const brandList = useSelector((state) => state.catalogs?.brands ?? [])

  const subcategoryOptions = subcategoryList.map((subcategory) => ({ value: subcategory.id, label: subcategory.name }))
  const brandOptions = brandList.map((brand) => ({ value: brand.id, label: brand.name }))

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      <div className="mb-6">
        <h4 className="text-lg font-bold text-gray-900">Categorías/Marca</h4>
        <p className="text-sm text-gray-500 mt-1">Clasificación del producto</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FormItem
            label="Subcategoría *"
            invalid={errors.subcategoryId && touched.subcategoryId}
            errorMessage={errors.subcategoryId}
          >
            <Field name="subcategoryId">
              {({ field, form }) => (
                <Select
                  field={field}
                  form={form}
                  placeholder="Seleccione..."
                  options={subcategoryOptions}
                  value={subcategoryOptions.filter((option) => option.value === values.subcategoryId)}
                  onChange={(option) => form.setFieldValue(field.name, option.value)}
                />
              )}
            </Field>
          </FormItem>
        </div>

        <div>
          <FormItem
            label="Marca *"
            invalid={errors.brandId && touched.brandId}
            errorMessage={errors.brandId}
          >
            <Field name="brandId">
              {({ field, form }) => (
                <Select
                  field={field}
                  form={form}
                  placeholder="Seleccione..."
                  options={brandOptions}
                  value={brandOptions.filter((option) => option.value === values.brandId)}
                  onChange={(option) => form.setFieldValue(field.name, option.value)}
                />
              )}
            </Field>
          </FormItem>
        </div>
      </div>
    </div>
  )
}

export default OrganizationFields
