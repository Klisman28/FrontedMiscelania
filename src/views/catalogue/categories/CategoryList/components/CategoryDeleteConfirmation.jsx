import React from 'react'
import { toast, Notification } from 'components/ui'
import { ConfirmDialog } from 'components/shared'
import { useSelector, useDispatch } from 'react-redux'
import { setSelectedCategory, toggleDeleteConfirmation } from '../store/stateSlice'
import { deleteCategory, getCategories } from '../store/dataSlice'

const CategoryDeleteConfirmation = () => {

    const dispatch = useDispatch()
    const dialogOpen = useSelector((state) => state.categories.state.deleteConfirmation)
    const selectedCategory = useSelector((state) => state.categories.state.selectedCategory)

    const onDialogClose = () => {
        dispatch(toggleDeleteConfirmation(false))
    }

    const onDelete = async () => {
        dispatch(toggleDeleteConfirmation(false))
        const res = await dispatch(deleteCategory(selectedCategory.id))

        const { message, type } = res.payload

        if (type === 'success') {
            dispatch(getCategories())
            dispatch(setSelectedCategory({}))
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
                    La categoría no se puede eliminar
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
            title="Eliminar Categoría"
            onCancel={onDialogClose}
            onConfirm={onDelete}
            confirmButtonColor="red-600"
        >
            <p>
                ¿Está seguro de que desea eliminar esta categoría?
                Esta acción no se puede deshacer.
            </p>
        </ConfirmDialog>
    )
}

export default CategoryDeleteConfirmation