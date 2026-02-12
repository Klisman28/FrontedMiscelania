import React from 'react'
import { Card } from 'components/ui'
import { NumericFormat } from 'react-number-format'
import { GiPayMoney, GiReceiveMoney, GiTakeMyMoney } from 'react-icons/gi'

const StatisticCard = ({ data = {}, label, valuePrefix, icon }) => {
    return (
        <Card>
            <h6 className="font-semibold mb-4 text-sm">{label}</h6>
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="font-bold">
                        <NumericFormat
                            displayType="text"
                            value={(Math.round(data.value * 100) / 100).toFixed(2)}
                            thousandSeparator
                            prefix={valuePrefix}
                        />
                    </h3>
                    {/* <p>vs. 3 months prior to <span className="font-semibold">{dayjs(date).format('DD MMM')}</span></p> */}
                </div>
                {/* <GrowShrinkTag value={data.growShrink} suffix="%" /> */}
                <div className='text-blue-500'>
                    {icon}
                </div>
            </div>
        </Card>
    )
}

const OpeningStatistic = ({ data, summary = {} }) => {

    const initBalance = summary.initBalance !== undefined
        ? parseFloat(summary.initBalance)
        : parseFloat(data.initBalance || 0)

    const saleBalance = summary.totalSales !== undefined
        ? parseFloat(summary.totalSales)
        : (data.sales?.reduce((sum, element) => sum + parseFloat(element.total), 0) || 0)

    // Calculate cash movements
    const deposits = summary.totalCashIn !== undefined
        ? parseFloat(summary.totalCashIn)
        : (data.cashMovements?.filter(m => m.type === 'CASH_IN').reduce((sum, m) => sum + parseFloat(m.amount), 0) || 0)

    const withdrawals = summary.totalCashOut !== undefined
        ? parseFloat(summary.totalCashOut)
        : (data.cashMovements?.filter(m => m.type === 'CASH_OUT').reduce((sum, m) => sum + parseFloat(m.amount), 0) || 0)

    const movementsBalance = deposits - withdrawals

    // totalTheoretical comes from backend usually, but we can fallback to calculation
    const totalAmount = summary.theoreticalBalance !== undefined
        ? parseFloat(summary.theoreticalBalance)
        : (initBalance + saleBalance + movementsBalance)

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <StatisticCard
                data={{ value: initBalance }}
                valuePrefix="Q"
                label="Saldo Inicial"
                icon={<GiReceiveMoney className='w-12 h-12' />}
            />
            <StatisticCard
                data={{ value: saleBalance }}
                valuePrefix="Q "
                label="Mis Ventas"
                icon={<GiTakeMyMoney className='w-12 h-12' />}
            />
            <StatisticCard
                data={{ value: movementsBalance }}
                valuePrefix="Q "
                label="Movimientos"
                icon={<GiPayMoney className='w-12 h-12' />}
            />
            <StatisticCard
                data={{ value: totalAmount }}
                valuePrefix="Q "
                label="Total a Rendir"
                icon={<GiPayMoney className='w-12 h-12' />}
            />
        </div>
    )
}

export default OpeningStatistic