import React, { forwardRef } from 'react'
import { FormContainer, Button } from 'components/ui'
import { StickyFooter } from 'components/shared'
import { Form, Formik } from 'formik'
import TicketConfigFields from './TicketConfigFields'
import InvoceFields from './InvoceFields'
import BoletaFields from './BoletaFields'
import { AiOutlineSave } from 'react-icons/ai'
import * as Yup from 'yup'
// import { useDispatch } from 'react-redux'
// import { injectReducer } from 'store/index'
// import reducer from './store'
// import { getSubategories, getBrands, getProductUnits } from './store/formSlice'

const validationSchema = Yup.object().shape({
    invoceSerie: Yup.number()
        .required('Serie es requerido')
        .integer('Por favor ingrese un número entero'),
    invoceNum: Yup.number()
        .required('Número es requerido')
        .integer('Por favor ingrese un número entero'),
    boletaSerie: Yup.number()
        .required('Serie es requerido')
        .integer('Por favor ingrese un número entero'),
    boletaNum: Yup.number()
        .required('Número es requerido')
        .integer('Por favor ingrese un número entero'),
    ticketNum: Yup.number()
        .required('Número es requerido')
        .integer('Por favor ingrese un número entero'),
})

// injectReducer('configForm', reducer)

const ProductForm = forwardRef((props, ref) => {

    const { typeAction, initialData, onFormSubmit, onDiscard } = props

    return (
        <>
            <Formik
                innerRef={ref}
                initialValues={{
                    ...initialData
                }}

                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (typeAction === 'edit') {
                        delete values.id
                    }
                    onFormSubmit?.(values, setSubmitting)
                }}
            >
                {({ touched, errors }) => (
                    <Form>
                        <FormContainer>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div className="lg:col-span-2">
                                    <TicketConfigFields touched={touched} errors={errors} />
                                    <InvoceFields touched={touched} errors={errors} />
                                    <BoletaFields touched={touched} errors={errors} />
                                </div>
                            </div>
                            <StickyFooter
                                className="-mx-8 px-8 flex items-center justify-between py-4"
                                stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            >
                                <div className="md:flex items-center">
                                    <Button
                                        size="sm"
                                        className="ltr:mr-3 rtl:ml-3"
                                        onClick={() => onDiscard?.()}
                                        type="button"
                                    >
                                        Descartar
                                    </Button>
                                    <Button
                                        size="sm"
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
        invoceSerie: '',
        invoceNum: '',
        boletaSerie: '',
        boletaNum: '',
        ticketNum: ''
    },
    typeAction: 'create'
}

export default ProductForm