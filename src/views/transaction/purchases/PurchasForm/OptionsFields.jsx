import React from 'react'
import { Controller } from 'react-hook-form'

/**
 * OptionsFields — Toggle SAT moderno
 * Diseño tipo switch card, sin solapamiento con PaymentSummary
 */
const OptionsFields = ({ control }) => {
    return (
        <Controller
            control={control}
            name="applyIgv"
            render={({ field: { onChange, value } }) => (
                <button
                    type="button"
                    onClick={() => onChange(!value)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all duration-200 ${value
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                            : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                        }`}
                >
                    <div className="flex items-center gap-3">
                        {/* Ícono de impuesto */}
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${value ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-400'
                            }`}>
                            %
                        </div>
                        <div className="text-left">
                            <div className={`text-sm font-semibold leading-tight ${value ? 'text-indigo-700' : 'text-slate-600'}`}>
                                Aplicar SAT
                            </div>
                            <div className={`text-xs leading-tight ${value ? 'text-indigo-500' : 'text-slate-400'}`}>
                                Impuesto 5% sobre el total
                            </div>
                        </div>
                    </div>

                    {/* Toggle visual */}
                    <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${value ? 'bg-indigo-500' : 'bg-slate-300'
                        }`}>
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-200 ${value ? 'left-[22px]' : 'left-0.5'
                            }`} />
                    </div>
                </button>
            )}
        />
    )
}

export default OptionsFields