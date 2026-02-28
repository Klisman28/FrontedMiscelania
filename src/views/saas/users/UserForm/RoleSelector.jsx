import React from 'react'
import { Badge } from 'components/ui'
import { HiCheckCircle } from 'react-icons/hi'

const ROLE_INFO = {
    admin: {
        label: 'Administrador',
        description: 'Acceso total al sistema',
        color: 'purple',
        icon: '👑'
    },
    sales: {
        label: 'Ventas',
        description: 'Ventas y caja',
        color: 'blue',
        icon: '💰'
    },
    warehouse: {
        label: 'Almacén',
        description: 'Inventario y compras',
        color: 'orange',
        icon: '📦'
    }
}

const RoleCard = ({ role, isSelected, onToggle }) => {
    const info = ROLE_INFO[role.name] || {
        label: role.name,
        description: 'Rol del sistema',
        color: 'gray',
        icon: '👤'
    }

    return (
        <div
            onClick={() => onToggle(role.id)}
            className={`
                relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200
                ${isSelected
                    ? 'border-indigo-500 bg-indigo-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }
            `}
        >
            {/* Checkbox Icon */}
            <div className="absolute top-3 right-3">
                {isSelected ? (
                    <HiCheckCircle className="text-2xl text-indigo-600" />
                ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                )}
            </div>

            {/* Role Icon */}
            <div className="mb-2 text-3xl">
                {info.icon}
            </div>

            {/* Role Name */}
            <h4 className={`font-bold text-base mb-1 ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>
                {info.label}
            </h4>

            {/* Description */}
            <p className={`text-sm ${isSelected ? 'text-indigo-700' : 'text-gray-600'}`}>
                {info.description}
            </p>

            {/* Badge */}
            {isSelected && (
                <div className="mt-3">
                    <Badge className="bg-indigo-600 text-white">
                        Activo
                    </Badge>
                </div>
            )}
        </div>
    )
}

const RoleSelector = ({ roleList = [], selectedRoles = [], onChange, error }) => {
    const handleToggle = (roleId) => {
        const isCurrentlySelected = selectedRoles.includes(roleId)

        if (isCurrentlySelected) {
            // Deseleccionar
            onChange(selectedRoles.filter(id => id !== roleId))
        } else {
            // Seleccionar
            onChange([...selectedRoles, roleId])
        }
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {roleList.map((role) => (
                    <RoleCard
                        key={role.id}
                        role={role}
                        isSelected={selectedRoles.includes(role.id)}
                        onToggle={handleToggle}
                    />
                ))}
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-2 text-sm text-red-500 flex items-center gap-1">
                    <span>⚠️</span>
                    <span>{error}</span>
                </div>
            )}

            {/* Helper Text */}
            {!error && selectedRoles.length === 0 && (
                <div className="mt-2 text-sm text-gray-500">
                    Selecciona al menos un rol para el usuario
                </div>
            )}

            {selectedRoles.length > 0 && !error && (
                <div className="mt-3 flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                        Roles seleccionados:
                    </span>
                    {roleList
                        .filter(role => selectedRoles.includes(role.id))
                        .map((role) => {
                            const info = ROLE_INFO[role.name] || { label: role.name, icon: '👤' }
                            return (
                                <Badge key={role.id} className="bg-indigo-100 text-indigo-700">
                                    {info.icon} {info.label}
                                </Badge>
                            )
                        })
                    }
                </div>
            )}
        </div>
    )
}

export default RoleSelector
