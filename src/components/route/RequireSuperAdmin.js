import React, { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast, Notification } from 'components/ui'

const RequireSuperAdmin = () => {
    const user = useSelector((state) => state.auth.user)

    // Sometimes user.isSuperAdmin might not be reliable on first render if rehydration is delayed, 
    // but the layout index rehydrates it inline.
    const isSuperAdmin = user.isSuperAdmin || (user.authority && user.authority.includes('SUPERADMIN'))

    useEffect(() => {
        if (!isSuperAdmin) {
            toast.push(
                <Notification title="No Autorizado" type="danger">
                    El acceso a este módulo es exclusivo para administradores de la plataforma.
                </Notification>,
                { placement: 'top-end' }
            )
        }
    }, [isSuperAdmin])

    if (!isSuperAdmin) {
        return <Navigate to="/home" replace />
    }

    return <Outlet />
}

export default RequireSuperAdmin
