import React from 'react'
import { toast, Notification } from 'components/ui'
import { ConfirmDialog } from 'components/shared'
import { useSelector, useDispatch } from 'react-redux'
import { setSelectedProduct, toggleDeleteConfirmation } from '../store/stateSlice'
import { deleteProduct, getProducts } from '../store/dataSlice'

const ProductDeleteConfirmation = () => {

    const dispatch = useDispatch()
    const dialogOpen = useSelector((state) => state.productList.state.deleteConfirmation)
    const selectedProduct = useSelector((state) => state.productList.state.selectedProduct)

    const onDialogClose = () => {
        dispatch(toggleDeleteConfirmation(false))
    }

    const onDelete = async () => {
        dispatch(toggleDeleteConfirmation(false))
        const res = await dispatch(deleteProduct(selectedProduct.id))

        if (res.meta.requestStatus === 'fulfilled') {
            dispatch(getProducts())
            dispatch(setSelectedProduct({}))
            toast.push(
                <Notification title={"¡Eliminación exitosa!"} type="success" duration={3000}>
                    {res.payload?.message || "Producto eliminado exitosamente"}
                </Notification>
                , {
                    placement: 'top-center'
                }
            )
        } else {
            const errorMessage = res.payload?.message || "El producto no se puede eliminar";
            toast.push(
                <Notification title={"¡Eliminación fallida!"} type="danger" duration={5000}>
                    {errorMessage}
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
            title="Eliminar Marca"
            onCancel={onDialogClose}
            onConfirm={onDelete}
            confirmButtonColor="red-600"
        >
            <p>
                ¿Está seguro de que desea eliminar este producto?<br />
                {/* Todos los registros relacionados con este producto también se eliminarán. */}
                Esta acción no se puede deshacer.
            </p>
        </ConfirmDialog>
    )
}

export default ProductDeleteConfirmation