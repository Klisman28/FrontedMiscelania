import React, { forwardRef, useEffect } from 'react'
import { FormContainer, Button } from 'components/ui'
import { Form, Formik } from 'formik'
import BasicInfoFields from './BasicInfoFields'
import PricingFields from './PricingFields'
import OrganizationFields from './OrganizationFields'
import ProductImages from './ProductImages'
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
    description: Yup.string()
        .notRequired()
        .max(500, 'La descripción no puede exceder los 500 caracteres'),
    hasExpiration: Yup.boolean().notRequired(),
    expirationDate: Yup.string().nullable()
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
        >
            {({ values, touched, errors }) => (
                <Form>
                    <FormContainer>
                        <div className="max-w-7xl mx-auto px-6 py-6 font-sans">
                            {/* Header */}
                            <div className="flex flex-col mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Producto</h2>
                                <p className="text-slate-500 text-sm mt-1">Completa la información para guardar el producto</p>
                            </div>

                            <div className="grid grid-cols-12 gap-6 pb-20">
                                {/* Columna Izquierda: Info General + Categorías */}
                                <div className="col-span-12 lg:col-span-8 space-y-6">
                                    <BasicInfoFields touched={touched} errors={errors} values={values} />
                                    <OrganizationFields touched={touched} errors={errors} values={values} />
                                </div>

                                {/* Columna Derecha: Precios + Imagenes */}
                                <div className="col-span-12 lg:col-span-4 space-y-6">
                                    <PricingFields touched={touched} errors={errors} values={values} />
                                    <ProductImages touched={touched} errors={errors} values={values} />
                                </div>
                            </div>
                        </div>

                        {/* Sticky Footer */}
                        <div className="sticky bottom-0 bg-white/80 backdrop-blur border-t border-slate-200 py-4 px-8 z-50">
                            <div className="flex items-center justify-end max-w-7xl mx-auto gap-3">
                                <Button
                                    size="md"
                                    className="rounded-xl px-6 font-medium text-gray-600 hover:bg-slate-50 transition-colors"
                                    onClick={() => onDiscard?.()}
                                    type="button"
                                >
                                    Descartar
                                </Button>
                                <Button
                                    size="md"
                                    variant="solid"
                                    loading={false}
                                    icon={<AiOutlineSave className="text-xl" />}
                                    className="rounded-xl px-6 font-medium shadow-lg shadow-indigo-500/20"
                                    type="submit"
                                >
                                    {(typeAction === 'create') ? ' Guardar' : 'Actualizar'}
                                </Button>
                            </div>
                        </div>
                    </FormContainer>
                </Form>
            )}
        </Formik>
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
        hasExpiration: false,
        expirationDate: '',
        description: '',
    },
    typeAction: 'create'
}

export default ProductForm