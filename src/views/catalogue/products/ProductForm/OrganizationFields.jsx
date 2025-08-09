import React from 'react'
import { AdaptableCard } from 'components/shared'
import { Input, FormItem, Select } from 'components/ui'
import CreatableSelect from 'react-select/creatable'
import { Field } from 'formik'
import { useSelector } from 'react-redux'


const OrganizationFields = (props) => {
  const { values, touched, errors } = props

  // Obtenemos listados desde Redux (o donde corresponda)
  const subcategoryList = useSelector((state) => state.productForm.data.subcategoryList)
  const brandList = useSelector((state) => state.productForm.data.brandList)
  const categoryList = useSelector((state) => state.productForm.data.categoryList)
  

  
  // Mapeo de opciones
  const categoryOptions = categoryList.map((category) => ({
    value: category.id,
    label: category.name,
  }))
  const subcategoryOptions = subcategoryList.map((subcategory) => ({
    value: subcategory.id,
    label: subcategory.name,
  }))

  const brandOptions = brandList.map((brand) => ({
    value: brand.id,
    label: brand.name,
  }))

  return (
    <AdaptableCard className="mb-4" divider isLastChild>
      
	  <p className='mb-6 text-lg italic font-semibold text-dark dark:text-light'>Categorias/Marca </p>

      {/* Fila con 2 columnas: Subcategoría y Marca */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
		  {/* CATEGORÍA 
		 	 <div>
          <FormItem
            label="Categoría *"
            invalid={errors.categoryId && touched.categoryId}
            errorMessage={errors.categoryId}
          >
            <Field name="categoryId">
              {({ field, form }) => (
                <Select
                  field={field}
                  form={form}
                  placeholder="Seleccione una categoría..."
                  options={categoryOptions}
                  value={categoryOptions.filter(
                    (option) => option.value === values.categoryId
                  )}
                  onChange={(option) => form.setFieldValue(field.name, option.value)}
                />
              )}
            </Field>
          </FormItem>
        </div> 
		  */}
		 
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
                  placeholder="Seleccione una subcategoría..."
                  options={subcategoryOptions}
                  value={subcategoryOptions.filter(
                    (option) => option.value === values.subcategoryId
                  )}
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
                  placeholder="Seleccione una marca..."
                  options={brandOptions}
                  value={brandOptions.filter((option) => option.value === values.brandId)}
                  onChange={(option) => form.setFieldValue(field.name, option.value)}
                />
              )}
            </Field>
          </FormItem>
        </div>
      </div>

      {/* 
        Botones de acción (descartar/guardar), 
        se pueden colocar al final del formulario o en otro componente.
      */}
     
    </AdaptableCard>
  )
}

export default OrganizationFields
