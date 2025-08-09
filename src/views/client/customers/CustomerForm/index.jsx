import React, { forwardRef } from 'react'
import { Tabs, FormContainer, } from 'components/ui'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import BasicInfoFields from './BasicInfoFields'
import ContactFields from './ContactFields'


const validationSchema = Yup.object().shape({
    name: Yup.string()
        .required('Nombre es requerido')
        .min(3, '¡Demasiado corto!'),
    firstLastname: Yup.string()
        .required('Primer apellido es requerido')
        .min(3, '¡Demasiado corto!'),
    secondLastname: Yup.string(),
    dni: Yup.string(),
    email: Yup.string().email("Email debe ser un correo electrónico válido"),
    telephone: Yup.string().notRequired(),
    address: Yup.string()
})

const { TabNav, TabList, TabContent } = Tabs

const CustomerForm = forwardRef((props, ref) => {

    const { customer, onFormSubmit } = props

    return (
        <Formik
            innerRef={ref}
            initialValues={{
                name: customer?.name || '',
                firstLastname: customer?.firstLastname || '',
                secondLastname: customer?.secondLastname || '',
                dni: customer?.dni || '',
                email: customer?.email || '',
                telephone: customer?.telephone || '',
                address: customer?.address || '',
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                if(values.email === '') {
                    delete values.email
                }

                if(values.telephone === '') {
                    delete values.telephone
                }

                if(values.address === '') {
                    delete values.address
                }

                onFormSubmit?.(values)
                setSubmitting(false)
            }}
        >
            {({ values, touched, errors, resetForm }) => (
                <Form>
                    <FormContainer>
                        <Tabs defaultValue="basicInfo">
                            <TabList>
                                <TabNav value="basicInfo">Información Básica</TabNav>
                                <TabNav value="contactInfo">Contactos</TabNav>
                            </TabList>
                            <div className="p-6">
                                <TabContent value="basicInfo">
                                    <BasicInfoFields values={values} touched={touched} errors={errors} />
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

export default CustomerForm
