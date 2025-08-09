import React, { forwardRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { postBrand, getBrands, putBrand } from '../store/dataSlice'
import { setDrawerClose, setSelectedBrand } from '../store/stateSlice'
import BrandForm from '../../BrandForm'
import { toast, Notification } from 'components/ui'

const BrandEditContent = forwardRef((_, ref) => {

    const dispatch = useDispatch()

    const brand = useSelector((state) => state.brands.state.selectedBrand)
    const actionForm = useSelector((state) => state.brands.state.actionForm)

    const onFormSubmit = async (values) => {
        
        let res = null

        if (actionForm === 'create') {
            res = await dispatch(postBrand(values));
        } else{
            res = await dispatch(putBrand({id: brand.id, data:values}))
        }
    
        const { message, type } = res.payload

        if (type === 'success') {
            dispatch(getBrands())
            dispatch(setDrawerClose())
            dispatch(setSelectedBrand({}))
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
            let errorMessage = 'No se puede registrar la marca, asegurese de enviar todos los campos correctos';
            if (message === 'SequelizeUniqueConstraintError') {
                const field = error[0]?.path

                switch (field) {
                    case 'name':
                        errorMessage = 'La marca con este nombre ya está registrada, no se puede duplicar'
                        break
                    case 'code':
                        errorMessage = 'La marca con este código ya está registrada, no se puede duplicar'
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
        <BrandForm
            ref={ref}
            onFormSubmit={onFormSubmit}
            brand={brand}
        />
    )
})

export default BrandEditContent
