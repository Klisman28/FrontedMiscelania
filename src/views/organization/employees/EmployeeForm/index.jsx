import React, { forwardRef } from 'react'
import { FormContainer, Button, Input, FormItem, DatePicker, Radio } from 'components/ui'
import { Form, Formik, Field } from 'formik'
import * as Yup from 'yup'
import dayjs from 'dayjs'
import { NumericFormat, PatternFormat } from 'react-number-format'
import { AiOutlineSave, AiOutlineCloseCircle } from 'react-icons/ai'

const validationSchema = Yup.object().shape({
    name: Yup.string()
        .required('Nombre es requerido')
        .min(3, '¡Demasiado corto!'),
    firstLastname: Yup.string()
        .required('Primer apellido es requerido')
        .min(3, '¡Demasiado corto!'),
    secondLastname: Yup.string()
        .nullable(),
    dni: Yup.string()
        .required("CUI es requerido")
        .min(8, "CUI debe tener al menos 8 caracteres")
        .max(15, "CUI no puede exceder 15 caracteres")
        .trim("CUI no puede tener espacios"),
    birthdate: Yup.date().nullable(),
    gender: Yup.string().required('Sexo es requerido'),
    email: Yup.string().email('Email inválido').nullable(),
    telephone: Yup.string().nullable(),
    address: Yup.string().nullable()
})

const NumberInput = props => {
    return <Input {...props} value={props.field.value} />
}



const EmployeeForm = forwardRef((props, ref) => {

    const { employee, onFormSubmit, onDiscard } = props

    return (
        <Formik
            innerRef={ref}
            initialValues={{
                name: employee?.name || '',
                firstLastname: employee?.firstLastname || '',
                secondLastname: employee?.secondLastname || '',
                dni: employee?.dni || '',
                birthdate: employee?.birthdate ? dayjs(employee.birthdate).toDate() : null,
                gender: employee?.gender || '',
                email: employee?.email || '',
                telephone: employee?.telephone || '',
                address: employee?.address || '',
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                const payload = { ...values }

                // Clean optional empty strings
                if (!payload.secondLastname) delete payload.secondLastname
                if (!payload.email) delete payload.email
                if (!payload.telephone) delete payload.telephone
                if (!payload.address) delete payload.address

                onFormSubmit?.(payload)
                setSubmitting(false)
            }}
        >
            {({ values, touched, errors, isSubmitting, setFieldValue }) => (
                <Form className="flex flex-col h-full bg-white">
                    <FormContainer className="flex-grow pb-20">

                        {/* Header Section */}
                        <div className="px-6 py-6 border-b border-gray-200 bg-gray-50/50">
                            <h3 className="text-xl font-bold text-gray-900">
                                {employee ? 'Editar Empleado' : 'Nuevo Empleado'}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Complete la información personal y de contacto del colaborador.
                            </p>
                        </div>

                        <div className="p-6">
                            {/* Sección Datos Personales */}
                            <div className="mb-6">
                                <h4 className="text-base font-bold text-indigo-600 mb-4 flex items-center gap-2">
                                    <span className="w-1 h-5 bg-indigo-600 rounded-full inline-block"></span>
                                    Datos Personales
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                    {/* Nombre | CUI */}
                                    <FormItem
                                        label="Nombre"
                                        asterisk
                                        invalid={errors.name && touched.name}
                                        errorMessage={errors.name}
                                    >
                                        <Field
                                            name="name"
                                            placeholder="Ej: Klisman"
                                            component={Input}
                                            autoFocus
                                            autoComplete="off"
                                        />
                                    </FormItem>

                                    <FormItem
                                        label="CUI"
                                        asterisk
                                        invalid={errors.dni && touched.dni}
                                        errorMessage={errors.dni}
                                    >
                                        <Field name="dni">
                                            {({ field, form }) => (
                                                <NumericFormat
                                                    placeholder="Ej: 1234 56789 0101"
                                                    customInput={Input}
                                                    value={field.value}
                                                    onValueChange={e => {
                                                        form.setFieldValue(field.name, e.value)
                                                    }}
                                                    autoComplete="off"
                                                />
                                            )}
                                        </Field>
                                    </FormItem>

                                    {/* Primer Apellido | Segundo Apellido */}
                                    <FormItem
                                        label="Primer Apellido"
                                        asterisk
                                        invalid={errors.firstLastname && touched.firstLastname}
                                        errorMessage={errors.firstLastname}
                                    >
                                        <Field
                                            name="firstLastname"
                                            placeholder="Ej: Aguirre"
                                            component={Input}
                                            autoComplete="off"
                                        />
                                    </FormItem>

                                    <FormItem
                                        label="Segundo Apellido"
                                        invalid={errors.secondLastname && touched.secondLastname}
                                        errorMessage={errors.secondLastname}
                                    >
                                        <Field
                                            name="secondLastname"
                                            placeholder="Ej: Méndez"
                                            component={Input}
                                            autoComplete="off"
                                        />
                                    </FormItem>

                                    {/* Cumpleaños | Sexo */}
                                    <FormItem
                                        label="Cumpleaños"
                                        invalid={errors.birthdate && touched.birthdate}
                                        errorMessage={errors.birthdate}
                                    >
                                        <Field name="birthdate">
                                            {({ field, form }) => (
                                                <DatePicker
                                                    placeholder="Seleccionar fecha"
                                                    value={field.value}
                                                    onChange={(date) => {
                                                        form.setFieldValue(field.name, date)
                                                    }}
                                                    locale="es"
                                                    inputFormat="DD/MM/YYYY"
                                                />
                                            )}
                                        </Field>
                                    </FormItem>

                                    <FormItem
                                        label="Sexo"
                                        asterisk
                                        invalid={errors.gender && touched.gender}
                                        errorMessage={errors.gender}
                                    >
                                        <Field name="gender">
                                            {({ field, form }) => (
                                                <Radio.Group
                                                    value={values.gender}
                                                    onChange={val => form.setFieldValue(field.name, val)}
                                                    className="flex items-center gap-6 mt-2"
                                                >
                                                    <Radio value="Masculino">Masculino</Radio>
                                                    <Radio value="Femenino">Femenino</Radio>
                                                </Radio.Group>
                                            )}
                                        </Field>
                                    </FormItem>
                                </div>
                            </div>

                            {/* Separador */}
                            <hr className="my-6 border-slate-100" />

                            {/* Sección Contacto */}
                            <div>
                                <h4 className="text-base font-bold text-indigo-600 mb-4 flex items-center gap-2">
                                    <span className="w-1 h-5 bg-indigo-600 rounded-full inline-block"></span>
                                    Contacto
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                    <FormItem
                                        label="Email"
                                        invalid={errors.email && touched.email}
                                        errorMessage={errors.email}
                                    >
                                        <Field
                                            name="email"
                                            placeholder="correo@empresa.com"
                                            component={Input}
                                            autoComplete="off"
                                        />
                                    </FormItem>

                                    <FormItem
                                        label="Teléfono"
                                        invalid={errors.telephone && touched.telephone}
                                        errorMessage={errors.telephone}
                                    >
                                        <Field
                                            name="telephone"
                                            placeholder="+502 5555-5555"
                                            component={Input}
                                            autoComplete="off"
                                        />
                                    </FormItem>

                                    <div className="md:col-span-2">
                                        <FormItem
                                            label="Dirección"
                                            invalid={errors.address && touched.address}
                                            errorMessage={errors.address}
                                        >
                                            <Field
                                                name="address"
                                                placeholder="Zona, colonia, referencia..."
                                                component={Input}
                                                autoComplete="off"
                                            />
                                        </FormItem>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sticky Footer */}
                        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[-10px_-10px_30px_4px_rgba(0,0,0,0.05)] z-10 flex justify-end gap-3 rounded-b-lg">
                            <Button
                                type="button"
                                className="text-gray-600 hover:bg-slate-100"
                                onClick={onDiscard}
                                icon={<AiOutlineCloseCircle className="text-lg" />}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="solid"
                                type="submit"
                                loading={isSubmitting}
                                icon={<AiOutlineSave className="text-lg" />}
                                disabled={isSubmitting}
                            >
                                Guardar
                            </Button>
                        </div>

                    </FormContainer>
                </Form>
            )}
        </Formik>
    )
})

export default EmployeeForm
