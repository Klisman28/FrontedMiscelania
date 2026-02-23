import React, { useEffect, useState } from 'react'
import { Card, Spinner } from 'components/ui'
import SaasService from 'services/SaasService'

const SaasStats = () => {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const resp = await SaasService.getSaasStats()
                if (resp.data) setStats(resp.data)
            } catch (error) {
                // Mock fallback
                setStats({
                    totalCompanies: 15,
                    activeCompanies: 12,
                    totalUsers: 42,
                    suspendedCompanies: 1,
                    trialCompanies: 2
                })
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (loading) return <div className="flex justify-center p-8"><Spinner size={40} /></div>

    return (
        <Card className="h-full">
            <h3 className="text-xl font-bold mb-6">SaaS Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-blue-50 border-blue-100">
                    <h4 className="text-blue-900 text-lg font-semibold">Total Empresas</h4>
                    <p className="text-3xl font-bold text-blue-700">{stats.totalCompanies}</p>
                </Card>
                <Card className="bg-green-50 border-green-100">
                    <h4 className="text-green-900 text-lg font-semibold">Empresas Activas</h4>
                    <p className="text-3xl font-bold text-green-700">{stats.activeCompanies || 0}</p>
                </Card>
                <Card className="bg-indigo-50 border-indigo-100">
                    <h4 className="text-indigo-900 text-lg font-semibold">Total Usuarios</h4>
                    <p className="text-3xl font-bold text-indigo-700">{stats.totalUsers || 0}</p>
                </Card>
                <Card className="bg-red-50 border-red-100">
                    <h4 className="text-red-900 text-lg font-semibold">Suspendidas</h4>
                    <p className="text-3xl font-bold text-red-700">{stats.suspendedCompanies || 0}</p>
                </Card>
            </div>

            {/* Chart placeholder */}
            <div className="mt-8 p-12 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-400">
                Charts coming soon...
            </div>
        </Card>
    )
}

export default SaasStats
