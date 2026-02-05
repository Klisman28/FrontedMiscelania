import React, { useMemo, useState } from 'react'
import { Table, Pagination, Select, Input } from 'components/ui'
import { useTable, usePagination, useSortBy, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table'
import PropTypes from 'prop-types'
import Loading from 'components/shared/Loading'
import TableRowSkeleton from 'components/shared/loaders/TableRowSkeleton'
import { matchSorter } from 'match-sorter'
import { HiExclamation, HiOutlineSearch } from 'react-icons/hi'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

function FilterInput({ globalFilter, setGlobalFilter }) {
    const [value, setValue] = useState(globalFilter)
    const onChange = useAsyncDebounce(value => {
        setGlobalFilter(value || undefined)
    }, 200)

    return (
        <Input
            className="w-full lg:w-[320px] mb-2 lg:mb-0"
            size="md"
            value={value || ""}
            onChange={e => {
                setValue(e.target.value)
                onChange(e.target.value)
            }}
            inputClassName="rounded-xl border-gray-200"
            placeholder="Buscar Productos..."
            prefix={<HiOutlineSearch className="text-lg text-gray-400" />}
        />
    )
}

function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val

const ProductDataTable = props => {

    const {
        skeletonAvatarColumns,
        columns,
        data,
        loading,
        pageSizes,
        skeletonAvatarProps,
        pagingData,
        tableTools,
        title
    } = props

    const { initialPageIndex, initialPageSize } = pagingData

    const pageSizeOption = useMemo(() => pageSizes.map(
        number => ({ value: number, label: `${number} / Pág.` })
    ), [pageSizes])

    const filterTypes = useMemo(() => ({
        fuzzyText: fuzzyTextFilterFn,
        text: (rows, id, filterValue) => {
            return rows.filter(row => {
                const rowValue = row.values[id]
                return rowValue !== undefined ? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase()) : true
            })
        },
    }), [])

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        rows,
        gotoPage,
        setPageSize,
        state: { pageIndex, pageSize, globalFilter },
        setGlobalFilter,
        allColumns
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

    return (
        <>
            <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6'>
                <h3 className='font-bold text-xl text-gray-800 mb-4 lg:mb-0'>{title}</h3>
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <FilterInput
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                    />
                    {tableTools}
                </div>
            </div>
            <Loading loading={loading && data.length !== 0} type="cover">
                <Table {...getTableProps()}>
                    <THead className="bg-slate-50">
                        {headerGroups.map(headerGroup => (
                            <Tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    column.sortable ? (
                                        <Th {...column.getHeaderProps(column.getSortByToggleProps())} className="text-xs uppercase tracking-wider font-semibold text-gray-500 py-4 border-b border-gray-100">
                                            <div className={`flex items-center ${column.alignRight ? 'justify-end' : ''}`}>
                                                {column.render('Header')}
                                                <span className='cursor-default ml-1'>
                                                    <Sorter sort={column.isSortedDesc} />
                                                </span>
                                            </div>
                                        </Th>
                                    ) : (
                                        <Th {...column.getHeaderProps()} className={`text-xs uppercase tracking-wider font-semibold text-gray-500 py-4 border-b border-gray-100 ${column.alignRight ? 'text-right' : ''}`}>
                                            {column.render('Header')}
                                        </Th>
                                    )
                                ))}
                            </Tr>
                        ))}
                    </THead>
                    {
                        loading && data.length === 0 ?
                            (
                                <TableRowSkeleton
                                    columns={columns.length}
                                    rows={pagingData.pageSize}
                                    avatarInColumns={skeletonAvatarColumns}
                                    avatarProps={skeletonAvatarProps}
                                />
                            )
                            :
                            (
                                <TBody {...getTableBodyProps()}>
                                    {page.map((row, i) => {
                                        prepareRow(row)
                                        return (
                                            <Tr {...row.getRowProps()} className="hover:bg-slate-50 transition-colors duration-200">
                                                {row.cells.map(cell => {
                                                    return <Td {...cell.getCellProps()} className={`py-4 border-b border-gray-50 ${cell.column.id === 'action' ? 'sticky right-0 bg-white group-hover:bg-slate-50' : ''}`}>{cell.render('Cell')}</Td>
                                                })}
                                            </Tr>
                                        )
                                    })}
                                    {page.length === 0 && (
                                        <Tr>
                                            <Td className="text-center py-8" colSpan={allColumns.length}>
                                                <div className='flex items-center justify-center space-x-2 text-gray-500'>
                                                    <HiExclamation className='text-orange-500 w-5 h-5' />
                                                    <span>No se encontró ningún registro</span>
                                                </div>
                                            </Td>
                                        </Tr>
                                    )}
                                </TBody>
                            )
                    }
                </Table>
                <div className="flex items-center justify-between mt-6 px-2">
                    <Pagination
                        pageSize={pageSize}
                        currentPage={pageIndex + 1}
                        total={rows.length}
                        onChange={onPaginationChange}
                    />
                    <div className="text-sm text-gray-500">
                        Total registros {rows.length}
                    </div>
                    <div style={{ minWidth: 130 }}>
                        <Select
                            size="sm"
                            menuPlacement="top"
                            isSearchable={false}
                            value={pageSizeOption.filter(option => option.value === pageSize)}
                            options={pageSizeOption}
                            onChange={option => onSelectChange(option.value)}
                        />
                    </div>
                </div>
            </Loading>
        </>
    )
}

ProductDataTable.propTypes = {
    columns: PropTypes.array,
    data: PropTypes.array,
    loading: PropTypes.bool,
    pageSizes: PropTypes.arrayOf(PropTypes.number),
    skeletonAvatarColumns: PropTypes.arrayOf(PropTypes.number),
    skeletonAvatarProps: PropTypes.object,
    pagingData: PropTypes.shape({
        total: PropTypes.number,
        initialPageIndex: PropTypes.number,
        initialPageSize: PropTypes.number,
    }),
    tableTools: PropTypes.element,
    title: PropTypes.string
}

ProductDataTable.defaultProps = {
    pageSizes: [5, 10, 25, 50],
    pagingData: {
        total: 0,
        initialPageIndex: 0,
        initialPageSize: 5,
    },
    data: [],
    columns: [],
    loading: false,
    title: "DataTable"
}

export default ProductDataTable
