import React from 'react'
import { Card } from 'components/ui'
import { NumericFormat } from 'react-number-format'

const PaymentInfo = ({ label, value, isLast }) => {
    return (
        <li className={`flex items-center justify-between${!isLast ? ' mb-3' : ''}`}>
            <span>{label}</span>
            <span className="font-semibold">
                <NumericFormat
                    displayType="text"
                    value={(Math.round(value * 100) / 100).toFixed(2)}
                    prefix={'S/'}
                    thousandSeparator={true}
                />
            </span>
        </li>
    )
}

const PaymentSummary = ({ watch }) => {

    const watchProducts = watch('products', []);
    const watchApplyIgv = watch('applyIgv');

    const subtotal = watchProducts?.reduce((sum, element) => sum + element.subtotal, 0)
    const taxRate = 0.05
    const taxValue = taxRate * subtotal

    return (
        <Card className="mb-4">
            <h5 className="mb-2">Resumen de Pago</h5>
            <ul>
                <PaymentInfo label="Subtotal" value={subtotal} />
                {/* <PaymentInfo label="Delivery fee" value={data.deliveryFees} /> */}

                {watchApplyIgv
                    ?
                    <>
                        <PaymentInfo label="SAT 5%" value={taxValue} />
                        <hr className="mb-3" />
                        <PaymentInfo label="Total" value={taxValue + subtotal} isLast />
                    </>
                    :
                    <>
                        <PaymentInfo label="SAT" value={0} />
                        <hr className="mb-3" />
                        <PaymentInfo label="Total" value={subtotal} isLast />
                    </>
                }

            </ul>
        </Card>
    )
}

export default PaymentSummary