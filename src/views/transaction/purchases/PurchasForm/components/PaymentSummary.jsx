import React from 'react'
import { NumericFormat } from 'react-number-format'

/**
 * PaymentSummary — Resumen de pago premium
 * Diseño limpio con separación clara, total destacado en indigo
 */
const PaymentSummary = ({ watch }) => {

    const watchProducts = watch('products', [])
    const watchApplyIgv = watch('applyIgv')

    const subtotal = watchProducts?.reduce((sum, el) => sum + (el.subtotal || 0), 0) || 0
    const taxRate = 0.05
    const taxValue = watchApplyIgv ? taxRate * subtotal : 0
    const total = subtotal + taxValue

    const fmt = (val) => (Math.round(val * 100) / 100).toFixed(2)

    return (
        <div className="space-y-1">
            {/* Separador con label */}
            <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-slate-100" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Resumen</span>
                <div className="h-px flex-1 bg-slate-100" />
            </div>

            {/* Subtotal */}
            <div className="flex items-center justify-between py-1">
                <span className="text-sm text-slate-500">Subtotal</span>
                <span className="text-sm font-semibold text-slate-700 tabular-nums font-mono">
                    <NumericFormat
                        displayType="text"
                        value={fmt(subtotal)}
                        prefix="Q "
                        thousandSeparator
                    />
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
                    <NumericFormat
                        displayType="text"
                        value={fmt(taxValue)}
                        prefix="Q "
                        thousandSeparator
                    />
                </span>
            </div>

            {/* Divisor */}
            <div className="border-t border-slate-100 my-2" />

            {/* Total — destacado */}
            <div className="flex items-center justify-between py-1.5 px-3 bg-indigo-50 rounded-xl">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                    Total
                </span>
                <span className="text-xl font-bold text-indigo-600 tabular-nums font-mono">
                    <NumericFormat
                        displayType="text"
                        value={fmt(total)}
                        prefix="Q "
                        thousandSeparator
                    />
                </span>
            </div>
        </div>
    )
}

export default PaymentSummary