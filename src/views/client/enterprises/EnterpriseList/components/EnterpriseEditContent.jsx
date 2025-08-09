import React, { forwardRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { postEnterprise, getEnterprises, putEnterprise } from '../store/dataSlice'
import { setDrawerClose, setSelectedEnterprise } from '../store/stateSlice'
import EnterpriseForm from '../../EnterpriseForm'
import { toast, Notification } from 'components/ui'

const EnterpriseEditContent = forwardRef((_, ref) => {

    const dispatch = useDispatch()

    const enterprise = useSelector((state) => state.enterpriseList.state.selectedEnterprise)
    const actionForm = useSelector((state) => state.enterpriseList.state.actionForm)

    const onFormSubmit = async (values) => {

        let res = null

        if (actionForm === 'create') {
            res = await dispatch(postEnterprise(values));
        } else {
            res = await dispatch(putEnterprise({ id: enterprise.id, data: values }))
        }

        const { message, type } = res.payload

        if (type === 'success') {
            dispatch(getEnterprises())
            dispatch(setDrawerClose())
            dispatch(setSelectedEnterprise({}))
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
            let errorMessage = 'No se puede registrar la empresa, asegurese de enviar todos los campos correctos';
            if (message === 'SequelizeUniqueConstraintError') {
                const field = error[0]?.path

                switch (field) {
                    case 'ruc':
                        errorMessage = 'La empresa con este RUC ya está registrada, no se puede duplicar'
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
        <EnterpriseForm
            ref={ref}
            onFormSubmit={onFormSubmit}
            enterprise={enterprise}
        />
    )
})

export default EnterpriseEditContent
