import React, { forwardRef } from 'react'
import { Tabs, FormContainer, } from 'components/ui'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import dayjs from 'dayjs'
import BasicInfoFields from './BasicInfoFields'
import ContactFields from './ContactFields'


const validationSchema = Yup.object().shape({
    name: Yup.string()
        .required('Nombre es requerido')
        .min(3, '¡Demasiado corto!'),
    firstLastname: Yup.string()
        .required('Primer apellido es requerido')
        .min(3, '¡Demasiado corto!'),
    dni: Yup.string()
        .required("CUI es requerido")
        .matches(/[0-9]/, { message: "CUI solo admite números" })
        .min(8, "CUI debe ser tener 8 caracteres")
        .max(15, "CUI debe ser tener 8 caracteres")
        .trim("CUI no puede tener espacios"),
    birthdate: Yup.date(),
    email: Yup.string(),
    address: Yup.string()
})

const { TabNav, TabList, TabContent } = Tabs

const EmployeeForm = forwardRef((props, ref) => {

    const { employee, onFormSubmit } = props

    return (
        <Formik
            innerRef={ref}
            initialValues={{
                name: employee?.name || '',
                firstLastname: employee?.firstLastname || '',
                secondLastname: employee?.secondLastname || '',
                dni: employee?.dni || '',
                birthdate: employee?.birthdate && dayjs(employee?.birthdate,'DD/MM/YYYY').toDate(),
                gender: employee?.gender || '',
                email: employee?.email || '',
                telephone: employee?.telephone || '',
                address: employee?.address || '',
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

export default EmployeeForm
