import React, { forwardRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { postSubcategory, getSubcategories, putSubcategory } from '../store/dataSlice'
import { setDrawerClose, setSelectedSubcategory } from '../store/stateSlice'
import SubcategoryForm from '../../SubcategoryForm'
import { toast, Notification } from 'components/ui'

const SubcategoryEditContent = forwardRef((_, ref) => {

    const dispatch = useDispatch()

    const subcategory = useSelector((state) => state.subcategories.state.selectedSubcategory)
    const actionForm = useSelector((state) => state.subcategories.state.actionForm)
    // const { id } = subcategory

    const onFormSubmit = async (values) => {
        
        let res = null

        if (actionForm === 'create') {
            res = await dispatch(postSubcategory(values));
        } else{
            res = await dispatch(putSubcategory({id: subcategory.id, data:values}))
        }
    
        const { message, type } = res.payload

        if (type === 'success') {
            dispatch(getSubcategories())
            dispatch(setDrawerClose())
            dispatch(setSelectedSubcategory({}))
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
            let errorMessage = 'No se puede registrar la subcategoría, asegurese de enviar todos los campos correctos';
            if (message === 'SequelizeUniqueConstraintError') {
                const field = error[0]?.path

                switch (field) {
                    case 'name':
                        errorMessage = 'La subcategoría con este nombre ya está registrada, no se puede duplicar'
                        break
                    case 'code':
                        errorMessage = 'La subcategoría con este código ya está registrada, no se puede duplicar'
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
        <SubcategoryForm
            ref={ref}
            onFormSubmit={onFormSubmit}
            subcategory={subcategory}
        />
    )
})

export default SubcategoryEditContent
