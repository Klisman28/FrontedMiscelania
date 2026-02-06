import React, { useEffect, useState, useMemo } from 'react'
import { Card, Button, Input } from 'components/ui'
import { AdaptableCard, DataTable } from 'components/shared'
import { HiArrowLeft, HiSearch } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux'
import reducer, { getWarehouseStock, setSelectedWarehouse } from 'store/warehouses/warehousesSlice'
import { injectReducer } from 'store/index'
import { useNavigate, useParams } from 'react-router-dom'
import warehouseService from 'services/warehouseService'

injectReducer('warehouses', reducer)

const WarehouseStockPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { id } = useParams()
    const { stock, loading, wsTotal } = useSelector((state) => state.warehouses)
    const [warehouseName, setWarehouseName] = useState('')
    const [search, setSearch] = useState('')
    const [tableData, setTableData] = useState({
        pageIndex: 1,
        pageSize: 10,
        sort: { order: '', key: '' }
    })

    useEffect(() => {
        if (id) {
            fetchStock()
            fetchWarehouseDetails()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, search, tableData.pageIndex, tableData.pageSize, tableData.sort])

    const fetchStock = () => {
        dispatch(getWarehouseStock({
            id,
            params: {
                search,
                pageIndex: tableData.pageIndex,
                pageSize: tableData.pageSize,
                sort: tableData.sort
            }
        }))
    }

    const fetchWarehouseDetails = async () => {
        try {
            const response = await warehouseService.fetchWarehouse(id)
            if (response.data) {
                setWarehouseName(response.data.name)
            }
        } catch (error) {
            console.error('Error fetching warehouse details', error)
        }
    }

    const onSearchChange = (e) => {
        setSearch(e.target.value)
    }

    const onPaginationChange = (page) => {
        setTableData(prev => ({ ...prev, pageIndex: page }))
    }

    const onSelectChange = (value) => {
        setTableData(prev => ({ ...prev, pageSize: Number(value), pageIndex: 1 }))
    }

    const onSort = (sort) => {
        setTableData(prev => ({ ...prev, sort }))
    }

    const handleBack = () => {
        navigate('/warehouses')
    }

    const columns = useMemo(() => [
        {
            Header: 'Producto',
            accessor: 'productName', // Adjust based on API response, e.g., product.name or productName
            sortable: true,
            Cell: props => {
                const row = props.row.original
                return (
                    <span className="font-semibold">{row.productName || row.product?.name || 'Producto desconocido'}</span>
                )
            }
        },
        {
            Header: 'SKU / Código',
            accessor: 'sku',
            sortable: true,
            Cell: props => {
                const row = props.row.original
                console.log('🔍 Stock row data:', row)
                return (
                    <span>{row.sku || row.product?.code || row.product?.sku || row.barcode || '-'}</span>
                )
            }
        },
        {
            Header: 'Cantidad',
            accessor: 'quantity',
            sortable: true,
            Cell: props => {
                const row = props.row.original
                return (
                    <span className={`font-bold ${row.quantity > 0 ? 'text-gray-900' : 'text-red-500'}`}>
                        {row.quantity}
                    </span>
                )
            }
        },
    ], [])

    const pagingData = useMemo(() => ({
        total: wsTotal,
        pageIndex: tableData.pageIndex,
        pageSize: tableData.pageSize
    }), [wsTotal, tableData.pageIndex, tableData.pageSize])

    return (
        <AdaptableCard>
            <div className="lg:flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 mb-4 lg:mb-0">
                    <Button
                        shape="circle"
                        variant="plain"
                        size="lg"
                        icon={<HiArrowLeft />}
                        onClick={handleBack}
                    />
                    <h3>Stock en: {warehouseName}</h3>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center">
                    <Input
                        className="mb-4 lg:mb-0 lg:mr-4"
                        prefix={<HiSearch className="text-lg" />}
                        placeholder="Buscar producto..."
                        onChange={onSearchChange}
                        value={search}
                    />
                </div>
            </div>
            <DataTable
                columns={columns}
                data={stock}
                loading={loading}
                pagingData={pagingData}
                onPaginationChange={onPaginationChange}
                onSelectChange={onSelectChange}
                onSort={onSort}
            />
        </AdaptableCard>
    )
}

export default WarehouseStockPage
