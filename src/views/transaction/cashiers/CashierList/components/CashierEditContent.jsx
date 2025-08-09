import React, { forwardRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { postCashier, getCashiers, putCashier } from '../store/dataSlice'
import { setDrawerClose, setSelectedCashier } from '../store/stateSlice'
import CashierForm from '../../CashierForm'
import { toast, Notification } from 'components/ui'

const CashierEditContent = forwardRef((_, ref) => {

    const dispatch = useDispatch()

    const cashier = useSelector((state) => state.cashiers.state.selectedCashier)
    const actionForm = useSelector((state) => state.cashiers.state.actionForm)

    const onFormSubmit = async (values) => {
        
        let res = null

        if (actionForm === 'create') {
            res = await dispatch(postCashier(values));
        } else{
            res = await dispatch(putCashier({id: cashier.id, data:values}))
        }
    
        const { message, type } = res.payload

        if (type === 'success') {
            dispatch(getCashiers())
            dispatch(setDrawerClose())
            dispatch(setSelectedCashier({}))
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
            let errorMessage = 'No se puede registrar la caja, asegurese de enviar todos los campos correctos';
            if (message === 'SequelizeUniqueConstraintError') {
                const field = error[0]?.path

                switch (field) {
                    case 'name':
                        errorMessage = 'La caja con este nombre ya está registrada, no se puede duplicar'
                        break
                    case 'code':
                        errorMessage = 'La caja con este código ya está registrada, no se puede duplicar'
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
        <CashierForm
            ref={ref}
            onFormSubmit={onFormSubmit}
            cashier={cashier}
        />
    )
})

export default CashierEditContent
