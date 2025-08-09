import React, { forwardRef, useEffect } from 'react'
import { Tabs, FormContainer, } from 'components/ui'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import BasicInfoForm from './BasicInfoForm'
import { injectReducer } from 'store/index'
import reducer from './store'
import { useDispatch } from 'react-redux'
import { getCashiersAvailable } from './store/formSlice'

const validationSchema = Yup.object().shape({
    initBalance: Yup.number()
        .required('Saldo inicial es requerido')
        .min(0, 'Ingrese un número'),
    cashierId: Yup.string()
        .required('Por favor seleccione una caja'),
})

injectReducer('openingForm', reducer)

const { TabNav, TabList, TabContent } = Tabs

const OpeningForm = forwardRef((props, ref) => {

    const dispatch = useDispatch()

    const { onFormSubmit } = props

    useEffect(() => {
        dispatch(getCashiersAvailable())
    }, [dispatch])

    return (
        <Formik
            innerRef={ref}
            initialValues={{
                initBalance: '',
                cashierId: '',
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                onFormSubmit?.(values)
                setSubmitting(false)
            }}
        >
            {({ values, touched, errors }) => (
                <Form>
                    <FormContainer>
                        <Tabs defaultValue="basicInfo">
                            <TabList>
                                <TabNav value="basicInfo">Registrar Apertura</TabNav>
                                {/* <TabNav value="social">Social</TabNav> */}
                            </TabList>
                            <div className="p-6">
                                <TabContent value="basicInfo">
                                    <BasicInfoForm touched={touched} errors={errors} values={values}/>
                                </TabContent>
                            </div>
                        </Tabs>
                    </FormContainer>
                </Form>
            )}
        </Formik>
    )
})

export default OpeningForm
