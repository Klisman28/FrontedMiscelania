import React, { forwardRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { postSupplier, getSuppliers, putSupplier } from '../store/dataSlice'
import { setDrawerClose, setSelectedSupplier } from '../store/stateSlice'
import SupplierForm from '../../SupplierForm'
import { toast, Notification } from 'components/ui'

const SupplierEditContent = forwardRef((_, ref) => {

    const dispatch = useDispatch()

    const supplier = useSelector((state) => state.supplierList.state.selectedSupplier)
    const actionForm = useSelector((state) => state.supplierList.state.actionForm)

    const onFormSubmit = async (values) => {

        let res = null

        if (actionForm === 'create') {
            res = await dispatch(postSupplier(values));
        } else {
            res = await dispatch(putSupplier({ id: supplier.id, data: values }))
        }

        const { message, type } = res.payload

        if (type === 'success') {
            dispatch(getSuppliers())
            dispatch(setDrawerClose())
            dispatch(setSelectedSupplier({}))
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
            let errorMessage = 'No se puede registrar el proveedor, asegurese de enviar todos los campos correctos';
            if (message === 'SequelizeUniqueConstraintError') {
                const field = error[0]?.path

                switch (field) {
                    case 'ruc':
                        errorMessage = 'El proveedor con este RUC ya está registrada, no se puede duplicar'
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
        <SupplierForm
            ref={ref}
            onFormSubmit={onFormSubmit}
            supplier={supplier}
        />
    )
})

export default SupplierEditContent
