import React from 'react'
import { Card } from 'components/ui'
import { useNavigate } from 'react-router-dom'
import {
    HiShoppingCart,
    HiClock,
    HiCash
} from 'react-icons/hi'

/**
 * QuickActions
 * 
 * Tarjetas de acciones rápidas para navegar desde la apertura de caja
 */
const QuickActionCard = ({ icon, title, description, onClick, disabled = false }) => {
    return (
        <Card
            clickable
            className={`hover:shadow-lg transition-all duration-200 ${disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer hover:-translate-y-1'
                }`}
            bodyClass="p-6"
            onClick={disabled ? null : onClick}
        >
            <div className="flex flex-col items-center text-center  space-y-3">
                <div className={`p-4 rounded-full ${disabled
                    ? 'bg-gray-100 dark:bg-gray-700'
                    : 'bg-indigo-50 dark:bg-indigo-900/30'
                    }`}>
                    <div className={`text-4xl ${disabled
                        ? 'text-gray-400 dark:text-gray-500'
                        : 'text-indigo-600 dark:text-indigo-400'
                        }`}>
                        {icon}
                    </div>
                </div>
                <div>
                    <h6 className="font-bold mb-1">{title}</h6>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {description}
                    </p>
                </div>
            </div>
        </Card>
    )
}

const QuickActions = ({ isOpeningActive = false, onCashMovementClick }) => {
    const navigate = useNavigate()

    const actions = [
        {
            icon: <HiShoppingCart />,
            title: 'Nueva Venta',
            description: 'Registrar una venta',
            path: '/transacciones/nueva-venta',
            disabled: !isOpeningActive
        },
        {
            icon: <HiCash />,
            title: 'Retiro/Fondo',
            description: 'Agregar o retirar efectivo',
            path: null,
            disabled: !isOpeningActive,
            action: onCashMovementClick
        },
        {
            icon: <HiClock />,
            title: 'Historial',
            description: 'Ver historial de caja',
            path: '/transacciones/historial-ventas',
            disabled: !isOpeningActive
        }
    ]

    return (
        <div>
            <h5 className="mb-4">Acciones Rápidas</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {actions.map((action, index) => (
                    <QuickActionCard
                        key={index}
                        icon={action.icon}
                        title={action.title}
                        description={action.description}
                        disabled={action.disabled}
                        onClick={() => {
                            if (action.action) {
                                action.action()
                            } else if (action.path) {
                                navigate(action.path)
                            }
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

export default QuickActions
