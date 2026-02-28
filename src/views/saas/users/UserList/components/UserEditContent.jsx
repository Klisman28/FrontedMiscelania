import React, { forwardRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { postUser, getUsers, putUser } from '../store/dataSlice'
import { setDrawerClose, setSelectedUser } from '../store/stateSlice'
import UserForm from '../../UserForm'
import { toast, Notification } from 'components/ui'

const UserEditContent = forwardRef((_, ref) => {

    const dispatch = useDispatch()

    const user = useSelector((state) => state.userList.state.selectedUser)
    const actionForm = useSelector((state) => state.userList.state.actionForm)

    const onFormSubmit = async (values) => {
        let res = null

        if (actionForm === 'create') {
            res = await dispatch(postUser(values));
        } else {
            res = await dispatch(putUser({ id: user.id, data: values }))
        }

        const { message, type } = res.payload

        if (type === 'success') {
            dispatch(getUsers())
            dispatch(setDrawerClose())
            dispatch(setSelectedUser({}))
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
            let errorMessage = 'No se puede registrar el usuario, asegurese de enviar todos los campos correctos';
            if (message === 'SequelizeUniqueConstraintError') {
                const field = error[0]?.path

                switch (field) {
                    case 'username':
                        errorMessage = 'El usuario ya está registrada, no se puede duplicar'
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
        <UserForm
            ref={ref}
            onFormSubmit={onFormSubmit}
            user={user}
        />
    )
})

export default UserEditContent
