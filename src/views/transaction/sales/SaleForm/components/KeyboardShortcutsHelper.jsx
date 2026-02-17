import React from 'react'
import { HiLightningBolt } from 'react-icons/hi'

/**
 * KeyboardShortcutsHelper
 * 
 * Muestra un pequeño helper con los atajos de teclado disponibles
 * Estilo: Barra discreta minimal POS Pro
 */
const KeyboardShortcutsHelper = () => {
    return (
        <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-1.5 text-slate-500 whitespace-nowrap">
                <HiLightningBolt className="text-amber-500 text-sm" />
                <span className="font-medium">Accesos:</span>
            </div>

            <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <kbd className="inline-flex items-center px-2 py-0.5 rounded-md bg-white border border-slate-200 font-medium text-slate-700">F2</kbd>
                    <span className="text-slate-600">Buscar</span>
                </div>

                <div className="w-px h-3 bg-slate-200" />

                <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <kbd className="inline-flex items-center px-2 py-0.5 rounded-md bg-white border border-slate-200 font-medium text-slate-700">Ctrl+Enter</kbd>
                    <span className="text-slate-600">Cobrar</span>
                </div>

                <div className="w-px h-3 bg-slate-200" />

                <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <kbd className="inline-flex items-center px-2 py-0.5 rounded-md bg-white border border-slate-200 font-medium text-slate-700">Enter</kbd>
                    <span className="text-slate-600">Agregar</span>
                </div>
            </div>
        </div>
    )
}

export default KeyboardShortcutsHelper
