import React from 'react'
import { Card, Checkbox } from 'components/ui'
import { NumericFormat } from 'react-number-format'
import { Controller } from 'react-hook-form'

const PaymentInfo = ({ label, value, isLast, isTotal }) => {
    return (
        <li className={`flex items-center justify-between ${!isLast ? 'mb-2' : ''}`}>
            <span className={`${isTotal ? 'text-lg font-bold text-gray-800 dark:text-gray-100' : 'text-gray-500 text-sm'}`}>
                {label}
            </span>
            <span className={`${isTotal ? 'text-2xl font-extrabold text-indigo-600' : 'font-semibold text-gray-700 dark:text-gray-200'}`}>
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

const PaymentSummary = ({ control, watch }) => {
    const watchProducts = watch('products', []);
    const watchApplyIgv = watch('applyIgv');

    const subtotal = watchProducts?.reduce((sum, element) => sum + element.subtotal, 0)
    const taxRate = 0.05
    const taxValue = taxRate * subtotal
    const total = watchApplyIgv ? (taxValue + subtotal) : subtotal

    return (
        <div className="mt-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
            <ul className="space-y-3">
                <PaymentInfo label="Subtotal" value={subtotal} />

                <div className="flex items-center justify-between py-2">
                    <Controller
                        control={control}
                        name="applyIgv"
                        render={({ field: { onChange, value } }) => (
                            <Checkbox
                                onChange={onChange}
                                checked={value}
                                className="text-gray-500"
                            >
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Aplicar SAT (5%)</span>
                            </Checkbox>
                        )}
                    />
                    {watchApplyIgv && (
                        <span className="font-semibold text-gray-700 dark:text-gray-200">
                            <NumericFormat
                                displayType="text"
                                value={(Math.round(taxValue * 100) / 100).toFixed(2)}
                                prefix={'Q '}
                                thousandSeparator={true}
                            />
                        </span>
                    )}
                </div>

                <div className="border-t border-dashed border-gray-300 dark:border-gray-600 my-2"></div>

                <PaymentInfo label="TOTAL A PAGAR" value={total} isLast isTotal />
            </ul>
        </div>
    )
}

export default PaymentSummary
