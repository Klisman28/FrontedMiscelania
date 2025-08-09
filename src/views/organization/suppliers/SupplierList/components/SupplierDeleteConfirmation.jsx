import React from 'react'
import { toast, Notification } from 'components/ui'
import { ConfirmDialog } from 'components/shared'
import { useSelector, useDispatch } from 'react-redux'
import { setSelectedSupplier, toggleDeleteConfirmation } from '../store/stateSlice'
import { deleteSupplier, getSuppliers } from '../store/dataSlice'

const SupplierDeleteConfirmation = () => {

    const dispatch = useDispatch()
    const dialogOpen = useSelector((state) => state.supplierList.state.deleteConfirmation)
    const selectedSupplier = useSelector((state) => state.supplierList.state.selectedSupplier)

    const onDialogClose = () => {
        dispatch(toggleDeleteConfirmation(false))
    }

    const onDelete = async () => {
        dispatch(toggleDeleteConfirmation(false))
        const res = await dispatch(deleteSupplier(selectedSupplier.id))

        const { message, type } = res.payload

        if (type === 'success') {
            dispatch(getSuppliers())
            dispatch(setSelectedSupplier({}))
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
                    El proveedor no se puede eliminar
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
                ¿Está seguro de que desea eliminar este proveedor?
                {/* Todos los registros relacionados con este producto también se eliminarán. */}
                Esta acción no se puede deshacer.
            </p>
        </ConfirmDialog>
    )
}

export default SupplierDeleteConfirmation