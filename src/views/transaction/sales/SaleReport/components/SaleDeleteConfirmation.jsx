import React from 'react'
import { toast, Notification } from 'components/ui'
import { ConfirmDialog } from 'components/shared'
import { useSelector, useDispatch } from 'react-redux'
import { setSelectedSale, toggleDeleteConfirmation } from '../store/stateSlice'
import { deleteSale, getSales } from '../store/dataSlice'

const SaleDeleteConfirmation = () => {

    const dispatch = useDispatch()
    const dialogOpen = useSelector((state) => state.saleReport.state.deleteConfirmation)
    const selectedSale = useSelector((state) => state.saleReport.state.selectedSale)

    const onDialogClose = () => {
        dispatch(toggleDeleteConfirmation(false))
    }

    const onDelete = async () => {
        dispatch(toggleDeleteConfirmation(false))
        const res = await dispatch(deleteSale(selectedSale.id))

        const { message, type } = res.payload

        if (type === 'success') {
            dispatch(getSales())
            dispatch(setSelectedSale({}))
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
                    La venta no se puede anular
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
                ¿Está seguro de que desea anular esta venta?<br/>
                {/* Todos los registros relacionados con este saleo también se eliminarán. */}
                Esta acción no se puede deshacer.
            </p>
        </ConfirmDialog>
    )
}

export default SaleDeleteConfirmation