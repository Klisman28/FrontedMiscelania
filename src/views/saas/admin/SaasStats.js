import React, { useEffect, useState, useMemo } from 'react'
import { Card, Spinner, Tag, Table, Badge } from 'components/ui'
import { HiOutlineOfficeBuilding, HiOutlineUsers, HiOutlineUserGroup, HiOutlineBan, HiOutlineCheckCircle, HiOutlineClock } from 'react-icons/hi'
import Chart from 'react-apexcharts'
import { fetchSaasStatsOverview } from 'services/saasStats.service'
import { upperFirst } from 'lodash'
import dayjs from 'dayjs'

const { Tr, Th, Td, THead, TBody } = Table

const KpiCard = ({ title, value, icon, badge, bgClass, iconClass }) => (
    <Card className={`h-full border ${bgClass || 'border-slate-200'} shadow-sm rounded-xl`}>
        <div className="flex items-center justify-between mb-4">
            <h6 className="font-semibold text-slate-700">{title}</h6>
            <div className={`p-2 rounded-lg ${iconClass || 'bg-slate-100 text-slate-600'}`}>{icon}</div>
        </div>
        <div className="flex items-end justify-between">
            <h3 className="font-bold text-3xl">{value}</h3>
            {badge && <span className="text-sm font-medium text-slate-500 mb-1">{badge}</span>}
        </div>
    </Card>
)

const StatusTag = ({ status }) => {
    switch (status?.toLowerCase()) {
        case 'active':
            return <Tag className="bg-emerald-100 text-emerald-700 border-0 rounded-md font-semibold">Activa</Tag>
        case 'suspended':
            return <Tag className="bg-rose-100 text-rose-700 border-0 rounded-md font-semibold">Suspendida</Tag>
        case 'pending':
            return <Tag className="bg-amber-100 text-amber-700 border-0 rounded-md font-semibold">Pendiente</Tag>
        default:
            return <Tag className="bg-slate-100 text-slate-600 border-0 rounded-md font-semibold">{status || 'Desconocido'}</Tag>
    }
}

const SaasStats = () => {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        const loadStats = async () => {
            try {
                setLoading(true)
                const data = await fetchSaasStatsOverview()
                setStats(data)
                setError(false)
            } catch (err) {
                console.error(err)
                setError(true)
            } finally {
                setLoading(false)
            }
        }
        loadStats()
    }, [])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <Spinner size={40} />
                <span className="text-slate-500 mt-4 font-semibold">Calculando métricas globales...</span>
            </div>
        )
    }

    if (error || !stats) {
        return (
            <div className="p-8 text-center bg-rose-50 rounded-xl border border-rose-100">
                <h4 className="text-rose-600 font-bold">Error cargando métricas</h4>
                <p className="text-rose-500 mt-2">No se pudo obtener el resumen global. Intente recargar.</p>
            </div>
        )
    }

    // Chart configurations
    const planBreakdownSeries = stats.planBreakdown.map(p => p.value)
    const planBreakdownLabels = stats.planBreakdown.map(p => upperFirst(p.name))

    const activeSuspSeries = [stats.activeCompanies, stats.suspendedCompanies]
    const activeSuspLabels = ['Activas', 'Suspendidas']

    const seatsByPlanData = Object.keys(stats.seatsByPlan).map(plan => ({
        x: upperFirst(plan),
        y: stats.seatsByPlan[plan].total
    }))

    return (
        <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-8">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">SaaS Overview</h2>
                <p className="text-slate-500 font-medium mt-1">Monitorea tenants, suscripciones y uso global</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <KpiCard
                    title="Empresas (Total)"
                    value={stats.totalCompanies}
                    icon={<HiOutlineOfficeBuilding className="text-xl" />}
                    iconClass="bg-blue-50 text-blue-600"
                    bgClass="border-blue-100 bg-blue-50/10"
                />
                <KpiCard
                    title="Empresas Activas"
                    value={stats.activeCompanies}
                    icon={<HiOutlineCheckCircle className="text-xl" />}
                    iconClass="bg-emerald-50 text-emerald-600"
                    bgClass="border-emerald-100 bg-emerald-50/10"
                />
                <KpiCard
                    title="Suspendidas"
                    value={stats.suspendedCompanies}
                    icon={<HiOutlineBan className="text-xl" />}
                    iconClass="bg-rose-50 text-rose-600"
                    bgClass="border-rose-100 bg-rose-50/10"
                />
                <KpiCard
                    title="Usuarios (Total)"
                    value={stats.totalUsers}
                    icon={<HiOutlineUsers className="text-xl" />}
                    iconClass="bg-amber-50 text-amber-600"
                    bgClass="border-amber-100 bg-amber-50/10"
                />
                <KpiCard
                    title="Seats (Disponibles)"
                    value={stats.totalSeats}
                    icon={<HiOutlineUserGroup className="text-xl" />}
                    iconClass="bg-indigo-50 text-indigo-600"
                    bgClass="border-indigo-100 bg-indigo-50/10"
                />
                <KpiCard
                    title="Seats (En Uso)"
                    value={stats.totalSeatsUsed}
                    badge={`${stats.totalSeats > 0 ? ((stats.totalSeatsUsed / stats.totalSeats) * 100).toFixed(1) : 0}% uso`}
                    icon={<HiOutlineUserGroup className="text-xl" />}
                    iconClass="bg-fuchsia-50 text-fuchsia-600"
                    bgClass="border-fuchsia-100 bg-fuchsia-50/10"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                <Card className="rounded-xl border border-slate-200">
                    <h6 className="font-semibold text-slate-700 mb-6">Nuevas empresas por día</h6>
                    <Chart
                        options={{
                            chart: { type: 'area', toolbar: { show: false } },
                            dataLabels: { enabled: false },
                            stroke: { curve: 'smooth', width: 2 },
                            colors: ['#6366f1'],
                            fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.1, stops: [0, 90, 100] } },
                            xaxis: {
                                categories: stats.trendChart.categories,
                                type: 'datetime'
                            }
                        }}
                        series={[{ name: 'Empresas', data: stats.trendChart.data }]}
                        type="area"
                        height={280}
                    />
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="rounded-xl border border-slate-200 flex flex-col items-center justify-center">
                        <h6 className="font-semibold text-slate-700 mb-4 self-start w-full">Empresas por Estado</h6>
                        <Chart
                            options={{
                                labels: activeSuspLabels,
                                colors: ['#10b981', '#f43f5e'],
                                plotOptions: { pie: { donut: { size: '70%' } } },
                                dataLabels: { enabled: false },
                                legend: { position: 'bottom' }
                            }}
                            series={activeSuspSeries}
                            type="donut"
                            height={250}
                        />
                    </Card>
                    <Card className="rounded-xl border border-slate-200 flex flex-col items-center justify-center">
                        <h6 className="font-semibold text-slate-700 mb-4 self-start w-full">Empresas por Plan</h6>
                        <Chart
                            options={{
                                labels: planBreakdownLabels,
                                colors: ['#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#64748b'],
                                plotOptions: { pie: { donut: { size: '70%' } } },
                                dataLabels: { enabled: false },
                                legend: { position: 'bottom' }
                            }}
                            series={planBreakdownSeries}
                            type="donut"
                            height={250}
                        />
                    </Card>
                </div>
            </div>

            {/* Data Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                <Card className="rounded-xl border border-slate-200 p-0 overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <h6 className="font-semibold text-slate-700 flex items-center gap-2">
                            <HiOutlineClock className="text-amber-500" />
                            Próximas a vencer (30 días)
                        </h6>
                    </div>
                    {stats.expiringSoon.length > 0 ? (
                        <Table className="w-full">
                            <THead className="bg-slate-50">
                                <Tr>
                                    <Th>Empresa</Th>
                                    <Th>Plan</Th>
                                    <Th>Vence en</Th>
                                    <Th>Estado</Th>
                                </Tr>
                            </THead>
                            <TBody>
                                {stats.expiringSoon.map((c) => (
                                    <Tr key={c.id}>
                                        <Td className="font-semibold text-slate-900">{c.name}</Td>
                                        <Td><Badge className="bg-indigo-100 text-indigo-700">{upperFirst(c.planName)}</Badge></Td>
                                        <Td className="text-rose-600 font-medium">{dayjs(c.expireDateObj).format('DD MMM YYYY')}</Td>
                                        <Td><StatusTag status={c.status} /></Td>
                                    </Tr>
                                ))}
                            </TBody>
                        </Table>
                    ) : (
                        <div className="p-8 text-center text-slate-500 text-sm">No hay empresas expirando en los próximos 30 días.</div>
                    )}
                </Card>

                <Card className="rounded-xl border border-slate-200 p-0 overflow-hidden">
                    <div className="p-5 border-b border-slate-100">
                        <h6 className="font-semibold text-slate-700 flex items-center gap-2">
                            <HiOutlineOfficeBuilding className="text-blue-500" />
                            Top Empresas por Asientos
                        </h6>
                    </div>
                    {stats.topCompaniesBySeats.length > 0 ? (
                        <Table className="w-full">
                            <THead className="bg-slate-50">
                                <Tr>
                                    <Th>Empresa</Th>
                                    <Th>Plan</Th>
                                    <Th>Seats Totales</Th>
                                    <Th>Estado</Th>
                                </Tr>
                            </THead>
                            <TBody>
                                {stats.topCompaniesBySeats.map((c) => (
                                    <Tr key={c.id}>
                                        <Td className="font-semibold text-slate-900">{c.name}</Td>
                                        <Td><Badge className="bg-indigo-100 text-indigo-700">{upperFirst(c.plan?.name || c.plan || 'basic')}</Badge></Td>
                                        <Td className="font-bold">{c.seats || 0}</Td>
                                        <Td><StatusTag status={c.status} /></Td>
                                    </Tr>
                                ))}
                            </TBody>
                        </Table>
                    ) : (
                        <div className="p-8 text-center text-slate-500 text-sm">No hay datos disponibles.</div>
                    )}
                </Card>
            </div>
        </div>
    )
}

export default SaasStats
