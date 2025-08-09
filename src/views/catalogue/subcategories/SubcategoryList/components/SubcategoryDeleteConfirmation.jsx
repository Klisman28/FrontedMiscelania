import React from 'react'
import { toast, Notification } from 'components/ui'
import { ConfirmDialog } from 'components/shared'
import { useSelector, useDispatch } from 'react-redux'
import { setSelectedSubcategory, toggleDeleteConfirmation } from '../store/stateSlice'
import { deleteSubcategory, getSubcategories } from '../store/dataSlice'

const SubcategoryDeleteConfirmation = () => {

    const dispatch = useDispatch()
    const dialogOpen = useSelector((state) => state.subcategories.state.deleteConfirmation)
    const selectedSubcategory = useSelector((state) => state.subcategories.state.selectedSubcategory)

    const onDialogClose = () => {
        dispatch(toggleDeleteConfirmation(false))
    }

    const onDelete = async () => {
        dispatch(toggleDeleteConfirmation(false))
        const res = await dispatch(deleteSubcategory(selectedSubcategory.id))
        const { message, type } = res.payload

        if (type === 'success') {
            dispatch(getSubcategories())
            dispatch(setSelectedSubcategory({}))
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
                    La subcategoría no se puede eliminar
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
                ¿Está seguro de que desea eliminar esta subcategoría?
                {/* Todos los registros relacionados con este producto también se eliminarán. */}
                Esta acción no se puede deshacer.
            </p>
        </ConfirmDialog>
    )
}

export default SubcategoryDeleteConfirmation