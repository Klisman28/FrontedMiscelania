import React from 'react'
import { Input, FormItem, Select, Checkbox } from 'components/ui'
import { Field } from 'formik'
import { useSelector } from 'react-redux'

const BasicInfoFields = props => {

    const { values, touched, errors } = props

    const employeeList = useSelector((state) => state.userList.data.employeeList)
    const roleList = useSelector((state) => state.userList.data.roleList)

    console.log(errors);
    const employeeOptions = employeeList.map((empoyee) => {
        return {
            value: empoyee.id,
            label: `${empoyee.fullname}`
        }
    })

    return (
        <>
            <FormItem
                label="Nombre de Usuario"
                invalid={errors.username && touched.username}
                errorMessage={errors.username}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="username"
                    placeholder="usuario"
                    component={Input}
                />
            </FormItem>
            <FormItem
                label="Contraseña"
                invalid={errors.password && touched.password}
                errorMessage={errors.password}
            >
                <Field
                    type="password"
                    autoComplete="off"
                    name="password"
                    placeholder="contraseña"
                    component={Input}
                />
            </FormItem>
            <FormItem
                label="Confirmar Contraseña"
                invalid={errors.passwordConfirmation && touched.passwordConfirmation}
                errorMessage={errors.passwordConfirmation}
            >
                <Field
                    type="password"
                    autoComplete="off"
                    name="passwordConfirmation"
                    placeholder="confirmar"
                    component={Input}
                />
            </FormItem>
            <FormItem
                label="Empleado"
                invalid={errors.userableId && touched.userableId}
                errorMessage={errors.userableId}
            >
                <Field name="userableId">
                    {({ field, form }) => (
                        <Select
                            field={field}
                            form={form}
                            placeholder="Seleccione una unidad..."
                            options={employeeOptions}
                            value={employeeOptions.filter(employee => employee.value === values.userableId)}
                            onChange={option => form.setFieldValue(field.name, option.value)}
                        />
                    )}
                </Field>
            </FormItem>
            <FormItem
                label="Roles"
                invalid={errors.roles && touched.roles}
                errorMessage={errors.roles}
            >
                <Field name="roles">
                    {({ field, form }) => (
                        <>
                            <Checkbox.Group
                                onChange={options => form.setFieldValue(field.name, options)}
                                value={values.roles}
                            >
                                {roleList?.map((role, key) => (
                                    <Checkbox key={key} name="roles" value={role.id}>{role.name} </Checkbox>
                                ))}
                            </Checkbox.Group>
                        </>
                    )}
                </Field>
            </FormItem>
        </>
    )
}

export default BasicInfoFields
