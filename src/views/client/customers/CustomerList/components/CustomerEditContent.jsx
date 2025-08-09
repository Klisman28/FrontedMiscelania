import React, { forwardRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { postCustomer, getCustomers, putCustomer } from '../store/dataSlice'
import { setDrawerClose, setSelectedCustomer } from '../store/stateSlice'
import CustomerForm from '../../CustomerForm'
import { toast, Notification } from 'components/ui'

const CustomerEditContent = forwardRef((_, ref) => {

    const dispatch = useDispatch()

    const customer = useSelector((state) => state.customerList.state.selectedCustomer)
    const actionForm = useSelector((state) => state.customerList.state.actionForm)

    const onFormSubmit = async (values) => {

        let res = null

        if (actionForm === 'create') {
            res = await dispatch(postCustomer(values));
        } else {
            res = await dispatch(putCustomer({ id: customer.id, data: values }))
        }

        const { message, type } = res.payload

        if (type === 'success') {
            dispatch(getCustomers())
            dispatch(setDrawerClose())
            dispatch(setSelectedCustomer({}))
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
            let errorMessage = 'No se puede registrar el cliente, asegurese de enviar todos los campos correctos';
            if (message === 'SequelizeUniqueConstraintError') {
                const field = error[0]?.path

                switch (field) {
                    case 'dni':
                        errorMessage = 'El cliente con este DNI ya está registrada, no se puede duplicar'
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
        <CustomerForm
            ref={ref}
            onFormSubmit={onFormSubmit}
            customer={customer}
        />
    )
})

export default CustomerEditContent
