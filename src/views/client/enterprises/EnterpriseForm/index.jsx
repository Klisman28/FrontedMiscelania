import React, { forwardRef } from 'react'
import { FormContainer } from 'components/ui'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import BasicInfoFields from './BasicInfoFields'
import ContactFields from './ContactFields'

// Validation Schema
const validationSchema = Yup.object().shape({
    name: Yup.string()
        .required("El nombre es requerido")
        .min(4, "El nombre debe ser mayor a 3 caracteres")
        .max(200, "el nombre no puede ser mayor a 200 caracteres"),
    ruc: Yup.string()
        .nullable(), // NIT Opcional
    email: Yup.string()
        .email("El email debe ser un correo electrónico válido")
        .nullable(), // Email Opcional
    telephone: Yup.string()
        .nullable(), // Teléfono Opcional
    website: Yup.string()
        .url("Debe ser una URL válida (ej: https://sitio.com)")
        .nullable(), // Website Opcional
    address: Yup.string()
        .nullable() // Dirección Opcional
})

const SupplierForm = forwardRef((props, ref) => {

    const { enterprise, onFormSubmit } = props

    return (
        <Formik
            innerRef={ref}
            initialValues={{
                name: enterprise?.name || '',
                ruc: enterprise?.ruc || '',
                email: enterprise?.email || '',
                telephone: enterprise?.telephone || '',
                address: enterprise?.address || '',
                website: enterprise?.website || '',
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                // Limpiar campos vacíos antes de enviar
                const cleanValues = { ...values }

                if (!cleanValues.email) delete cleanValues.email
                if (!cleanValues.telephone) delete cleanValues.telephone
                if (!cleanValues.address) delete cleanValues.address
                if (!cleanValues.ruc) delete cleanValues.ruc
                if (!cleanValues.website) delete cleanValues.website

                onFormSubmit?.(cleanValues)
                setSubmitting(false)
            }}
        >
            {({ touched, errors, values }) => (
                <Form className="h-full">
                    <FormContainer>
                        <div className="p-6">
                            {/* Sección: Información General */}
                            <div className="mb-8">
                                <h4 className="mb-4 text-base font-bold text-gray-900 border-b pb-2">Información General</h4>
                                <BasicInfoFields touched={touched} errors={errors} />
                            </div>

                            {/* Sección: Contactos */}
                            <div>
                                <h4 className="mb-4 text-base font-bold text-gray-900 border-b pb-2">Datos de Contacto</h4>
                                <ContactFields touched={touched} errors={errors} />
                            </div>
                        </div>
                    </FormContainer>
                </Form>
            )}
        </Formik>
    )
})

export default SupplierForm
