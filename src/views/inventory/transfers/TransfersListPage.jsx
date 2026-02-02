import React, { useEffect, useState, useMemo } from 'react'
import { Card, Button, Input, Tag } from 'components/ui'
import { AdaptableCard, DataTable } from 'components/shared'
import { HiPlus, HiSearch, HiOutlineEye } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux'
import reducer, { fetchTransfers, setTableData } from 'store/transfers/transfersSlice'
import warehousesReducer, { getWarehouses } from 'store/warehouses/warehousesSlice'
import { injectReducer } from 'store/index'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import cloneDeep from 'lodash/cloneDeep'

injectReducer('transfers', reducer)
injectReducer('warehouses', warehousesReducer)

const TransfersListPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { list, loadingList, total, tableData = { pageIndex: 1, pageSize: 10, sort: { order: '', key: '' }, query: '', total: 0 } } = useSelector((state) => state.transfers)
    const { warehouses } = useSelector((state) => state.warehouses)
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetchData()
        dispatch(getWarehouses())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, tableData.pageIndex, tableData.pageSize, tableData.sort])

    const fetchData = () => {
        dispatch(fetchTransfers({
            search,
            pageIndex: tableData.pageIndex,
            pageSize: tableData.pageSize,
            sort: tableData.sort
        }))
    }

    const warehouseMap = useMemo(() => {
        const map = {}
        if (Array.isArray(warehouses)) {
            warehouses.forEach(w => {
                map[w.id] = w.name
            })
        }
        return map
    }, [warehouses])

    const onPaginationChange = (page) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = page
        dispatch(setTableData(newTableData))
    }

    const onSelectChange = (value) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageSize = Number(value)
        newTableData.pageIndex = 1
        dispatch(setTableData(newTableData))
    }

    const onSort = (sort) => {
        const newTableData = cloneDeep(tableData)
        newTableData.sort = sort
        dispatch(setTableData(newTableData))
    }

    const onSearchChange = (e) => {
        setSearch(e.target.value)
    }

    const timelineStatus = {
        'PENDIENTE': 'bg-amber-100 text-amber-600',
        'COMPLETADO': 'bg-emerald-100 text-emerald-600',
        'CANCELADO': 'bg-red-100 text-red-600'
    }

    const columns = useMemo(() => [
        {
            Header: 'Id',
            accessor: 'id',
            sortable: true,
            Cell: props => <span className="font-semibold">#{props.row.original.id}</span>
        },
        {
            Header: 'Fecha',
            accessor: 'createdAt',
            sortable: true,
            Cell: props => {
                const row = props.row.original
                // Handle different date field names
                const date = row.createdAt || row.created_at || row.date
                return (
                    <span>{date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '-'}</span>
                )
            }
        },
        {
            Header: 'Origen',
            accessor: 'fromWarehouseId',
            sortable: true,
            Cell: props => {
                const row = props.row.original
                // Try nested object, then snake_case, then camelCase ID lookup
                const name = row.fromWarehouse?.name
                    || warehouseMap[row.from_warehouse_id]
                    || warehouseMap[row.fromWarehouseId]
                    || row.from_warehouse_id
                    || row.fromWarehouseId
                    || '-'
                return <span>{name}</span>
            }
        },
        {
            Header: 'Destino',
            accessor: 'toWarehouseId',
            sortable: true,
            Cell: props => {
                const row = props.row.original
                const name = row.toWarehouse?.name
                    || warehouseMap[row.to_warehouse_id]
                    || warehouseMap[row.toWarehouseId]
                    || row.to_warehouse_id
                    || row.toWarehouseId
                    || '-'
                return <span>{name}</span>
            }
        },
        {
            Header: '# Items',
            accessor: 'items',
            Cell: props => {
                const row = props.row.original
                return <span>{row.items?.length || 0}</span>
            }
        },
        {
            Header: 'Estado',
            accessor: 'status',
            Cell: props => {
                const row = props.row.original
                const status = row.status || 'PENDIENTE'
                return (
                    <Tag className={timelineStatus[status] || 'bg-gray-100 text-gray-600'}>
                        {status}
                    </Tag>
                )
            }
        },
        {
            Header: 'Observación',
            accessor: 'observation',
            Cell: props => <span className="truncate max-w-xs block">{props.row.original.observation || '-'}</span>
        },
        {
            Header: '',
            id: 'action',
            accessor: (row) => row,
            Cell: (props) => {
                const row = props.row.original
                return (
                    <div className="flex justify-end text-lg">
                        <span
                            className="cursor-pointer p-2 hover:text-indigo-600"
                            onClick={() => navigate(`/inventory/transfers/${row.id}`)}
                            title="Ver Detalle"
                        >
                            <HiOutlineEye />
                        </span>
                    </div>
                )
            },
        },
    ], [navigate, warehouseMap, timelineStatus])

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Historial de Transferencias</h3>
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <Input
                        prefix={<HiSearch className="text-lg" />}
                        placeholder="Buscar por observación o bodega..."
                        onChange={onSearchChange}
                        value={search}
                    />
                    <Button
                        block
                        variant="solid"
                        icon={<HiPlus />}
                        onClick={() => navigate('/inventory/transfers/new')}
                    >
                        Nueva Transferencia
                    </Button>
                </div>
            </div>
            <DataTable
                columns={columns}
                data={list}
                loading={loadingList}
                pagingData={tableData}
                onPaginationChange={onPaginationChange}
                onSelectChange={onSelectChange}
                onSort={onSort}
            />
        </AdaptableCard>
    )
}

export default TransfersListPage
