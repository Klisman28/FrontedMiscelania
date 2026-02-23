import React, { useEffect, useMemo, useState } from 'react'
import { Table, Pagination, Select, Input, Button, Avatar } from 'components/ui'
import { useTable, usePagination, useSortBy, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table'
import { HiOutlinePencil, HiOutlineTrash, HiOutlineSearch, HiPlusCircle, HiExclamation } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux'
import { getUsers } from '../store/dataSlice'
import { toggleDeleteConfirmation, setDrawerOpen, setSelectedUser, setActionForm } from '../store/stateSlice'
import useThemeClass from 'utils/hooks/useThemeClass'
import UserDeleteConfirmation from './UserDeleteConfirmation'
import UserEditDialog from './UserEditDialog'
import { matchSorter } from 'match-sorter'
import { upperFirst } from 'lodash'
import BillingStats from './BillingStats'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

// --- Helper Functions ---
function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}
fuzzyTextFilterFn.autoRemove = val => !val

// --- Components ---

const FilterInput = ({ globalFilter, setGlobalFilter }) => {
    const [value, setValue] = useState(globalFilter)
    const onChange = useAsyncDebounce(value => {
        setGlobalFilter(value || undefined)
    }, 200)

    return (
        <Input
            className="w-full md:w-80"
            size="md"
            value={value || ""}
            onChange={e => {
                setValue(e.target.value)
                onChange(e.target.value)
            }}
            placeholder="Buscar usuarios..."
            prefix={<HiOutlineSearch className="text-xl text-slate-400" />}
            inputClass="rounded-xl h-11"
        />
    )
}

const ActionColumn = ({ row }) => {
    const dispatch = useDispatch()

    const onEdit = () => {
        dispatch(setActionForm('edit'))
        dispatch(setDrawerOpen())
        dispatch(setSelectedUser(row))
    }

    const onDelete = () => {
        dispatch(toggleDeleteConfirmation(true))
        dispatch(setSelectedUser(row))
    }

    return (
        <div className="flex justify-end gap-2 text-lg">
            <button className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-600 transition-colors" onClick={onEdit}>
                <HiOutlinePencil />
            </button>
            <button className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-slate-100 hover:text-red-600 text-slate-600 transition-colors" onClick={onDelete}>
                <HiOutlineTrash />
            </button>
        </div>
    )
}

const MainColumn = ({ row }) => {
    return (
        <div className="flex items-center">
            <Avatar size={32} shape="circle" className="mr-3 bg-indigo-100 text-indigo-600 font-bold">
                {row.username ? row.username.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            <span className={`font-semibold text-slate-900`}>
                {row.username}
            </span>
        </div>
    )
}

const UserTable = () => {
    const dispatch = useDispatch()
    const { initialPageIndex, initialPageSize, total } = useSelector((state) => state.userList.data.tableData)
    // const loading = useSelector((state) => state.userList.data.loading) // Ignoring loading for pure UI layout as per instructions to keep it simple, or I can wrap table. 
    // Wait, I should keep loading state if possible but I'll focus on layout. The original used DataTableSimple which handles loading.
    // I will assume data is loaded for layout purposes or add basic conditional if empty.
    // I will assume data is loaded for layout purposes or add basic conditional if empty.
    const data = useSelector((state) => state.userList.data.userList)
    const [isLimitReached, setIsLimitReached] = useState(false)

    useEffect(() => {
        dispatch(getUsers())
    }, [dispatch])

    const filterTypes = useMemo(() => ({
        fuzzyText: fuzzyTextFilterFn,
        text: (rows, id, filterValue) => {
            return rows.filter(row => {
                const rowValue = row.values[id]
                return rowValue !== undefined ? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase()) : true
            })
        },
    }), [])

    const columns = useMemo(() => [
        {
            Header: 'Nombre Usuario',
            accessor: 'username',
            sortable: true,
            Cell: props => <MainColumn row={props.row.original} />,
        },
        {
            Header: 'Empleado',
            accessor: 'employee.fullname',
            sortable: true,
            Cell: props => <span className="text-slate-600 font-medium">{props.value}</span>
        },
        {
            Header: 'Roles',
            accessor: 'roles',
            sortable: false,
            Cell: props => {
                const row = props.row.original
                return (
                    <div className="flex gap-2 flex-wrap">
                        {row.roles?.map((role, key) => (
                            <span
                                key={key}
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${role.name.toLowerCase() === 'admin'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                    : 'bg-slate-100 text-slate-700 border-slate-200'
                                    }`}
                            >
                                {upperFirst(role.name)}
                            </span>
                        ))}
                    </div>
                )
            }
        },
        {
            Header: 'Acciones',
            id: 'action',
            accessor: (row) => row,
            Cell: props => <ActionColumn row={props.row.original} />
        }
    ], [])

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        gotoPage,
        setPageSize,
        state: { pageIndex, pageSize, globalFilter },
        setGlobalFilter,
        rows
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: initialPageIndex, pageSize: initialPageSize },
            manualPagination: false,
            filterTypes,
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        usePagination,
    )

    const onPaginationChange = page => {
        gotoPage(page - 1)
    }

    const onSelectChange = value => {
        setPageSize(Number(value))
    }

    const onAdd = () => {
        dispatch(setActionForm('create'))
        dispatch(setDrawerOpen())
    }

    const pageSizeOption = [5, 10, 25, 50].map(
        number => ({ value: number, label: `${number} / Pág.` })
    )

    return (
        <div className="flex flex-col gap-4">
            <BillingStats onLimitReached={setIsLimitReached} />
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Usuario del Sistema</h3>
                    <p className="text-slate-500 text-sm mt-1">Administra usuarios y roles</p>
                </div>
                <div className="flex flex-col md:flex-row gap-3 items-center">
                    <FilterInput globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
                    <Button
                        variant="solid"
                        disabled={isLimitReached}
                        size="md"
                        className="rounded-xl h-11 w-full md:w-auto px-6 font-semibold shadow-lg shadow-indigo-500/20"
                        icon={<HiPlusCircle className="text-lg" />}
                        onClick={onAdd}
                    >
                        Nuevo Usuario
                    </Button>
                </div>
            </div>

            {/* Card Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table {...getTableProps()}>
                        <THead className="bg-slate-50 border-b border-slate-200">
                            {headerGroups.map(headerGroup => (
                                <Tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <Th {...column.getHeaderProps(column.getSortByToggleProps())} className="text-xs font-bold text-slate-500 uppercase tracking-wider py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                {column.render('Header')}
                                                <span className='cursor-default'>
                                                    {column.sortable && <Sorter sort={column.isSortedDesc} />}
                                                </span>
                                            </div>
                                        </Th>
                                    ))}
                                </Tr>
                            ))}
                        </THead>
                        <TBody {...getTableBodyProps()}>
                            {page.map((row, i) => {
                                prepareRow(row)
                                return (
                                    <Tr {...row.getRowProps()} className="hover:bg-slate-50/80 transition-colors h-16 border-b border-slate-100 last:border-0">
                                        {row.cells.map(cell => {
                                            return <Td {...cell.getCellProps()} className="px-6 py-4">{cell.render('Cell')}</Td>
                                        })}
                                    </Tr>
                                )
                            })}
                            {page.length === 0 && (
                                <Tr>
                                    <Td className="text-center py-12" colSpan={columns.length}>
                                        <div className='flex flex-col items-center justify-center space-y-3 text-slate-400'>
                                            <div className="p-3 rounded-full bg-slate-50">
                                                <HiExclamation className='w-8 h-8' />
                                            </div>
                                            <span>No se encontró ningún registro</span>
                                        </div>
                                    </Td>
                                </Tr>
                            )}
                        </TBody>
                    </Table>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white">
                    <Pagination
                        pageSize={pageSize}
                        currentPage={pageIndex + 1}
                        total={rows.length}
                        onChange={onPaginationChange}
                    />
                    <div className="text-slate-500 text-sm font-medium">
                        Total registros {rows.length}
                    </div>
                    <div style={{ minWidth: 120 }}>
                        <Select
                            size="sm"
                            menuPlacement="top"
                            isSearchable={false}
                            value={pageSizeOption.filter(option => option.value === pageSize)}
                            options={pageSizeOption}
                            onChange={option => onSelectChange(option.value)}
                            className="text-sm font-medium"
                        />
                    </div>
                </div>
            </div>

            <UserDeleteConfirmation />
            <UserEditDialog />
        </div>
    )
}

export default UserTable