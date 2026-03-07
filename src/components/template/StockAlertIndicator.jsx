import React, { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { HiOutlineBell, HiExclamationCircle, HiXCircle, HiArrowRight } from 'react-icons/hi'
import { apiGetStockAlertsSummary, apiGetLowStockProducts } from 'services/catalogue/ProductService'
import { Spinner } from 'components/ui'

const REFRESH_INTERVAL = 5 * 60 * 1000 // 5 minutes

const StockAlertIndicator = () => {
    const navigate = useNavigate()
    const [summary, setSummary] = useState(null)
    const [topAlerts, setTopAlerts] = useState([])
    const [loading, setLoading] = useState(true)
    const [panelOpen, setPanelOpen] = useState(false)
    const triggerRef = useRef(null)
    const panelRef = useRef(null)

    const fetchData = useCallback(async () => {
        try {
            const [summaryRes, alertsRes] = await Promise.all([
                apiGetStockAlertsSummary(),
                apiGetLowStockProducts({ limit: 5, offset: 0 }),
            ])
            setSummary(summaryRes.data?.data || null)
            setTopAlerts(alertsRes.data?.data?.data || [])
        } catch (err) {
            // Silently fail — non-critical UI element
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
        const interval = setInterval(fetchData, REFRESH_INTERVAL)
        return () => clearInterval(interval)
    }, [fetchData])

    // Close on click outside
    useEffect(() => {
        if (!panelOpen) return
        const handler = (e) => {
            if (
                panelRef.current && !panelRef.current.contains(e.target) &&
                triggerRef.current && !triggerRef.current.contains(e.target)
            ) {
                setPanelOpen(false)
            }
        }
        document.addEventListener('mousedown', handler, true)
        return () => document.removeEventListener('mousedown', handler, true)
    }, [panelOpen])

    // Close on ESC
    useEffect(() => {
        if (!panelOpen) return
        const handler = (e) => { if (e.key === 'Escape') setPanelOpen(false) }
        document.addEventListener('keydown', handler, true)
        return () => document.removeEventListener('keydown', handler, true)
    }, [panelOpen])

    const totalAlerts = summary?.totalAlerts || 0
    const hasAlerts = totalAlerts > 0

    const panelPosition = () => {
        if (!triggerRef.current) return { top: 0, right: 0 }
        const rect = triggerRef.current.getBoundingClientRect()
        return {
            top: rect.bottom + 8,
            right: window.innerWidth - rect.right,
        }
    }

    return (
        <>
            <button
                ref={triggerRef}
                onClick={() => setPanelOpen(p => !p)}
                className="relative p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                title={hasAlerts ? `${totalAlerts} alerta(s) de inventario` : 'Sin alertas de inventario'}
            >
                <HiOutlineBell className="w-5 h-5" />
                {hasAlerts && (
                    <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full text-[10px] font-bold text-white bg-red-500 ring-2 ring-white dark:ring-gray-800 animate-pulse">
                        {totalAlerts > 99 ? '99+' : totalAlerts}
                    </span>
                )}
            </button>

            {panelOpen && createPortal(
                <div
                    ref={panelRef}
                    className="fixed z-[9999] w-80 max-h-[420px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden"
                    style={panelPosition()}
                >
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <HiOutlineBell className="w-4 h-4 text-gray-400" />
                            Alertas de Inventario
                        </h3>
                        {summary && (
                            <div className="flex gap-3 mt-2">
                                {summary.outOfStock > 0 && (
                                    <span className="flex items-center gap-1 text-xs font-medium text-red-600">
                                        <HiXCircle className="w-3.5 h-3.5" />
                                        {summary.outOfStock} agotado{summary.outOfStock !== 1 ? 's' : ''}
                                    </span>
                                )}
                                {summary.lowStock > 0 && (
                                    <span className="flex items-center gap-1 text-xs font-medium text-amber-600">
                                        <HiExclamationCircle className="w-3.5 h-3.5" />
                                        {summary.lowStock} stock bajo
                                    </span>
                                )}
                                {totalAlerts === 0 && (
                                    <span className="text-xs text-emerald-600 font-medium">
                                        ✓ Todo en orden
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Body */}
                    <div className="overflow-y-auto max-h-[280px]">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <Spinner size={28} />
                            </div>
                        ) : topAlerts.length === 0 ? (
                            <div className="py-8 text-center">
                                <div className="text-3xl mb-2">📦</div>
                                <p className="text-sm text-gray-500">No hay alertas de inventario</p>
                                <p className="text-xs text-gray-400 mt-1">Todos los productos están bien abastecidos</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-50 dark:divide-gray-700">
                                {topAlerts.map(product => {
                                    const isOutOfStock = product.stockLevel?.level === 'out_of_stock'
                                    return (
                                        <li
                                            key={product.id}
                                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                                            onClick={() => {
                                                setPanelOpen(false)
                                                navigate('/catalogo/productos')
                                            }}
                                        >
                                            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${isOutOfStock ? 'bg-red-100' : 'bg-amber-100'}`}>
                                                {isOutOfStock
                                                    ? <HiXCircle className="w-4 h-4 text-red-600" />
                                                    : <HiExclamationCircle className="w-4 h-4 text-amber-600" />
                                                }
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                    {product.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {product.sku} · Stock: <span className={`font-semibold ${isOutOfStock ? 'text-red-600' : 'text-amber-600'}`}>{product.stock ?? 0}</span>
                                                    {product.stockMin > 0 && <span className="text-gray-400"> / mín. {product.stockMin}</span>}
                                                </p>
                                            </div>
                                            <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${isOutOfStock ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {product.stockLevel?.label}
                                            </span>
                                        </li>
                                    )
                                })}
                            </ul>
                        )}
                    </div>

                    {/* Footer */}
                    {topAlerts.length > 0 && (
                        <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-2.5">
                            <button
                                onClick={() => {
                                    setPanelOpen(false)
                                    navigate('/catalogo/productos')
                                }}
                                className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                            >
                                Ver todos los productos
                                <HiArrowRight className="w-3 h-3" />
                            </button>
                        </div>
                    )}
                </div>,
                document.body
            )}
        </>
    )
}

export default StockAlertIndicator
