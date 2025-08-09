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
        .max(200, "el nombre no puede ser mayor a 100 caracteres"),
    ruc: Yup.string(),
    email: Yup.string()
        .email("El email debe ser un correo electrónico válido"),
    telephone: Yup.string(),
    address: Yup.string()
})

const { TabNav, TabList, TabContent } = Tabs

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
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {

                if (values.email === '') {
                    delete values.email
                }

                if (values.telephone === '') {
                    delete values.telephone
                }

                if (values.address === '') {
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
