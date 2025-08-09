import React, { forwardRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { postCategory, getCategories, putCategory } from '../store/dataSlice'
import { setDrawerClose, setSelectedCategory } from '../store/stateSlice'
import CategoryForm from '../../CategoryForm'
import { toast, Notification } from 'components/ui'

const CategoryEditContent = forwardRef((_, ref) => {

    const dispatch = useDispatch()

    const category = useSelector((state) => state.categories.state.selectedCategory)
    const actionForm = useSelector((state) => state.categories.state.actionForm)
    // const { id } = category

    const onFormSubmit = async (values) => {
        
        let res = null

        if (actionForm === 'create') {
            res = await dispatch(postCategory(values));
        } else{
            res = await dispatch(putCategory({id: category.id, data:values}))
        }
    
        const { message, type } = res.payload

        if (type === 'success') {
            dispatch(getCategories())
            dispatch(setDrawerClose())
            dispatch(setSelectedCategory({}))
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
            let errorMessage = 'No se puede registrar la categoría, asegurese de enviar todos los campos correctos';
            if (message === 'SequelizeUniqueConstraintError') {
                const field = error[0]?.path

                switch (field) {
                    case 'name':
                        errorMessage = 'La categoría con este nombre ya está registrada, no se puede duplicar'
                        break
                    case 'code':
                        errorMessage = 'La categoría con este código ya está registrada, no se puede duplicar'
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
        <CategoryForm
            ref={ref}
            onFormSubmit={onFormSubmit}
            category={category}
        />
    )
})

export default CategoryEditContent
