import React from 'react'
import { toast, Notification } from 'components/ui'
import { ConfirmDialog } from 'components/shared'
import { useSelector, useDispatch } from 'react-redux'
import { setSelectedCustomer, toggleDeleteConfirmation } from '../store/stateSlice'
import { deleteCustomer, getCustomers } from '../store/dataSlice'

const CustomerDeleteConfirmation = () => {

    const dispatch = useDispatch()
    const dialogOpen = useSelector((state) => state.customerList.state.deleteConfirmation)
    const selectedCustomer = useSelector((state) => state.customerList.state.selectedCustomer)

    const onDialogClose = () => {
        dispatch(toggleDeleteConfirmation(false))
    }

    const onDelete = async () => {
        dispatch(toggleDeleteConfirmation(false))
        const res = await dispatch(deleteCustomer(selectedCustomer.id))

        const { message, type } = res.payload

        if (type === 'success') {
            dispatch(getCustomers())
            dispatch(setSelectedCustomer({}))
            toast.push(
                <Notification title={"¡Eliminación exitoso!"} type="success" duration={3000}>
                    {message}
                </Notification>
                , {
                    placement: 'top-center'
                }
            )
        } else {
            toast.push(
                <Notification title={"¡Eliminación fallido!"} type="danger" duration={3000}>
                    El cliente no se puede eliminar
                </Notification>
                , {
                    placement: 'top-center'
                }
            )
        }
    }

    return (
        <ConfirmDialog
            isOpen={dialogOpen}
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            type="danger"
            title="Eliminar Empleado"
            onCancel={onDialogClose}
            onConfirm={onDelete}
            confirmButtonColor="red-600"
        >
            <p>
                ¿Está seguro de que desea eliminar este cliente?
                {/* Todos los registros relacionados con este producto también se eliminarán. */}
                Esta acción no se puede deshacer.
            </p>
        </ConfirmDialog>
    )
}

export default CustomerDeleteConfirmation