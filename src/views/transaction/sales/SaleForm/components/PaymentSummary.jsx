import React from 'react'
import { Checkbox } from 'components/ui'
import { NumericFormat } from 'react-number-format'
import { Controller } from 'react-hook-form'

const PaymentSummary = ({ control, watch }) => {
    const watchProducts = watch('products', []);
    const watchApplyIgv = watch('applyIgv');

    const subtotal = watchProducts?.reduce((sum, element) => sum + element.subtotal, 0)
    const taxRate = 0.05
    const taxValue = taxRate * subtotal
    const total = watchApplyIgv ? (taxValue + subtotal) : subtotal

    return (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <ul className="space-y-3">
                <PaymentInfo label="Subtotal" value={subtotal} />

                <div className="flex items-center justify-between py-1">
                    <Controller
                        control={control}
                        name="applyIgv"
                        render={({ field: { onChange, value } }) => (
                            <Checkbox
                                onChange={onChange}
                                checked={value}
                                className="text-sm font-medium text-slate-600"
                            >
                                <span className="text-sm font-medium text-slate-600">Aplicar SAT (5%)</span>
                            </Checkbox>
                        )}
                    />
                    {watchApplyIgv && (
                        <span className="font-semibold text-slate-700 tabular-nums">
                            <NumericFormat
                                displayType="text"
                                value={(Math.round(taxValue * 100) / 100).toFixed(2)}
                                prefix={'Q '}
                                thousandSeparator={true}
                            />
                        </span>
                    )}
                </div>

                <PaymentInfo label="TOTAL A PAGAR" value={total} isLast isTotal />
            </ul>
        </div>
    )
}

const PaymentInfo = ({ label, value, isLast, isTotal }) => {
    return (
        <li className={`flex items-center justify-between ${!isLast ? 'mb-1' : ''} ${isTotal ? 'mt-3 pt-3 border-t border-slate-200' : ''}`}>
            <span className={`${isTotal ? 'text-xs font-bold text-slate-500 uppercase tracking-widest' : 'text-sm text-slate-600 font-medium'}`}>
                {label}
            </span>
            <span className={`${isTotal ? 'text-2xl font-bold text-indigo-600 tabular-nums' : 'text-sm font-semibold text-slate-700 tabular-nums'}`}>
                <NumericFormat
                    displayType="text"
                    value={(Math.round(value * 100) / 100).toFixed(2)}
                    prefix={'Q '}
                    thousandSeparator={true}
                />
            </span>
        </li>
    )
}

export default PaymentSummary
