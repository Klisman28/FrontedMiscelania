import React, { forwardRef, useEffect } from 'react'
import { FormContainer, Button } from 'components/ui'
import { StickyFooter } from 'components/shared'
import { Form, Formik } from 'formik'
import BasicInfoFields from './BasicInfoFields'
import PricingFields from './PricingFields'
import OrganizationFields from './OrganizationFields'
import ProductImages from './ProductImages'
// import cloneDeep from 'lodash/cloneDeep'
// import { HiOutlineTrash } from 'react-icons/hi'
import { AiOutlineSave } from 'react-icons/ai'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { injectReducer } from 'store/index'
import reducer from './store'
import { getSubategories, getBrands, getProductUnits, getCategories } from './store/formSlice'

const validationSchema = Yup.object().shape({
    sku: Yup.string()
        .required('SKU es requerido')
        .min(6, '¡Demasiado corto!'),
    name: Yup.string()
        .required('Nombre es requerido')
        .min(4, '¡Demasiado corto!'),
    cost: Yup.number()
        .required('Costo es requirido')
        .positive('Por favor ingrese un numero mayor a 0'),
    utility: Yup.number()
        .required('Utilidad es requirido'),
    price: Yup.number()
        .required('Precio es requirido')
        .positive('Por favor ingrese un numero mayor a 0'),
    stock: Yup.number()
        .required('Stock es requerido')
        .integer('Por favor ingrese un número entero'),
    description: Yup.string()  // Nueva validación para la descripción
        .notRequired()
        .max(500, 'La descripción no puede exceder los 500 caracteres'),
    hasExpiration: Yup.boolean().notRequired(),
    expirationDate: Yup.string()
        .when('hasExpiration', {
            is: true,
            then: (s) =>
                s.required('Fecha de expiración requerida')
                    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY‑MM‑DD'),
            otherwise: (s) => s.notRequired().nullable(),
        }),
    stockMin: Yup.number()
        .required('Stock mínimo es requerido')
        .integer('Por favor ingrese un número entero'),
    imageUrl: Yup.string().nullable().notRequired(),
    subcategoryId: Yup.string()
        .required('Por favor seleccione subcategoría'),
    brandId: Yup.string()
        .required('Por favor seleccione marca'),
    unitId: Yup.string()
        .required('Por favor seleccione unidad'),
})

injectReducer('productForm', reducer)

const ProductForm = forwardRef((props, ref) => {

    const { typeAction, initialData, onFormSubmit, onDiscard } = props

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSubategories())
        dispatch(getBrands())
        dispatch(getProductUnits())
        dispatch(getCategories())

    }, [dispatch])

    return (
        <>
            <Formik
                innerRef={ref}
                initialValues={{
                    ...initialData
                }}

                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (values.typeAction === 'create' && values.imgList.length > 0) {
                        values.imageUrl = values.imgList[0].img
                    }
                    if (typeAction === 'edit') {
                        delete values.id
                    }
                    onFormSubmit?.(values, setSubmitting)
                }}
            // onSubmit={(values, { setSubmitting }) => {
            //     const formData = cloneDeep(values)
            //     formData.tags = formData.tags.map(tag => tag.value)
            //     if (type === 'new') {
            //         if (formData.imgList.length > 0) {
            //             formData.img = formData.imgList[0].img
            //         }
            //     }
            //     onFormSubmit?.(formData, setSubmitting)
            // }}
            >
                {({ values, touched, errors }) => (
                    <Form>
                        <FormContainer>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="lg:col-span-2">
                                    <BasicInfoFields touched={touched} errors={errors} values={values} />
                                    <PricingFields touched={touched} errors={errors} values={values} />
                                    <OrganizationFields touched={touched} errors={errors} values={values} />
                                </div>
                                <div className="lg:col-span-1">
                                    <ProductImages touched={touched} errors={errors} values={values} />
                                </div>
                            </div>
                            <StickyFooter
                                className="-mx-8 px-8 flex items-center justify-end py-0"
                                stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            >
                                {/* <div>
                                    {type === 'edit' && <DeleteProductButton onDelete={onDelete} />}
                                </div> */}
                                <div className="md:flex items-center ">
                                    <Button
                                        size="md"
                                        className="ltr:mr-3 rtl:ml-3"
                                        onClick={() => onDiscard?.()}
                                        type="button"
                                    >
                                        Descartar
                                    </Button>
                                    <Button
                                        size="md"
                                        variant="solid"
                                        loading={false}
                                        icon={<AiOutlineSave />}
                                        type="submit"
                                    >
                                        {(typeAction === 'create') ? ' Guardar' : 'Actualizar'}
                                    </Button>
                                </div>
                            </StickyFooter>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </>
    )
})

ProductForm.defaultProps = {
    initialData: {
        name: '',
        sku: '',
        img: '',
        imgList: [],
        cost: '',
        utility: '',
        price: '',
        stock: '',
        stockMin: '',
        subcategoryId: '',
        brandId: '',
        unitId: '',
        imageUrl: '',
        hasExpiration: false,      // ← booleano
        expirationDate: '',        // ← string ISO (YYYY‑MM‑DD) o ''
        description: '',  // Agregado

        

    },
    typeAction: 'create'
}

export default ProductForm