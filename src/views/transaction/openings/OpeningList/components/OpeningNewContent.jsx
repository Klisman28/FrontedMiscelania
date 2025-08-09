import React, { forwardRef } from 'react'
import { useDispatch } from 'react-redux'
import { postOpening, getOpeningCurrent } from '../store/dataSlice'
import { setDrawerClose } from '../store/stateSlice'
import OpeningForm from '../../OpeningForm'
import { toast, Notification } from 'components/ui'

const OpeningNewContent = forwardRef((_, ref) => {

    const dispatch = useDispatch()

    const onFormSubmit = async (values) => {

        const res = await dispatch(postOpening(values));
    
        const { message, type } = res.payload

        if (type === 'success') {
            dispatch(setDrawerClose())
            dispatch(getOpeningCurrent())
            toast.push(
                <Notification title={"¡Registro Existoso!"} type="success" duration={3000}>
                    {message}
                </Notification>
                , {
                    placement: 'top-center'
                }
            )
        } else { 
            let errorMessage = 'No se puede aperturar la caja, asegurese de enviar todos los campos correctos'

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
        <OpeningForm
            ref={ref}
            onFormSubmit={onFormSubmit}
        />
    )
})

export default OpeningNewContent
