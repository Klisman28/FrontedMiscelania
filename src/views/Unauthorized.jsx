import React from 'react'
import { Button } from 'components/ui'
import { useNavigate } from 'react-router-dom'
import { HiShieldExclamation } from 'react-icons/hi'

const UnauthorizedPage = () => {
    const navigate = useNavigate()

    const handleGoHome = () => {
        navigate('/home')
    }

    const handleGoBack = () => {
        navigate(-1)
    }

    return (
        <div className="h-full flex flex-col items-center justify-center">
            <div className="text-center">
                <div className="mb-6 flex justify-center">
                    <HiShieldExclamation className="text-red-500" size={120} />
                </div>
                <h2 className="mb-4 text-4xl font-bold">Acceso Denegado</h2>
                <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                    No tienes permisos para acceder a esta página. Si crees que esto es un error,
                    contacta al administrador del sistema.
                </p>
                <div className="flex gap-3 justify-center">
                    <Button
                        variant="plain"
                        onClick={handleGoBack}
                    >
                        Volver Atrás
                    </Button>
                    <Button
                        variant="solid"
                        onClick={handleGoHome}
                    >
                        Ir al Inicio
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default UnauthorizedPage
