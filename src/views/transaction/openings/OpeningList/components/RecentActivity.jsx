import React from 'react'
import { Card } from 'components/ui'
import { useNavigate } from 'react-router-dom'
import {
    HiShoppingCart,
    HiCash,
    HiLockClosed,
    HiLockOpen,
    HiClock
} from 'react-icons/hi'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
dayjs.locale('es')

/**
 * RecentActivity
 * 
 * Muestra las últimas actividades de la caja actual
 */

const ActivityIcon = ({ type }) => {
    const icons = {
        sale: <HiShoppingCart className="text-green-600" />,
        withdrawal: <HiCash className="text-orange-600" />,
        deposit: <HiCash className="text-blue-600" />,
        opening: <HiLockOpen className="text-indigo-600" />,
        closing: <HiLockClosed className="text-red-600" />
    }

    return (
        <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
            <div className="text-xl">
                {icons[type] || icons.sale}
            </div>
        </div>
    )
}

const ActivityItem = ({ activity }) => {
    return (
        <div className="flex items-start gap-3 py-3 border-b border-gray-200 dark:border-gray-600 last:border-0">
            <ActivityIcon type={activity.type} />
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                        <p className="font-semibold text-sm truncate">
                            {activity.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {activity.description}
                        </p>
                    </div>
                    {activity.amount && (
                        <span className={`text-sm font-bold whitespace-nowrap ${activity.type === 'sale' || activity.type === 'deposit'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                            }`}>
                            {activity.type === 'withdrawal' ? '-' : '+'}Q {activity.amount}
                        </span>
                    )}
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {dayjs(activity.datetime).fromNow()}
                </p>
            </div>
        </div>
    )
}

const RecentActivity = ({ activities = [], isOpeningActive = false }) => {
    const navigate = useNavigate()

    // Mock data si no hay actividades reales disponibles
    const mockActivities = isOpeningActive ? [
        {
            id: 1,
            type: 'opening',
            title: 'Apertura de caja',
            description: 'Caja aperturada con éxito',
            datetime: new Date(),
            amount: null
        }
    ] : []

    const displayActivities = activities.length > 0 ? activities.slice(0, 5) : mockActivities

    return (
        <Card>
            <div className="flex items-center justify-between mb-4">
                <h5>Actividad Reciente</h5>
                {isOpeningActive && (
                    <button
                        onClick={() => navigate('/transacciones/historial-ventas')}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                        Ver historial completo →
                    </button>
                )}
            </div>

            {displayActivities.length > 0 ? (
                <div className="space-y-0">
                    {displayActivities.map((activity, index) => (
                        <ActivityItem key={activity.id || index} activity={activity} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <div className="text-gray-400 dark:text-gray-500 mb-2">
                        <HiClock className="w-12 h-12 mx-auto opacity-50" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        No hay actividad registrada aún
                    </p>
                    {isOpeningActive && (
                        <button
                            onClick={() => navigate('/transacciones/historial-ventas')}
                            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                            Ver historial completo
                        </button>
                    )}
                </div>
            )}
        </Card>
    )
}

export default RecentActivity
