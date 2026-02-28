import React, { forwardRef, useEffect } from 'react'
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
        .when('$isEdit', {
            is: false, // Si NO es edición
            then: (schema) => schema
                .required("La contraseña es requerida")
                .min(8, "La contraseña debe ser mayor a 8 caracteres"),
            otherwise: (schema) => schema
                .nullable()
                .min(8, "La contraseña debe ser mayor a 8 caracteres")
        }),
    passwordConfirmation: Yup.string()
        .when('password', {
            is: (val) => val && val.length > 0, // Si hay contraseña
            then: (schema) => schema
                .required("La confirmación de contraseña es requerida")
                .oneOf([Yup.ref('password'), null], "La confirmación no coincide"),
            otherwise: (schema) => schema.nullable()
        }),
    userableType: Yup.string()
        .required("El tipo de usuario es requerido"),
    status: Yup.boolean(),
    userableId: Yup.string()
        .required('Por favor seleccione un empleado'),
    roles: Yup.array().min(1, "Debes seleccionar por lo menos un rol"),
})

const UserForm = forwardRef((props, ref) => {

    const { user, onFormSubmit } = props
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getEmployees())
        dispatch(getUserRoles())
    })

    const roles = user?.roles?.map((role) => role.id)
    const isEdit = !!user?.id // Si tiene ID, estamos editando

    // Convertir status a boolean
    const parseStatus = (status) => {
        if (typeof status === 'boolean') return status
        if (status === 'Activo' || status === 'activo' || status === 1 || status === '1') return true
        if (status === 'Inactivo' || status === 'inactivo' || status === 0 || status === '0') return false
        return true // Default a true si no hay valor
    }

    return (
        <Formik
            innerRef={ref}
            initialValues={{
                __isEdit: isEdit, // Flag para UI
                username: user?.username || '',
                // created: user?.created || true,
                userableType: user?.userableType || 'employees',
                password: '',
                passwordConfirmation: '',
                status: parseStatus(user?.status), // Convertir a boolean
                userableId: user?.userableId || '',
                roles: roles,
            }}
            validationSchema={validationSchema}
            validationContext={{ isEdit }} // Pasar contexto para validación
            onSubmit={(values, { setSubmitting }) => {
                console.log('🔍 FORM SUBMIT CALLED')
                console.log('Is Edit:', isEdit)
                console.log('Form Values:', values)

                // Si es edición y no hay password, eliminar campos de password
                const submitData = { ...values }
                delete submitData.__isEdit // No enviar flag interno al backend

                if (isEdit && !values.password) {
                    console.log('✅ Removing empty password fields')
                    delete submitData.password
                    delete submitData.passwordConfirmation
                }

                console.log('📤 Submit Data:', submitData)
                onFormSubmit?.(submitData)
                setSubmitting(false)
            }}
        >
            {({ values, touched, errors, resetForm, isValid, isSubmitting }) => {
                // Debug: Log errors directly (no useEffect needed)
                if (Object.keys(errors).length > 0) {
                    console.log('❌ Validation Errors:', errors)
                    console.log('Is Valid:', isValid)
                } else {
                    console.log('✅ No validation errors, isValid:', isValid)
                }

                return (
                    <Form>
                        <BasicInfoFields
                            values={values}
                            touched={touched}
                            errors={errors}
                            setFieldValue={(field, value) => {
                                // Helper para setFieldValue desde BasicInfoFields
                                return value
                            }}
                        />
                    </Form>
                )
            }}
        </Formik>
    )
})

export default UserForm
