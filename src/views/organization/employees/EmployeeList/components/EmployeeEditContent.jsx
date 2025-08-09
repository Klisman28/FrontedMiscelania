import React, { forwardRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { postEmployee, getEmployees, putEmployee } from '../store/dataSlice'
import { setDrawerClose, setSelectedEmployee } from '../store/stateSlice'
import EmployeeForm from '../../EmployeeForm'
import { toast, Notification } from 'components/ui'

const EmployeeEditContent = forwardRef((_, ref) => {

    const dispatch = useDispatch()

    const employee = useSelector((state) => state.employeeList.state.selectedEmployee)
    const actionForm = useSelector((state) => state.employeeList.state.actionForm)

    const onFormSubmit = async (values) => {

        let res = null

        if (actionForm === 'create') {
            res = await dispatch(postEmployee(values));
        } else {
            res = await dispatch(putEmployee({ id: employee.id, data: values }))
        }

        const { message, type } = res.payload

        if (type === 'success') {
            dispatch(getEmployees())
            dispatch(setDrawerClose())
            dispatch(setSelectedEmployee({}))
            toast.push(
                <Notification title={"¡Registro Existoso!"} type="success" duration={3000}>
                    {message}
                </Notification>
                , {
                    placement: 'top-center'
                }
            )
        } else {
            const { error } = res.payload
            let errorMessage = 'No se puede registrar el empleado, asegurese de enviar todos los campos correctos';
            if (message === 'SequelizeUniqueConstraintError') {
                const field = error[0]?.path

                switch (field) {
                    case 'dni':
                        errorMessage = 'El empleado con este DNI ya está registrada, no se puede duplicar'
                        break
                    default:
                        errorMessage = 'Error de conflicto con la duplicidad'
                        break
                }
            }

            toast.push(
                <Notification title={"¡Registro Fallido!"} type="danger" duration={3000}>
                    {errorMessage}
                </Notification>
                , {
                    placement: 'top-center'
                }
            )
        }
    }

    return (
        <EmployeeForm
            ref={ref}
            onFormSubmit={onFormSubmit}
            employee={employee}
        />
    )
})

export default EmployeeEditContent
