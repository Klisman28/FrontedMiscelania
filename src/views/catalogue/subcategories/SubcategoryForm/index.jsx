import React, { forwardRef } from 'react'
import { Tabs, FormContainer } from 'components/ui'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import BasicInfoForm from './BasicInfoForm'
// import SocialLinkForm from './SocialLinkForm'


const validationSchema = Yup.object().shape({
    name: Yup.string()
        .required('Por favor ingrese nombre')
        .min(3, '¡Demasiado corto!'),
    code: Yup.string()
        .required('Por favor ingrese Código')
        .min(3, '¡Demasiado corto!'),
    categoryId: Yup.string()
        .required('Por favor seleccione categoría')
})

const { TabNav, TabList, TabContent } = Tabs

const SubcategoryForm = forwardRef((props, ref) => {

    const { subcategory, onFormSubmit } = props

    return (
        <Formik
            innerRef={ref}
            initialValues={{
                name: subcategory?.name || '',
                code: subcategory?.code || '',
                categoryId: subcategory?.categoryId || ''
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                onFormSubmit?.(values)
                setSubmitting(false)
            }}
            // onSubmit={(values, { setSubmitting }) => {
            //     // console.log('values', values)
            //     setTimeout(() => {
            //         alert(JSON.stringify(values, null, 2))
            //         setSubmitting(false)
            //     }, 400)
            // }}
        >
            {({ values, touched, errors, resetForm }) => (
                <Form>
                    <FormContainer>
                        <Tabs defaultValue="basicInfo">
                            <TabList>
                                <TabNav value="basicInfo">Información Básica</TabNav>
                                {/* <TabNav value="social">Social</TabNav> */}
                            </TabList>
                            <div className="p-6">
                                <TabContent value="basicInfo">
                                    <BasicInfoForm touched={touched} errors={errors} values={values} />
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

export default SubcategoryForm
