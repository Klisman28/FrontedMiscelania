import React, { forwardRef } from 'react'
import { Tabs, FormContainer, } from 'components/ui'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import BasicInfoForm from './BasicInfoForm'
// import SocialLinkForm from './SocialLinkForm'


const validationSchema = Yup.object().shape({
    name: Yup.string()
        .required('Nombre es requerido')
        .min(3, '¡Demasiado corto!'),
    code: Yup.string()
        .required('Código es requerido')
        .min(3, '¡Demasiado corto!'),
})

const { TabNav, TabList, TabContent } = Tabs

const CashierForm = forwardRef((props, ref) => {

    const { cashier, onFormSubmit } = props

    return (
        <Formik
            innerRef={ref}
            initialValues={{
                name: cashier?.name || '',
                code: cashier?.code || '',
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
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
                                {/* <TabNav value="social">Social</TabNav> */}
                            </TabList>
                            <div className="p-6">
                                <TabContent value="basicInfo">
                                    <BasicInfoForm touched={touched} errors={errors} />
                                </TabContent>
                                {/* <TabContent value="social">
                                    <SocialLinkForm touched={touched} errors={errors} />
                                </TabContent> */}
                            </div>
                        </Tabs>
                    </FormContainer>
                </Form>
            )}
        </Formik>
    )
})

export default CashierForm
