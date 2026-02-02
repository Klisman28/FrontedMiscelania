import React, { useEffect, useState, useMemo } from 'react'
import { Card, Button, Input } from 'components/ui'
import { AdaptableCard, DataTable } from 'components/shared'
import { HiPlus, HiSearch } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux'
import reducer, { getWarehouses, setSelectedWarehouse } from 'store/warehouses/warehousesSlice'
import { injectReducer } from 'store/index'
import WarehouseFormModal from 'components/warehouses/WarehouseFormModal'
import { HiPencil, HiOutlineCube } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { cloneDeep } from 'lodash'

injectReducer('warehouses', reducer)

const WarehouseListPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const { warehouses, loading, total } = useSelector((state) => state.warehouses)
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search])

    const fetchData = () => {
        // If your backend supports search/pagination via params, pass them here
        dispatch(getWarehouses({ search }))
    }

    const openModal = () => {
        setModalIsOpen(true)
    }

    const closeModal = () => {
        setModalIsOpen(false)
    }

    const handleEdit = (row) => {
        dispatch(setSelectedWarehouse(row))
        openModal()
    }

    const handleViewStock = (row) => {
        navigate(`/warehouses/${row.id}/stock`)
    }

    const onSearchChange = (e) => {
        setSearch(e.target.value)
    }

    const columns = useMemo(() => [
        {
            Header: 'Nombre',
            accessor: 'name',
            sortable: true,
        },
        {
            Header: 'Código',
            accessor: 'code',
            sortable: true,
            Cell: props => {
                const row = props.row.original
                return (
                    <span>{row.code || '-'}</span>
                )
            }
        },
        // If isActive is returned, uncomment:
        {
            Header: 'Activa',
            accessor: 'active',
            Cell: props => {
                const row = props.row.original
                return (
                    <div className="flex items-center gap-2">
                        <span className={`capitalize font-semibold ${row.active ? 'text-emerald-500' : 'text-red-500'}`}>
                            {row.active ? 'Activa' : 'Inactiva'}
                        </span>
                    </div>
                )
            }
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
                            onClick={() => handleViewStock(row)}
                            title="Ver Stock"
                        >
                            <HiOutlineCube />
                        </span>
                        <span
                            className="cursor-pointer p-2 hover:text-indigo-600"
                            onClick={() => handleEdit(row)}
                            title="Editar"
                        >
                            <HiPencil />
                        </span>
                    </div>
                )
            },
        },
    ], [])

    // Simple client-side filtering if backend search isn't rigorous or just as fallback
    // But ideally dispatch(getWarehouses({ search })) handles it
    // For now we just pass 'warehouses' to DataTable

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Bodegas</h3>
                <div className="flex flex-col lg:flex-row lg:items-center">
                    <Input
                        className="mb-4 lg:mb-0 lg:mr-4"
                        prefix={<HiSearch className="text-lg" />}
                        placeholder="Buscar bodega..."
                        onChange={onSearchChange}
                        value={search}
                    />
                    <Button
                        block
                        variant="solid"
                        icon={<HiPlus />}
                        onClick={openModal}
                    >
                        Nueva Bodega
                    </Button>
                </div>
            </div>
            <DataTable
                columns={columns}
                data={warehouses}
                loading={loading}
                pagingData={{ total, pageIndex: 1, pageSize: 10 }} // Mock paging data if not fully implemented in slice/backend response
                onPaginationChange={(page) => {
                    // implement pagination logic if API supports it
                    // dispatch(getWarehouses({ page }))
                }}
                onSelectChange={(option) => {
                    // implement page size change
                    // dispatch(getWarehouses({ size: option }))
                }}
                onSort={(sort) => {
                    // implement sort
                    // dispatch(getWarehouses({ sort }))
                }}
            />
            <WarehouseFormModal
                isOpen={modalIsOpen}
                onClose={closeModal}
            />
        </AdaptableCard>
    )
}

export default WarehouseListPage
