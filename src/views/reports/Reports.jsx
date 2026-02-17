import React, { useState, useEffect } from 'react'
import { Tabs, Card, Button, Input, Select, DatePicker } from 'components/ui'
import { HiOutlineFilter, HiDownload } from 'react-icons/hi'
import SalesDashboard from './components/SalesDashboard'
import PurchasesDashboard from './components/PurchasesDashboard'
import InventoryDashboard from './components/InventoryDashboard'
import 'dayjs/locale/es'

const { TabNav, TabList, TabContent } = Tabs

const Reports = () => {
    const [currentTab, setCurrentTab] = useState('sales')

    // Default: Last 7 days
    const defaultEndDate = new Date()
    const defaultStartDate = new Date()
    defaultStartDate.setDate(defaultEndDate.getDate() - 7)

    const [filter, setFilter] = useState({
        startDate: defaultStartDate,
        endDate: defaultEndDate,
        warehouseId: '', // Optional
        docType: 'Todos' // Optional
    })

    const handleDateChange = (value) => {
        if (value && value[0] && value[1]) {
            setFilter(prev => ({ ...prev, startDate: value[0], endDate: value[1] }))
        }
    }

    // Mock Options - In real app fetch from redux store (catalogs/warehouses)
    const warehouseOptions = [
        { value: '', label: 'Todas las Bodegas' },
        { value: 1, label: 'Principal' },
        // ... more
    ]

    const docTypeOptions = [
        { value: 'Todos', label: 'Todos los Documentos' },
        { value: 'Ticket', label: 'Ticket' },
        { value: 'Factura', label: 'Factura' },
        // ... more
    ]

    return (
        <div className="flex flex-col gap-4 h-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="mb-1">Reportes</h3>
                    <p className="text-slate-500">Visualiza métricas clave de tu negocio</p>
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                    {/* Filters Bar */}
                    <Card className="p-3 !border-gray-200 shadow-sm flex flex-col md:flex-row gap-3 items-center">
                        <div className="flex items-center gap-2">
                            <HiOutlineFilter className="text-lg text-gray-400" />
                            <span className="font-semibold text-gray-700">Filtros:</span>
                        </div>
                        <div className="w-full md:w-64">
                            <DatePicker.DatePickerRange
                                placeholder="Seleccionar rango"
                                value={[filter.startDate, filter.endDate]}
                                onChange={handleDateChange}
                                size="sm"
                                inputFormat="DD/MM/YYYY"
                                locale="es"
                            />
                        </div>
                        {currentTab === 'sales' && (
                            <div className="w-full md:w-40">
                                <Select
                                    size="sm"
                                    options={docTypeOptions}
                                    value={docTypeOptions.find(opt => opt.value === filter.docType)}
                                    onChange={opt => setFilter(prev => ({ ...prev, docType: opt.value }))}
                                />
                            </div>
                        )}
                        {/* Warehouse Filter (valid for all Tabs usually) */}
                        <div className="w-full md:w-48">
                            <Select
                                size="sm"
                                placeholder="Bodega"
                                options={warehouseOptions}
                                value={warehouseOptions.find(opt => opt.value === filter.warehouseId)}
                                onChange={opt => setFilter(prev => ({ ...prev, warehouseId: opt?.value || '' }))}
                                isClearable
                            />
                        </div>
                    </Card>
                </div>
            </div>

            <div className="mt-4">
                <Tabs defaultValue="sales" onChange={setCurrentTab}>
                    <TabList>
                        <TabNav value="sales">Ventas</TabNav>
                        <TabNav value="purchases">Compras</TabNav>
                        <TabNav value="inventory">Inventario</TabNav>
                    </TabList>
                    <div className="p-4 bg-gray-50/50 rounded-b-lg border border-gray-200 border-t-0 min-h-[500px]">
                        <TabContent value="sales">
                            <SalesDashboard filter={filter} />
                        </TabContent>
                        <TabContent value="purchases">
                            <PurchasesDashboard filter={filter} />
                        </TabContent>
                        <TabContent value="inventory">
                            <InventoryDashboard filter={filter} />
                        </TabContent>
                    </div>
                </Tabs>
            </div>
        </div>
    )
}

export default Reports
