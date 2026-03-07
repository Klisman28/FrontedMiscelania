import React, { forwardRef } from 'react'
import { FormContainer, Button } from 'components/ui'
import { Form, Formik } from 'formik'
import GeneralConfigFields from './GeneralConfigFields'
import TicketConfigFields from './TicketConfigFields'
import InvoceFields from './InvoceFields'
import BoletaFields from './BoletaFields'
import { AiOutlineSave } from 'react-icons/ai'
import { HiOutlineCog, HiOutlineArrowLeft } from 'react-icons/hi'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
    invoceSerie: Yup.string()
        .required('Serie es requerido'),
    invoceNum: Yup.number()
        .required('Número es requerido')
        .integer('Por favor ingrese un número entero'),
    boletaSerie: Yup.string()
        .required('Serie es requerido'),
    boletaNum: Yup.number()
        .required('Número es requerido')
        .integer('Por favor ingrese un número entero'),
    ticketNum: Yup.number()
        .required('Número es requerido')
        .integer('Por favor ingrese un número entero'),
})

const ConfigForm = forwardRef((props, ref) => {
    const { typeAction, initialData, onFormSubmit, onDiscard } = props

    return (
        <Formik
            innerRef={ref}
            initialValues={{ ...initialData }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                if (typeAction === 'edit') {
                    delete values.id
                }
                onFormSubmit?.(values, setSubmitting)
            }}
        >
            {({ touched, errors, values, isSubmitting }) => (
                <Form>
                    <FormContainer>
                        <div className="max-w-4xl mx-auto">
                            {/* ─── Premium Hero Header ─── */}
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 px-8 py-8 mb-8 shadow-xl">
                                {/* Decorative circles */}
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl"></div>
                                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>

                                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/20">
                                            <HiOutlineCog className="w-6 h-6 text-indigo-300 animate-[spin_8s_linear_infinite]" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white tracking-tight">
                                                Configuración
                                            </h2>
                                            <p className="text-indigo-200/70 text-sm mt-0.5">
                                                Personaliza tu empresa y la numeración de comprobantes
                                            </p>
                                        </div>
                                    </div>
                                    <div className="hidden md:flex items-center gap-3">
                                        <Button
                                            size="sm"
                                            className="!bg-white/10 !text-white !border-white/20 hover:!bg-white/20 rounded-xl h-10 px-5 backdrop-blur-sm transition-all"
                                            onClick={() => onDiscard?.()}
                                            type="button"
                                            icon={<HiOutlineArrowLeft />}
                                        >
                                            Descartar
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="solid"
                                            className="!bg-indigo-500 hover:!bg-indigo-400 !border-indigo-400 rounded-xl h-10 px-6 font-semibold shadow-lg shadow-indigo-500/25 transition-all"
                                            loading={isSubmitting}
                                            icon={<AiOutlineSave className="text-lg" />}
                                            type="submit"
                                        >
                                            {typeAction === 'create' ? 'Guardar' : 'Guardar Cambios'}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* ─── Content Sections ─── */}
                            <div className="space-y-6">
                                {/* Datos Generales */}
                                <GeneralConfigFields touched={touched} errors={errors} values={values} />

                                {/* Comprobantes Grid */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4 px-1">
                                        <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-indigo-500 to-cyan-400"></div>
                                        <h3 className="text-lg font-bold text-slate-800">Numeración de Comprobantes</h3>
                                    </div>
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                                        <TicketConfigFields touched={touched} errors={errors} />
                                        <InvoceFields touched={touched} errors={errors} />
                                        <BoletaFields touched={touched} errors={errors} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FormContainer>
                </Form>
            )}
        </Formik>
    )
})

ConfigForm.defaultProps = {
    initialData: {
        companyName: '',
        logoKey: null,
        logoUrl: '',
        invoceSerie: '',
        invoceNum: '',
        boletaSerie: '',
        boletaNum: '',
        ticketNum: ''
    },
    typeAction: 'create'
}

export default ConfigForm