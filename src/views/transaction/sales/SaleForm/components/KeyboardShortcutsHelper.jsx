import React from 'react'
import { Alert } from 'components/ui'
import { HiInformationCircle } from 'react-icons/hi'

/**
 * KeyboardShortcutsHelper
 * 
 * Muestra un pequeño helper con los atajos de teclado disponibles
 */
const KeyboardShortcutsHelper = () => {
    return (
        <div className="mb-3">
            <Alert
                showIcon
                type="info"
                customIcon={<HiInformationCircle />}
                className="border-blue-200 dark:border-blue-700"
            >
                <div className="text-xs">
                    <span className="font-semibold">Atajos: </span>
                    <kbd className="mx-1 px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">F2</kbd>
                    <span className="text-gray-600 dark:text-gray-400">Buscar</span>
                    <span className="mx-1">•</span>
                    <kbd className="mx-1 px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">Ctrl+Enter</kbd>
                    <span className="text-gray-600 dark:text-gray-400">Guardar</span>
                    <span className="mx-1">•</span>
                    <kbd className="mx-1 px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">Enter</kbd>
                    <span className="text-gray-600 dark:text-gray-400">Agregar producto escaneado</span>
                </div>
            </Alert>
        </div>
    )
}

export default KeyboardShortcutsHelper
