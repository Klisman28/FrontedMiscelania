import React, { forwardRef } from 'react'
import { Tabs, FormContainer, } from 'components/ui'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import BasicInfoFields from './BasicInfoFields'
import ContactFields from './ContactFields'

const validationSchema = Yup.object().shape({
    name: Yup.string()
        .required("El nombre es requerido")
        .min(4, "El nombre debe ser mayor a 3 caracteres")
        .max(200, "El nombre no puede ser mayor a 100 caracteres"),
    ruc: Yup.string().notRequired().nullable(), // Campo NIT opcional
    website: Yup.string().notRequired(),
    email: Yup.string()
        .email("El email debe ser un correo electrónico válido")
        .notRequired()
        .nullable(), // Campo correo opcional
    telephone: Yup.string().notRequired(),
    address: Yup.string().notRequired()
})

const { TabNav, TabList, TabContent } = Tabs

const SupplierForm = forwardRef((props, ref) => {

    const { supplier, onFormSubmit } = props

    return (
        <Formik
            innerRef={ref}
            initialValues={{
                name: supplier?.name || '',
                ruc: supplier?.ruc || '',
                email: supplier?.email || '',
                website: supplier?.website || '',
                telephone: supplier?.telephone || '',
                address: supplier?.address || '',
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {

                if(values.website === '') {
                    delete values.website
                }

                if(values.address === '') {
                    delete values.address
                }

                onFormSubmit?.(values)
                setSubmitting(false)
            }}
        >
            {({ touched, errors, resetForm }) => (
                <Form>
                    <FormContainer>
                        <Tabs defaultValue="basicInfo">
                            <TabList>
                                <TabNav value="basicInfo">Información Básica</TabNav>
                                <TabNav value="contactInfo">Contactos</TabNav>
                            </TabList>
                            <div className="p-6">
                                <TabContent value="basicInfo">
                                    <BasicInfoFields touched={touched} errors={errors} />
                                </TabContent>
                                <TabContent value="contactInfo">
                                    <ContactFields touched={touched} errors={errors} />
                                </TabContent>
                            </div>
                        </Tabs>
                    </FormContainer>
                </Form>
            )}
        </Formik>
    )
})

export default SupplierForm
