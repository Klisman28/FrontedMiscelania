import React from 'react'
import { toast, Notification } from 'components/ui'
import { ConfirmDialog } from 'components/shared'
import { useSelector, useDispatch } from 'react-redux'
import { setSelectedPurchas, toggleDeleteConfirmation } from '../store/stateSlice'
import { deletePurchas, getPurchases } from '../store/dataSlice'

const PurchasDeleteConfirmation = () => {

    const dispatch = useDispatch()
    const dialogOpen = useSelector((state) => state.purchasList.state.deleteConfirmation)
    const selectedPurchas = useSelector((state) => state.purchasList.state.selectedPurchas)

    const onDialogClose = () => {
        dispatch(toggleDeleteConfirmation(false))
    }

    const onDelete = async () => {
        dispatch(toggleDeleteConfirmation(false))
        const res = await dispatch(deletePurchas(selectedPurchas.id))

        const { message, type } = res.payload

        if (type === 'success') {
            dispatch(getPurchases())
            dispatch(setSelectedPurchas({}))
            toast.push(
                <Notification title={"Anulación exitoso!"} type="success" duration={3000}>
                    {message}
                </Notification>
                , {
                    placement: 'top-center'
                }
            )
        } else {
            toast.push(
                <Notification title={"¡Eliminación fallido!"} type="danger" duration={3000}>
                    La compra no se puede eliminar
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
            title="Anular Compra"
            onCancel={onDialogClose}
            onConfirm={onDelete}
            confirmButtonColor="red-600"
        >
            <p>
                ¿Está seguro de que desea anular esta compra?<br/>
                {/* Todos los registros relacionados con este purchaso también se eliminarán. */}
                Esta acción no se puede deshacer.
            </p>
        </ConfirmDialog>
    )
}

export default PurchasDeleteConfirmation