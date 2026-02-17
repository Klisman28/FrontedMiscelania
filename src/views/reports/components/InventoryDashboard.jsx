import React, { useEffect, useState } from 'react'
import { Card, Table, Button, Badge } from 'components/ui'
import { HiDownload, HiCurrencyDollar, HiExclamation, HiCheckCircle } from 'react-icons/hi'
import { apiGetInventoryValuation, apiGetLowStock, apiGetReportExport } from 'services/ReportsService'
import { NumericFormat } from 'react-number-format'
import dayjs from 'dayjs'
import { pickList } from '../../../utils/pickList'

const { Tr, Th, Td, THead, TBody } = Table

const InventoryDashboard = ({ filter }) => {
    const [loading, setLoading] = useState(false)
    const [valuation, setValuation] = useState({ totalValue: 0, totalProducts: 0 })
    const [lowStock, setLowStock] = useState([])

    const fetchData = async () => {
        setLoading(true)
        try {
            const params = {
                warehouseId: filter.warehouseId
            }

            const [resValuation, resLowStock] = await Promise.all([
                apiGetInventoryValuation(params),
                apiGetLowStock({ ...params, limit: 50 })
            ])

            if (resValuation.data) setValuation(resValuation.data[0] || { totalValue: 0, totalProducts: 0 })

            setLowStock(pickList(resLowStock, 'stock'))

        } catch (error) {
            console.error('Error fetching inventory report', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [filter.warehouseId]) // Inventory mainly depends on warehouse, not dates usually

    const handleExport = async (type) => {
        try {
            const params = {
                warehouseId: filter.warehouseId,
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

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="flex items-center gap-4 p-4 border border-gray-100 shadow-sm rounded-2xl">
                    <div className="p-3 rounded-full bg-emerald-50 text-emerald-600">
                        <HiCurrencyDollar className="text-2xl" />
                    </div>
                    <div>
                        <h6 className="text-gray-500 text-sm font-medium">Valor Total Inventario</h6>
                        <h4 className="text-xl font-bold text-gray-900">
                            <NumericFormat value={valuation.totalValue} displayType="text" prefix="Q " thousandSeparator="," decimalScale={2} />
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">Costo Total Productos</p>
                    </div>
                </Card>
                <Card className="flex items-center gap-4 p-4 border border-gray-100 shadow-sm rounded-2xl">
                    <div className="p-3 rounded-full bg-indigo-50 text-indigo-600">
                        <HiExclamation className="text-2xl" />
                    </div>
                    <div>
                        <h6 className="text-gray-500 text-sm font-medium">Productos con Stock Crítico</h6>
                        <h4 className="text-xl font-bold text-gray-900">{(Array.isArray(lowStock) ? lowStock : []).filter(i => i.stock === 0).length}</h4>
                        <p className="text-xs text-gray-400 mt-1">Agotados</p>
                    </div>
                </Card>
            </div>

            <Card className="rounded-2xl border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h5 className="font-bold text-gray-800">Productos Bajo Stock</h5>
                    <Button size="xs" icon={<HiDownload />} onClick={() => handleExport('low_stock')}>CSV</Button>
                </div>
                <Table size="sm">
                    <THead className="bg-slate-50">
                        <Tr>
                            <Th>Producto</Th>
                            <Th className="text-center">Stock Actual</Th>
                            <Th className="text-center">Mínimo</Th>
                            <Th className="text-center">Estado</Th>
                        </Tr>
                    </THead>
                    <TBody>
                        {lowStock.length > 0 ? lowStock.map((prod, idx) => (
                            <Tr key={idx} className="hover:bg-slate-50 transition-colors">
                                <Td className="font-medium text-gray-700 max-w-[300px] truncate" title={prod.name}>{prod.name}</Td>
                                <Td className="text-center font-bold">{prod.stock}</Td>
                                <Td className="text-center text-gray-500">{prod.stockMin}</Td>
                                <Td className="text-center">
                                    {prod.stock === 0 ? (
                                        <Badge className="bg-red-50 text-red-600 border border-red-200">AGOTADO</Badge>
                                    ) : (
                                        <Badge className="bg-amber-50 text-amber-600 border border-amber-200">BAJO</Badge>
                                    )}
                                </Td>
                            </Tr>
                        )) : (
                            <Tr><Td colSpan={4} className="text-center text-gray-400 py-8"><HiCheckCircle className="inline mr-2 text-xl text-emerald-500" /> Todo en orden</Td></Tr>
                        )}
                    </TBody>
                </Table>
            </Card>
        </div>
    )
}

export default InventoryDashboard
