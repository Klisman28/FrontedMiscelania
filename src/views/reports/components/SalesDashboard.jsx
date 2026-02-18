import React, { useEffect, useState } from 'react'
import { Card, Table, Badge, Button, Spinner } from 'components/ui'
import ReactApexChart from 'react-apexcharts'
import { HiDownload, HiCurrencyDollar, HiShoppingCart, HiUserGroup, HiTicket } from 'react-icons/hi'
import { apiGetSalesSummary, apiGetSalesByDay, apiGetTopProducts, apiGetTopClients, apiGetReportExport } from 'services/ReportsService'
import { NumericFormat } from 'react-number-format'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { pickList } from '../../../utils/pickList'

const { Tr, Th, Td, THead, TBody } = Table

/**
 * Extrae un array de la respuesta del backend sin importar cómo esté anidado.
 * Intenta múltiples claves en orden hasta encontrar un array.
 * Ej: res.data.data.sales | res.data.sales | res.data | res.data.data | []
 */
function normalizeList(res, keys = []) {
    const d = res?.data
    if (!d) return []
    // Intentar cada clave en res.data.data primero, luego en res.data
    for (const key of keys) {
        if (Array.isArray(d?.data?.[key])) return d.data[key]
        if (Array.isArray(d?.[key])) return d[key]
    }
    // Fallback: si res.data.data es array, usarlo directamente
    if (Array.isArray(d?.data)) return d.data
    if (Array.isArray(d)) return d
    return []
}

const StatisticCard = ({ title, value, icon, type = 'default' }) => {
    return (
        <Card className="flex items-center gap-4 p-4 border border-gray-100 shadow-sm rounded-2xl">
            <div className={`p-3 rounded-full ${type === 'primary' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                {icon}
            </div>
            <div>
                <h6 className="text-gray-500 text-sm font-medium">{title}</h6>
                <h4 className="text-xl font-bold text-gray-900">{value}</h4>
            </div>
        </Card>
    )
}

const SalesDashboard = ({ filter }) => {
    const [loading, setLoading] = useState(false)
    const [summary, setSummary] = useState({ totalSales: 0, count: 0, averageTicket: 0, totalTax: 0 })
    const [chartData, setChartData] = useState([])
    const [topProducts, setTopProducts] = useState([])
    const [topClients, setTopClients] = useState([])

    const fetchData = async () => {
        setLoading(true)
        try {
            const params = {
                startDate: dayjs(filter.startDate).format('YYYY-MM-DD'),
                endDate: dayjs(filter.endDate).format('YYYY-MM-DD'),
                warehouseId: filter.warehouseId,
                docType: filter.docType === 'Todos' ? undefined : filter.docType
            }

            const [resSummary, resChart, resProducts, resClients] = await Promise.all([
                apiGetSalesSummary(params),
                apiGetSalesByDay(params),
                apiGetTopProducts({ ...params, limit: 10 }),
                apiGetTopClients({ ...params, limit: 10 })
            ])

            // DEBUG: ver estructura real de la respuesta
            console.log('[SalesDashboard] resSummary.data:', resSummary.data)
            console.log('[SalesDashboard] resChart.data:', resChart.data)
            console.log('[SalesDashboard] resProducts.data:', resProducts.data)
            console.log('[SalesDashboard] resClients.data:', resClients.data)

            // Normalizar summary — acepta array, objeto directo, o anidado en .data
            const rawSummary = resSummary?.data
            if (rawSummary) {
                const s = Array.isArray(rawSummary)
                    ? (rawSummary[0] || {})
                    : (rawSummary?.data ?? rawSummary)
                setSummary({
                    totalSales: s.totalSales ?? s.total_sales ?? s.total ?? 0,
                    count: s.count ?? s.total_count ?? 0,
                    averageTicket: s.averageTicket ?? s.average_ticket ?? s.average ?? 0,
                    totalTax: s.totalTax ?? s.total_tax ?? s.tax ?? 0,
                })
            }

            // Normalizar listas
            setChartData(normalizeList(resChart, ['sales', 'data', 'items']))
            setTopProducts(normalizeList(resProducts, ['products', 'data', 'items']))
            setTopClients(normalizeList(resClients, ['clients', 'data', 'items']))

        } catch (error) {
            console.error('[SalesDashboard] Error fetching sales report:', error)
            setSummary({ totalSales: 0, count: 0, averageTicket: 0, totalTax: 0 })
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
                warehouseId: filter.warehouseId,
                docType: filter.docType,
                type // 'sales_by_day', 'top_products', 'top_clients'
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

    // Chart Config
    const chartOptions = {
        chart: { type: 'area', toolbar: { show: false }, zoom: { enabled: false } },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2 },
        xaxis: {
            categories: (Array.isArray(chartData) ? chartData : []).map(item => dayjs(item.date).format('DD/MM')),
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: { show: false },
        grid: { show: false, padding: { left: 0, right: 0 } },
        colors: ['#6366f1'],
        fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 100] } }
    }
    const chartSeries = [{ name: 'Ventas', data: (Array.isArray(chartData) ? chartData : []).map(item => item.total) }]

    if (loading && !summary.totalSales) { // Initial load
        return <div className="h-96 flex items-center justify-center"><Spinner size="lg" /></div>
    }

    return (
        <div className="flex flex-col gap-6">
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatisticCard
                    title="Total Ventas"
                    value={<NumericFormat value={summary.totalSales} displayType="text" prefix="Q " thousandSeparator="," decimalScale={2} />}
                    icon={<HiCurrencyDollar className="text-2xl" />}
                    type="primary"
                />
                <StatisticCard
                    title="N° Transacciones"
                    value={summary.count}
                    icon={<HiShoppingCart className="text-2xl" />}
                    type="secondary"
                />
                <StatisticCard
                    title="Ticket Promedio"
                    value={<NumericFormat value={summary.averageTicket} displayType="text" prefix="Q " thousandSeparator="," decimalScale={2} />}
                    icon={<HiTicket className="text-2xl" />}
                    type="primary"
                />
                <StatisticCard
                    title="Total Impuestos (IGV)"
                    value={<NumericFormat value={summary.totalTax} displayType="text" prefix="Q " thousandSeparator="," decimalScale={2} />}
                    icon={<HiCurrencyDollar className="text-2xl" />}
                    type="secondary"
                />
            </div>

            {/* Chart */}
            <Card className="rounded-2xl border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h5 className="font-bold text-gray-800">Evolución de Ventas</h5>
                    <Button size="xs" icon={<HiDownload />} onClick={() => handleExport('sales_by_day')}>CSV</Button>
                </div>
                <ReactApexChart options={chartOptions} series={chartSeries} type="area" height={300} />
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <Card className="rounded-2xl border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h5 className="font-bold text-gray-800">Top Productos</h5>
                        <Button size="xs" icon={<HiDownload />} onClick={() => handleExport('top_products')}>CSV</Button>
                    </div>
                    <Table size="sm">
                        <THead className="bg-slate-50">
                            <Tr>
                                <Th>Producto</Th>
                                <Th className="text-right">Cant.</Th>
                                <Th className="text-right">Total</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {topProducts.length > 0 ? topProducts.map((prod, idx) => (
                                <Tr key={idx} className="hover:bg-slate-50 transition-colors">
                                    <Td className="font-medium text-gray-700 max-w-[200px] truncate" title={prod.productName}>{prod.productName}</Td>
                                    <Td className="text-right">{prod.quantity}</Td>
                                    <Td className="text-right font-semibold">
                                        <NumericFormat value={prod.total} displayType="text" prefix="Q " thousandSeparator="," decimalScale={2} />
                                    </Td>
                                </Tr>
                            )) : (
                                <Tr><Td colSpan={3} className="text-center text-gray-400 py-8">No hay datos</Td></Tr>
                            )}
                        </TBody>
                    </Table>
                </Card>

                {/* Top Clients */}
                <Card className="rounded-2xl border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h5 className="font-bold text-gray-800">Top Clientes</h5>
                        <Button size="xs" icon={<HiDownload />} onClick={() => handleExport('top_clients')}>CSV</Button>
                    </div>
                    <Table size="sm">
                        <THead className="bg-slate-50">
                            <Tr>
                                <Th>Cliente</Th>
                                <Th className="text-right">Trans.</Th>
                                <Th className="text-right">Total</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {topClients.length > 0 ? topClients.map((client, idx) => (
                                <Tr key={idx} className="hover:bg-slate-50 transition-colors">
                                    <Td className="font-medium text-gray-700 flex items-center gap-2">
                                        <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-full"><HiUserGroup /></div>
                                        <span className="truncate max-w-[150px]" title={client.clientName}>{client.clientName || 'Consumidor Final'}</span>
                                    </Td>
                                    <Td className="text-right">{client.count}</Td>
                                    <Td className="text-right font-semibold">
                                        <NumericFormat value={client.total} displayType="text" prefix="Q " thousandSeparator="," decimalScale={2} />
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

export default SalesDashboard
