import React, { forwardRef, useEffect } from 'react'
import { Tabs, FormContainer, } from 'components/ui'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import BasicInfoFields from './BasicInfoFields'
import { getEmployees, getUserRoles } from '../UserList/store/dataSlice'
import { useDispatch } from 'react-redux'


const validationSchema = Yup.object().shape({
    username: Yup.string()
        .required("El username es requerido")
        .min(4, "El username debe ser mayor a 4 caracteres")
        .max(20, "el username no puede ser mayor a 20 caracteres"),
    password: Yup.string()
        .required("La contraseña es requerida")
        .min(8, "La contraseñao debe ser mayor a 8 caracteres"),
    passwordConfirmation: Yup.string()
        .required("La confirmación de contraseña es requerida")
        .oneOf([Yup.ref('password'), null], "La confirmación no coincide"),
    userableType: Yup.string()
        .required("El tipo de usuario es requerido"),
    status: Yup.boolean(),
    userableId: Yup.string()
        .required('Por favor seleccione un empleado'),
    roles: Yup.array().min(1, "Debes seleccionar por lo menos un rol"),
})

const { TabNav, TabList, TabContent } = Tabs

const UserForm = forwardRef((props, ref) => {

    const { user, onFormSubmit } = props
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getEmployees())
        dispatch(getUserRoles())
    })

    const roles = user?.roles?.map((role) => role.id)

    return (
        <Formik
            innerRef={ref}
            initialValues={{
                username: user?.username || '',
                // created: user?.created || true,
                userableType: user?.userableType || 'employees',
                password: '',
                passwordConfirmation: '',
                status: user?.status || true,
                userableId: user?.userableId || '',
                roles: roles,
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
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
                            </TabList>
                            <div className="p-6">
                                <TabContent value="basicInfo">
                                    <BasicInfoFields values={values} touched={touched} errors={errors} />
                                </TabContent>
                            </div>
                        </Tabs>
                    </FormContainer>
                </Form>
            )}
        </Formik>
    )
})

export default UserForm
