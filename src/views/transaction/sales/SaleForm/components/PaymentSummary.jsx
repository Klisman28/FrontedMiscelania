import React from 'react'
import { NumericFormat } from 'react-number-format'
import { Controller } from 'react-hook-form'

/**
 * PaymentSummary — Ventas
 * Toggle SAT moderno + resumen de totales premium
 */
const PaymentSummary = ({ control, watch }) => {
    const watchProducts = watch('products', [])
    const watchApplyIgv = watch('applyIgv')

    const subtotal = watchProducts?.reduce((sum, el) => sum + (el.subtotal || 0), 0) || 0
    const taxRate = 0.05
    const taxValue = watchApplyIgv ? taxRate * subtotal : 0
    const total = subtotal + taxValue

    const fmt = (val) => (Math.round(val * 100) / 100).toFixed(2)

    return (
        <div className="space-y-3">

            {/* Toggle SAT — card interactiva */}
            <Controller
                control={control}
                name="applyIgv"
                render={({ field: { onChange, value } }) => (
                    <button
                        type="button"
                        onClick={() => onChange(!value)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all duration-200 ${value
                                ? 'bg-indigo-50 border-indigo-300'
                                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                            }`}
                    >
                        <div className="flex items-center gap-3">
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

            {/* Resumen de totales */}
            <div className="space-y-1">
                {/* Separador con label */}
                <div className="flex items-center gap-2 mb-2">
                    <div className="h-px flex-1 bg-slate-100" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Resumen</span>
                    <div className="h-px flex-1 bg-slate-100" />
                </div>

                {/* Subtotal */}
                <div className="flex items-center justify-between py-1">
                    <span className="text-sm text-slate-500">Subtotal</span>
                    <span className="text-sm font-semibold text-slate-700 tabular-nums font-mono">
                        <NumericFormat displayType="text" value={fmt(subtotal)} prefix="Q " thousandSeparator />
                    </span>
                </div>

                {/* SAT */}
                <div className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-1.5">
                        <span className="text-sm text-slate-500">SAT</span>
                        {watchApplyIgv && (
                            <span className="text-[10px] font-semibold bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full">
                                5%
                            </span>
                        )}
                    </div>
                    <span className={`text-sm font-semibold tabular-nums font-mono ${watchApplyIgv ? 'text-slate-700' : 'text-slate-300'}`}>
                        <NumericFormat displayType="text" value={fmt(taxValue)} prefix="Q " thousandSeparator />
                    </span>
                </div>

                {/* Divisor */}
                <div className="border-t border-slate-100 my-1" />

                {/* Total destacado */}
                <div className="flex items-center justify-between py-1.5 px-3 bg-indigo-50 rounded-xl">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                        Total a Pagar
                    </span>
                    <span className="text-2xl font-bold text-indigo-600 tabular-nums font-mono">
                        <NumericFormat displayType="text" value={fmt(total)} prefix="Q " thousandSeparator />
                    </span>
                </div>
            </div>
        </div>
    )
}

export default PaymentSummary
