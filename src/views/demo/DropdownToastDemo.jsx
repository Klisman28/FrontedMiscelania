import React, { useState, useRef, useEffect } from 'react'
import { Card, Button, Input, Notification, toast } from 'components/ui'
import { AdaptableCard } from 'components/shared'
import { HiSearch } from 'react-icons/hi'

/**
 * Página de Demostración de Dropdown y Toast
 * 
 * Esta página demuestra:
 * 1. Dropdown interactivo con detección de click fuera
 * 2. Notificaciones toast con diferentes posicionamientos
 */
const DropdownToastDemo = () => {
    // Estado para el dropdown
    const [showDropdown, setShowDropdown] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const dropdownRef = useRef(null)

    // Detectar click fuera del dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false)
                console.log('Click fuera detectado - Dropdown cerrado')
            }
        }

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setShowDropdown(false)
                console.log('Escape presionado - Dropdown cerrado')
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEscape)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [])

    // Ejemplos de datos para el dropdown
    const items = [
        { id: 1, name: 'Computadora HP 15', sku: 'HP15-2026', price: 1000 },
        { id: 2, name: 'Laptop Dell XPS 13', sku: 'DELL-XPS13', price: 1500 },
        { id: 3, name: 'MacBook Pro M2', sku: 'MBP-M2', price: 2500 },
        { id: 4, name: 'Mouse Logitech MX', sku: 'LOG-MX3', price: 100 },
        { id: 5, name: 'Teclado Mecánico', sku: 'KEY-001', price: 150 },
    ]

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Funciones para mostrar toasts en diferentes posiciones
    const showToast = (placement, type = 'success') => {
        const messages = {
            success: '¡Operación exitosa!',
            danger: 'Ocurrió un error',
            warning: 'Ten cuidado con esto',
            info: 'Información importante'
        }

        toast.push(
            <Notification title={type.charAt(0).toUpperCase() + type.slice(1)} type={type}>
                {messages[type]} desde {placement}
            </Notification>,
            { placement, duration: 3000 }
        )
    }

    const showDetailedToast = () => {
        toast.push(
            <Notification title="Stock Actualizado" type="success">
                <div className="space-y-1">
                    <p><strong>Producto:</strong> Computadora HP 15</p>
                    <p><strong>Bodega:</strong> Bodega Central</p>
                    <p><strong>Cantidad:</strong> +20 unidades</p>
                    <p className="text-sm text-gray-500 mt-2">
                        Nuevo total: 50 unidades
                    </p>
                </div>
            </Notification>,
            { placement: 'top-end', duration: 6000 }
        )
    }

    const showPermanentToast = () => {
        toast.push(
            <Notification
                title="Notificación Permanente"
                type="warning"
                closable={true}
            >
                Esta notificación no se cierra automáticamente. Debes cerrarla manualmente.
            </Notification>,
            { placement: 'top-center', duration: 0 }
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h3 className="mb-2">Demo: Dropdown y Toast Notifications</h3>
                <p className="text-gray-600">
                    Prueba las funcionalidades interactivas del dropdown y las notificaciones toast.
                </p>
            </div>

            {/* Sección 1: Dropdown Interactivo */}
            <AdaptableCard>
                <h5 className="mb-4">1. Dropdown Interactivo</h5>
                <p className="text-sm text-gray-600 mb-4">
                    Haz click en el input para abrir el dropdown. Luego haz click FUERA o presiona ESC para cerrarlo.
                </p>

                <div className="relative" ref={dropdownRef}>
                    <Input
                        prefix={<HiSearch className="text-lg" />}
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setShowDropdown(true)}
                    />

                    {showDropdown && (
                        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {filteredItems.length > 0 ? (
                                <div className="py-1">
                                    {filteredItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            onClick={() => {
                                                setSearchTerm(item.name)
                                                setShowDropdown(false)
                                                showToast('top-center', 'success')
                                            }}
                                        >
                                            <div className="font-semibold">{item.name}</div>
                                            <div className="text-xs text-gray-500">
                                                SKU: {item.sku} | Precio: ${item.price}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 text-center text-gray-500">
                                    Sin resultados para "{searchTerm}"
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                        💡 <strong>Tip:</strong> El dropdown se cierra al:
                    </p>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 ml-5 list-disc">
                        <li>Hacer click fuera del dropdown</li>
                        <li>Presionar la tecla ESC</li>
                        <li>Seleccionar un elemento</li>
                    </ul>
                </div>
            </AdaptableCard>

            {/* Sección 2: Toast Positions */}
            <AdaptableCard>
                <h5 className="mb-4">2. Posicionamiento de Toasts</h5>
                <p className="text-sm text-gray-600 mb-4">
                    Haz click en los botones para ver las notificaciones en diferentes posiciones.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Superior */}
                    <Card className="bg-green-50 dark:bg-green-900/20">
                        <h6 className="mb-3 text-green-800 dark:text-green-200">Superior</h6>
                        <div className="space-y-2">
                            <Button
                                size="sm"
                                block
                                variant="solid"
                                onClick={() => showToast('top-start')}
                            >
                                Top Start
                            </Button>
                            <Button
                                size="sm"
                                block
                                variant="solid"
                                onClick={() => showToast('top-center')}
                            >
                                Top Center ⭐
                            </Button>
                            <Button
                                size="sm"
                                block
                                variant="solid"
                                onClick={() => showToast('top-end')}
                            >
                                Top End
                            </Button>
                        </div>
                    </Card>

                    {/* Centro */}
                    <Card className="bg-blue-50 dark:bg-blue-900/20">
                        <h6 className="mb-3 text-blue-800 dark:text-blue-200">Centro</h6>
                        <div className="space-y-2">
                            <Button
                                size="sm"
                                block
                                variant="solid"
                                onClick={() => showToast('center-start')}
                            >
                                Center Start
                            </Button>
                            <Button
                                size="sm"
                                block
                                variant="solid"
                                onClick={() => showToast('center')}
                            >
                                Center
                            </Button>
                            <Button
                                size="sm"
                                block
                                variant="solid"
                                onClick={() => showToast('center-end')}
                            >
                                Center End
                            </Button>
                        </div>
                    </Card>

                    {/* Inferior */}
                    <Card className="bg-purple-50 dark:bg-purple-900/20">
                        <h6 className="mb-3 text-purple-800 dark:text-purple-200">Inferior</h6>
                        <div className="space-y-2">
                            <Button
                                size="sm"
                                block
                                variant="solid"
                                onClick={() => showToast('bottom-start')}
                            >
                                Bottom Start
                            </Button>
                            <Button
                                size="sm"
                                block
                                variant="solid"
                                onClick={() => showToast('bottom-center')}
                            >
                                Bottom Center
                            </Button>
                            <Button
                                size="sm"
                                block
                                variant="solid"
                                onClick={() => showToast('bottom-end')}
                            >
                                Bottom End
                            </Button>
                        </div>
                    </Card>
                </div>
            </AdaptableCard>

            {/* Sección 3: Tipos de Toast */}
            <AdaptableCard>
                <h5 className="mb-4">3. Tipos de Notificaciones</h5>
                <p className="text-sm text-gray-600 mb-4">
                    Diferentes tipos de notificaciones para diferentes situaciones.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button
                        variant="solid"
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => showToast('top-center', 'success')}
                    >
                        ✅ Success
                    </Button>
                    <Button
                        variant="solid"
                        className="bg-red-500 hover:bg-red-600"
                        onClick={() => showToast('top-center', 'danger')}
                    >
                        ❌ Danger
                    </Button>
                    <Button
                        variant="solid"
                        className="bg-yellow-500 hover:bg-yellow-600"
                        onClick={() => showToast('top-center', 'warning')}
                    >
                        ⚠️ Warning
                    </Button>
                    <Button
                        variant="solid"
                        className="bg-blue-500 hover:bg-blue-600"
                        onClick={() => showToast('top-center', 'info')}
                    >
                        ℹ️ Info
                    </Button>
                </div>
            </AdaptableCard>

            {/* Sección 4: Toasts Avanzados */}
            <AdaptableCard>
                <h5 className="mb-4">4. Notificaciones Avanzadas</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                        variant="solid"
                        onClick={showDetailedToast}
                    >
                        📊 Toast con Detalles
                    </Button>
                    <Button
                        variant="solid"
                        onClick={showPermanentToast}
                    >
                        📌 Toast Permanente
                    </Button>
                </div>
            </AdaptableCard>

            {/* Info */}
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-800">
                <h6 className="mb-2 text-indigo-800 dark:text-indigo-200">📚 Implementación</h6>
                <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-2">
                    Revisa el archivo <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded">DROPDOWN_AND_TOAST_GUIDE.md</code> para ver el código fuente completo y ejemplos de cómo implementar estas funcionalidades.
                </p>
                <p className="text-sm text-indigo-700 dark:text-indigo-300">
                    Ambas características ya están implementadas en: <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded">src/components/inventory/ProductSearchSelect.jsx</code>
                </p>
            </Card>
        </div>
    )
}

export default DropdownToastDemo
