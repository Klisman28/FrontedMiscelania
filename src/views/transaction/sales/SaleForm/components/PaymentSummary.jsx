import React from 'react'
import { Card, Checkbox } from 'components/ui'
import { NumericFormat } from 'react-number-format'
import { Controller } from 'react-hook-form'


const PaymentInfo = ({ label, value, isLast }) => {
    return (
        <li className={`flex items-center justify-between${!isLast ? ' mb-3' : ''}`}>
            <span>{label}</span>
            <span className="font-semibold">
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

    return (
        <div className="mb-4">
            <ul>
                <PaymentInfo label="Subtotal" value={subtotal} />
                {watchApplyIgv ? (
                    <>
                        {/* Se incluye el checkbox para modificar el valor de applyIgv */}
                        <div className="flex items-center justify-between mb-6">
                            <Controller
                                control={control}
                                name="applyIgv"
                                render={({ field: { onChange, value } }) => (
                                    <Checkbox onChange={onChange} value={value}>
                                        SAT (5%)
                                    </Checkbox>
                                )}
                            />
                            <PaymentInfo value={taxValue} />
                        </div>

                        <hr className="mb-3" />
                        <PaymentInfo label="Total" value={taxValue + subtotal} isLast />
                    </>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-6 ">
                            <Controller
                                control={control}
                                name="applyIgv"
                                render={({ field: { onChange, value } }) => (
                                    <Checkbox onChange={onChange} value={value}>
                                        SAT (5%)
                                    </Checkbox>
                                )}
                            />
                            <PaymentInfo value={0} />
                        </div>

                        <hr className="mb-3" />
                        <PaymentInfo label="Total" value={subtotal} isLast />
                    </>
                )}
            </ul>
        </div>
    )
}

export default PaymentSummary
