import React, { useState } from 'react'
import { Input, FormItem, Select, Switcher, Card } from 'components/ui'
import { Field } from 'formik'
import { useSelector } from 'react-redux'
import { HiEye, HiEyeOff } from 'react-icons/hi'
import RoleSelector from './RoleSelector'

const FormSection = ({ title, description, children, ...rest }) => (
    <div className="mb-6" {...rest}>
        <div className="mb-4">
            <h3 className="text-base font-bold text-gray-900">{title}</h3>
            {description && (
                <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
        </div>
        <div className="space-y-4">
            {children}
        </div>
    </div>
)

const BasicInfoFields = props => {
    const { values, touched, errors, setFieldValue } = props
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const employeeList = useSelector((state) => state.userList.data.employeeList)
    const roleList = useSelector((state) => state.userList.data.roleList)

    const employeeOptions = employeeList.map((employee) => ({
        value: employee.id,
        label: employee.fullname
    }))

    const statusOptions = [
        { value: true, label: 'Activo' },
        { value: false, label: 'Inactivo' }
    ]

    return (
        <div className="px-6 py-4">
            {/* === SECCIÓN: CUENTA === */}
            <FormSection
                title="Información de Cuenta"
                description="Credenciales y estado del usuario"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem
                        label="Nombre de Usuario"
                        invalid={errors.username && touched.username}
                        errorMessage={errors.username}
                        className="col-span-1 md:col-span-2"
                    >
                        <Field
                            type="text"
                            autoComplete="off"
                            name="username"
                            placeholder="Ej: admin, cajero1, etc."
                            component={Input}
                            className="w-full"
                        />
                    </FormItem>

                    <FormItem
                        label="Estado"
                        invalid={errors.status && touched.status}
                        errorMessage={errors.status}
                    >
                        <Field name="status">
                            {({ field, form }) => (
                                <Select
                                    placeholder="Seleccionar estado"
                                    options={statusOptions}
                                    value={statusOptions.find(opt => opt.value === values.status)}
                                    onChange={option => form.setFieldValue(field.name, option.value)}
                                />
                            )}
                        </Field>
                    </FormItem>
                </div>
            </FormSection>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* === SECCIÓN: SEGURIDAD === */}
            <FormSection
                title="Seguridad"
                description={values.__isEdit
                    ? "Deja los campos vacíos si no deseas cambiar la contraseña"
                    : "Configura una contraseña segura para el usuario"
                }
            >
                <FormItem
                    label={values.__isEdit ? "Nueva Contraseña (Opcional)" : "Contraseña"}
                    invalid={errors.password && touched.password}
                    errorMessage={errors.password}
                >
                    <div className="relative">
                        <Field
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            name="password"
                            placeholder={values.__isEdit ? "Dejar vacío para no cambiar" : "Mínimo 8 caracteres"}
                            component={Input}
                            className="w-full pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                        </button>
                    </div>
                </FormItem>

                <FormItem
                    label={values.__isEdit ? "Confirmar Nueva Contraseña" : "Confirmar Contraseña"}
                    invalid={errors.passwordConfirmation && touched.passwordConfirmation}
                    errorMessage={errors.passwordConfirmation}
                >
                    <div className="relative">
                        <Field
                            type={showConfirmPassword ? "text" : "password"}
                            autoComplete="new-password"
                            name="passwordConfirmation"
                            placeholder={values.__isEdit ? "Solo si cambias contraseña" : "Repetir contraseña"}
                            component={Input}
                            className="w-full pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showConfirmPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                        </button>
                    </div>
                </FormItem>

                {values.__isEdit && !values.password && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-700">
                            💡 <strong>Tip:</strong> No es necesario cambiar la contraseña al editar el usuario.
                            Solo completa estos campos si deseas actualizarla.
                        </p>
                    </div>
                )}
            </FormSection>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* === SECCIÓN: EMPLEADO === */}
            <FormSection
                title="Vinculación con Empleado"
                description="Asocia este usuario con un empleado del sistema"
            >
                <FormItem
                    label="Empleado"
                    invalid={errors.userableId && touched.userableId}
                    errorMessage={errors.userableId}
                >
                    <Field name="userableId">
                        {({ field, form }) => (
                            <Select
                                placeholder="Seleccione un empleado..."
                                options={employeeOptions}
                                value={employeeOptions.find(emp => emp.value === values.userableId)}
                                onChange={option => form.setFieldValue(field.name, option.value)}
                            />
                        )}
                    </Field>
                </FormItem>
            </FormSection>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* === SECCIÓN: ROLES === */}
            <FormSection
                title="Roles y Permisos"
                description="Define los niveles de acceso del usuario al sistema"
            >
                <Field name="roles">
                    {({ field, form }) => (
                        <RoleSelector
                            roleList={roleList}
                            selectedRoles={values.roles || []}
                            onChange={(roles) => form.setFieldValue(field.name, roles)}
                            error={errors.roles && touched.roles ? errors.roles : null}
                        />
                    )}
                </Field>
            </FormSection>
        </div>
    )
}

export default BasicInfoFields
