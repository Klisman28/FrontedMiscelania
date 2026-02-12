import React, { forwardRef } from 'react'
import { FormContainer } from 'components/ui'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import BasicInfoFields from './BasicInfoFields'
import ContactFields from './ContactFields'

// Schema de validación
const validationSchema = Yup.object().shape({
    firstName: Yup.string()
        .required('Nombre es requerido')
        .min(2, 'Mínimo 2 caracteres'),
    lastName: Yup.string()
        .required('Apellidos son requeridos')
        .min(2, 'Mínimo 2 caracteres'),
    isFinalConsumer: Yup.boolean(),
    nit: Yup.string().when('isFinalConsumer', {
        is: false,
        then: (schema) => schema.nullable().matches(/^[0-9-]+$/, 'Solo números y guiones').min(5, 'NIT inválido'),
        otherwise: (schema) => schema.nullable()
    }),
    email: Yup.string()
        .email("Email inválido")
        .nullable(),
    telephone: Yup.string().nullable(),
    address: Yup.string().nullable()
})

const CustomerForm = forwardRef((props, ref) => {

    const { customer, onFormSubmit } = props

    // Mapper para compatibilidad con backend viejo/nuevo
    const getInitialValues = (data) => {
        // Nuevo formato
        if (data?.firstName) {
            return {
                firstName: data.firstName,
                lastName: data.lastName,
                isFinalConsumer: data.isFinalConsumer || false,
                nit: data.nit || '',
                email: data.email || '',
                telephone: data.telephone || '',
                address: data.address || '',
            }
        }
        // Viejo formato (fallback)
        if (data?.name) {
            return {
                firstName: data.name || '',
                lastName: `${data.firstLastname || ''} ${data.secondLastname || ''}`.trim(),
                isFinalConsumer: false,
                nit: data.dni || '',
                email: data.email || '',
                telephone: data.telephone || '',
                address: data.address || '',
            }
        }
        // Default (Nuevo)
        return {
            firstName: '',
            lastName: '',
            isFinalConsumer: false,
            nit: '',
            email: '',
            telephone: '',
            address: '',
        }
    }

    return (
        <Formik
            innerRef={ref}
            initialValues={getInitialValues(customer)}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                const payload = { ...values }

                // Limpiar campos opcionales vacíos
                if (!payload.email) delete payload.email
                if (!payload.telephone) delete payload.telephone
                if (!payload.address) delete payload.address

                // Lógica CF
                if (payload.isFinalConsumer) {
                    payload.nit = 'CF'
                } else {
                    if (!payload.nit) delete payload.nit
                }

                onFormSubmit?.(payload)
                setSubmitting(false)
            }}
        >
            {({ values, touched, errors, setFieldValue }) => (
                <Form className="h-full">
                    <FormContainer>
                        <div className="p-6">
                            {/* Sección: Información Personal */}
                            <div className="mb-8">
                                <h4 className="mb-4 text-base font-bold text-gray-900 border-b pb-2">Información Personal</h4>
                                <BasicInfoFields
                                    values={values}
                                    touched={touched}
                                    errors={errors}
                                    setFieldValue={setFieldValue}
                                />
                            </div>

                            {/* Sección: Contactos */}
                            <div>
                                <h4 className="mb-4 text-base font-bold text-gray-900 border-b pb-2">Datos de Contacto</h4>
                                <ContactFields
                                    values={values}
                                    touched={touched}
                                    errors={errors}
                                />
                            </div>
                        </div>
                    </FormContainer>
                </Form>
            )}
        </Formik>
    )
})

export default CustomerForm
