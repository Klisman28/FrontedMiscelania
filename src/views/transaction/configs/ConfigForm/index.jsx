import React, { forwardRef } from 'react'
import { FormContainer, Button } from 'components/ui'
import { StickyFooter } from 'components/shared'
import { Form, Formik } from 'formik'
import TicketConfigFields from './TicketConfigFields'
import InvoceFields from './InvoceFields'
import BoletaFields from './BoletaFields'
import { AiOutlineSave } from 'react-icons/ai'
import * as Yup from 'yup'

// Validations remain the same
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

const ProductForm = forwardRef((props, ref) => {

    const { typeAction, initialData, onFormSubmit, onDiscard } = props

    return (
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
                        <div className="max-w-5xl mx-auto px-6 py-6">
                            {/* Header */}
                            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Configuración de Ventas</h3>
                                    <p className="text-slate-500 text-sm mt-1">Define la numeración inicial para Ticket, Factura y Boleta</p>
                                </div>
                                <div className="hidden md:flex items-center gap-3">
                                    <Button
                                        size="sm"
                                        className="rounded-lg h-10 px-4"
                                        onClick={() => onDiscard?.()}
                                        type="button"
                                    >
                                        Descartar
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="solid"
                                        className="rounded-lg h-10 px-6 font-semibold shadow-sm"
                                        loading={false}
                                        icon={<AiOutlineSave className="text-lg" />}
                                        type="submit"
                                    >
                                        {(typeAction === 'create') ? 'Guardar' : 'Actualizar'}
                                    </Button>
                                </div>
                            </div>

                            {/* Content grid */}
                            <div className="grid grid-cols-1 gap-6">
                                <TicketConfigFields touched={touched} errors={errors} />
                                <InvoceFields touched={touched} errors={errors} />
                                <BoletaFields touched={touched} errors={errors} />
                            </div>

                            {/* Sticky Footer for Mobile/Desktop */}
                            <StickyFooter
                                className="-mx-8 px-8 flex items-center justify-end py-4"
                                stickyClass="border-t border-slate-200 bg-white/90 backdrop-blur-sm"
                            >
                                <div className="flex w-full md:w-auto gap-3">
                                    <Button
                                        size="sm"
                                        className="rounded-lg h-10 flex-1 md:flex-none border-slate-300"
                                        onClick={() => onDiscard?.()}
                                        type="button"
                                    >
                                        Descartar
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="solid"
                                        className="rounded-lg h-10 flex-1 md:flex-none font-semibold shadow-sm"
                                        loading={false}
                                        icon={<AiOutlineSave className="text-lg" />}
                                        type="submit"
                                    >
                                        {(typeAction === 'create') ? 'Guardar' : 'Actualizar'}
                                    </Button>
                                </div>
                            </StickyFooter>
                        </div>
                    </FormContainer>
                </Form>
            )}
        </Formik>
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