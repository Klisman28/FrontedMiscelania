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

const OpeningStatistic = ({data}) => {

    // const startDate = useSelector((state) => state.salesDashboard.state.startDate)
    const saleBalance = data.sales?.reduce((sum, element) => sum + parseFloat(element.total), 0)
	const totalAmount = parseFloat(data.initBalance) + saleBalance

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <StatisticCard
                data={{ value: data.initBalance }}
                valuePrefix="Q"
                label="Saldo Inicial"
                tagSuffix="%"
                // date={startDate}
                icon={<GiReceiveMoney className='w-12 h-12'/>}
            />
            <StatisticCard
                data={{ value: saleBalance }}
                valuePrefix="Q "
                label="Mis Ventas"
                tagSuffix="%"
            // date={startDate}
            icon={<GiTakeMyMoney className='w-12 h-12'/>}
            />
            <StatisticCard
                data={{ value: totalAmount }}
                valuePrefix="Q "
                label="Total a Rendir"
                tagSuffix="%"
            // date={startDate}
            icon={<GiPayMoney className='w-12 h-12'/>}
            />
        </div>
    )
}

export default OpeningStatistic