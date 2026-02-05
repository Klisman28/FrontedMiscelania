import React, { useEffect, useMemo } from 'react'
import { Table, Pagination, Tooltip, Avatar } from 'components/ui'
import { useTable, usePagination, useSortBy, useFilters, useGlobalFilter } from 'react-table'
import { HiOutlinePencil, HiOutlineTrash, HiExclamation } from 'react-icons/hi'
import { FiPackage } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { getCategories } from '../store/dataSlice'
import { toggleDeleteConfirmation, setDrawerOpen, setSelectedCategory, setActionForm } from '../store/stateSlice'
import useThemeClass from 'utils/hooks/useThemeClass'
import CategoryDeleteConfirmation from './CategoryDeleteConfirmation'
import CategoryEditDialog from './CategoryEditDialog'
import { matchSorter } from 'match-sorter'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

function fuzzyTextFilterFn(rows, id, filterValue) {
	return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}
fuzzyTextFilterFn.autoRemove = val => !val

const ActionColumn = ({ row }) => {
	const dispatch = useDispatch()
	const { textTheme } = useThemeClass()

	const onEdit = (e) => {
		e.stopPropagation()
		dispatch(setActionForm('edit'))
		dispatch(setDrawerOpen())
		dispatch(setSelectedCategory(row))
	}

	const onDelete = (e) => {
		e.stopPropagation()
		dispatch(toggleDeleteConfirmation(true))
		dispatch(setSelectedCategory(row))
	}

	return (
		<div className="flex justify-end gap-2">
			<button className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-500 hover:text-indigo-600 transition-colors" onClick={onEdit}>
				<HiOutlinePencil />
			</button>
			<button className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-slate-100 hover:text-red-600 text-slate-500 transition-colors" onClick={onDelete}>
				<HiOutlineTrash />
			</button>
		</div>
	)
}

const CategoryTable = ({ globalFilter, onSelect, selectedId, compact }) => {
	const dispatch = useDispatch()
	const { initialPageIndex, initialPageSize, total } = useSelector((state) => state.categories.data.tableData)
	const loading = useSelector((state) => state.categories.data.loading)
	const data = useSelector((state) => state.categories.data.categoryList)

	useEffect(() => {
		dispatch(getCategories())
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
			Header: 'Categoría',
			accessor: 'name',
			sortable: true,
			Cell: props => {
				const row = props.row.original
				return (
					<div className="flex items-center gap-3">
						<Avatar size={compact ? 28 : 32} shape="rounded" src={row.img} icon={<FiPackage />} className="bg-white border border-slate-200 text-slate-600" />
						<span className="font-semibold text-slate-700">{row.name}</span>
					</div>
				)
			},
		},
		{
			Header: 'Código',
			accessor: 'code',
			sortable: true,
			Cell: props => <span className="text-xs font-mono text-slate-500">{props.value}</span>
		},
		// Hide slug in compact mode if necessary, but 2-col layout is wide enough usually.
		!compact && {
			Header: 'Slug',
			accessor: 'slug',
			sortable: true,
			Cell: props => <span className="text-xs text-slate-400 italic">{props.value}</span>
		},
		{
			Header: '',
			id: 'action',
			accessor: (row) => row,
			Cell: props => <ActionColumn row={props.row.original} />
		}
	].filter(Boolean), [compact])

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		page,
		gotoPage,
		setPageSize,
		state: { pageIndex, pageSize },
		setGlobalFilter: setTableGlobalFilter // We use this to sync if needed, or pass state
	} = useTable(
		{
			columns,
			data,
			initialState: { pageIndex: initialPageIndex, pageSize: compact ? 8 : initialPageSize }, // Smaller page size for compact
			manualPagination: false,
			filterTypes,
		},
		useFilters,
		useGlobalFilter,
		usePagination,
		useSortBy,
	)

	// Sync global filter from prop
	useEffect(() => {
		setTableGlobalFilter(globalFilter || undefined)
	}, [globalFilter, setTableGlobalFilter])

	const onPaginationChange = page => {
		gotoPage(page - 1)
	}

	return (
		<>
			<div className="overflow-x-auto h-full flex flex-col">
				<Table {...getTableProps()} className={compact ? 'table-compact' : ''}>
					<THead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10 w-full">
						{headerGroups.map(headerGroup => (
							<Tr {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map(column => (
									<Th {...column.getHeaderProps(column.getSortByToggleProps())} className={`text-[10px] uppercase font-bold text-slate-500 tracking-wider py-3 px-4 ${compact ? 'py-2' : ''}`}>
										<div className="flex items-center gap-1 cursor-pointer hover:text-slate-700">
											{column.render('Header')}
											<span>
												<Sorter sort={column.isSortedDesc} />
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
							const isSelected = selectedId === row.original.id
							return (
								<Tr
									{...row.getRowProps()}
									className={`
                                        transition-all duration-150 border-b border-slate-100 last:border-0 
                                        ${compact ? 'h-12 cursor-pointer' : 'h-16'}
                                        ${isSelected ? 'bg-indigo-50 border-indigo-100' : 'hover:bg-slate-50'}
                                    `}
									onClick={compact ? () => onSelect && onSelect(row.original) : undefined}
								>
									{row.cells.map(cell => {
										return <Td {...cell.getCellProps()} className={`px-4 ${compact ? 'py-2' : 'py-4'}`}>{cell.render('Cell')}</Td>
									})}
								</Tr>
							)
						})}
						{page.length === 0 && (
							<Tr>
								<Td className="text-center py-12" colSpan={columns.length}>
									<div className='flex flex-col items-center justify-center space-y-3 text-slate-400'>
										<HiExclamation className='w-6 h-6' />
										<span className="text-xs">Sin resultados</span>
									</div>
								</Td>
							</Tr>
						)}
					</TBody>
				</Table>
			</div>
			{/* Simple Pagination for Compact */}
			<div className="border-t border-slate-200 p-2 bg-white sticky bottom-0 z-10">
				<Pagination
					pageSize={pageSize}
					currentPage={pageIndex + 1}
					total={data.length} // Client side match
					onChange={onPaginationChange}
					className="flex justify-center"
				/>
			</div>

			<CategoryDeleteConfirmation />
			<CategoryEditDialog />
		</>
	)
}

export default CategoryTable