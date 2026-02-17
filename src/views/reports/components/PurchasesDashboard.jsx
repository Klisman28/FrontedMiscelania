import React, { useEffect, useState } from 'react'
import { Card, Table, Button, Spinner } from 'components/ui'
import ReactApexChart from 'react-apexcharts'
import { HiDownload, HiCurrencyDollar, HiClipboardList, HiTruck } from 'react-icons/hi'
import { apiGetPurchasesSummary, apiGetPurchasesByDay, apiGetTopSuppliers, apiGetReportExport } from 'services/ReportsService'
import { NumericFormat } from 'react-number-format'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { pickList } from '../../../utils/pickList'

const { Tr, Th, Td, THead, TBody } = Table

const StatisticCard = ({ title, value, icon, type = 'default' }) => {
    return (
        <Card className="flex items-center gap-4 p-4 border border-gray-100 shadow-sm rounded-2xl">
            <div className={`p-3 rounded-full ${type === 'primary' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                {icon}
            </div>
            <div>
                <h6 className="text-gray-500 text-sm font-medium">{title}</h6>
                <h4 className="text-xl font-bold text-gray-900">{value}</h4>
            </div>
        </Card>
    )
}

const PurchasesDashboard = ({ filter }) => {
    const [loading, setLoading] = useState(false)
    const [summary, setSummary] = useState({ totalPurchases: 0, count: 0, averagePurchase: 0 })
    const [chartData, setChartData] = useState([])
    const [topSuppliers, setTopSuppliers] = useState([])

    const fetchData = async () => {
        setLoading(true)
        try {
            const params = {
                startDate: dayjs(filter.startDate).format('YYYY-MM-DD'),
                endDate: dayjs(filter.endDate).format('YYYY-MM-DD'),
                warehouseId: filter.warehouseId,
                docType: filter.docType === 'Todos' ? undefined : filter.docType
            }

            const [resSummary, resChart, resSuppliers] = await Promise.all([
                apiGetPurchasesSummary(params),
                apiGetPurchasesByDay(params),
                apiGetTopSuppliers({ ...params, limit: 10 })
            ])

            if (resSummary.data) setSummary(resSummary.data[0] || { totalPurchases: 0, count: 0, averagePurchase: 0 })

            setChartData(pickList(resChart, 'purchases'))
            setTopSuppliers(pickList(resSuppliers, 'suppliers'))

        } catch (error) {
            console.error('Error fetching purchases report', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [filter])

    const handleExport = async (type) => {
        try {
            const params = {
                startDate: dayjs(filter.startDate).format('YYYY-MM-DD'),
                endDate: dayjs(filter.endDate).format('YYYY-MM-DD'),
                type
            }
            const response = await apiGetReportExport(params)
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `${type}_report_${dayjs().format('YYYY-MM-DD')}.csv`)
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (error) {
            console.error('Error exporting', error)
        }
    }

    const chartOptions = {
        chart: { type: 'area', toolbar: { show: false }, zoom: { enabled: false } },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2, colors: ['#f97316'] }, // Orange for purchases
        xaxis: {
            categories: (Array.isArray(chartData) ? chartData : []).map(item => dayjs(item.date).format('DD/MM')),
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: { show: false },
        grid: { show: false, padding: { left: 0, right: 0 } },
        colors: ['#f97316'],
        fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 100] } }
    }
    const chartSeries = [{ name: 'Compras', data: (Array.isArray(chartData) ? chartData : []).map(item => item.total) }]

    if (loading && !summary.totalPurchases) {
        return <div className="h-96 flex items-center justify-center"><Spinner size="lg" /></div>
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatisticCard
                    title="Total Compras"
                    value={<NumericFormat value={summary.totalPurchases} displayType="text" prefix="Q " thousandSeparator="," decimalScale={2} />}
                    icon={<HiCurrencyDollar className="text-2xl" />}
                    type="primary"
                />
                <StatisticCard
                    title="N° Órdenes"
                    value={summary.count}
                    icon={<HiClipboardList className="text-2xl" />}
                    type="secondary"
                />
                <StatisticCard
                    title="Compra Promedio"
                    value={<NumericFormat value={summary.averagePurchase} displayType="text" prefix="Q " thousandSeparator="," decimalScale={2} />}
                    icon={<HiTruck className="text-2xl" />}
                    type="primary"
                />
            </div>

            <Card className="rounded-2xl border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h5 className="font-bold text-gray-800">Evolución de Compras</h5>
                    <Button size="xs" icon={<HiDownload />} onClick={() => handleExport('purchases_by_day')}>CSV</Button>
                </div>
                <ReactApexChart options={chartOptions} series={chartSeries} type="area" height={300} />
            </Card>

            <div className="grid grid-cols-1 gap-6">
                <Card className="rounded-2xl border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h5 className="font-bold text-gray-800">Top Proveedores</h5>
                        <Button size="xs" icon={<HiDownload />} onClick={() => handleExport('top_suppliers')}>CSV</Button>
                    </div>
                    <Table size="sm">
                        <THead className="bg-slate-50">
                            <Tr>
                                <Th>Proveedor</Th>
                                <Th className="text-right">Órdenes</Th>
                                <Th className="text-right">Total Comprado</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {topSuppliers.length > 0 ? topSuppliers.map((sup, idx) => (
                                <Tr key={idx} className="hover:bg-slate-50 transition-colors">
                                    <Td className="font-medium text-gray-700 flex items-center gap-2">
                                        <div className="p-1.5 bg-orange-50 text-orange-600 rounded-full"><HiTruck /></div>
                                        <span className="truncate max-w-[200px]" title={sup.supplierName}>{sup.supplierName}</span>
                                    </Td>
                                    <Td className="text-right">{sup.count}</Td>
                                    <Td className="text-right font-semibold">
                                        <NumericFormat value={sup.total} displayType="text" prefix="Q " thousandSeparator="," decimalScale={2} />
                                    </Td>
                                </Tr>
                            )) : (
                                <Tr><Td colSpan={3} className="text-center text-gray-400 py-8">No hay datos</Td></Tr>
                            )}
                        </TBody>
                    </Table>
                </Card>
            </div>
        </div>
    )
}

export default PurchasesDashboard
