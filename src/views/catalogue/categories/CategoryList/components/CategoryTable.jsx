import React, { useEffect, useMemo } from 'react'
import { Table, Pagination, Avatar } from 'components/ui'
import { useTable, usePagination, useSortBy, useFilters, useGlobalFilter } from 'react-table'
import { HiOutlinePencil, HiOutlineTrash, HiExclamation } from 'react-icons/hi'
import { FiPackage } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { getCategories } from '../store/dataSlice'
import { toggleDeleteConfirmation, setDrawerOpen, setSelectedCategory, setActionForm } from '../store/stateSlice'
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
		<div className="flex justify-end gap-2 text-right">
			<button className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors opacity-60 hover:opacity-100" onClick={onEdit}>
				<HiOutlinePencil className="text-lg" />
			</button>
			<button className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-slate-100 hover:text-red-600 text-slate-400 transition-colors opacity-60 hover:opacity-100" onClick={onDelete}>
				<HiOutlineTrash className="text-lg" />
			</button>
		</div>
	)
}

const CategoryTable = ({ globalFilter, onSelect, selectedId, compact }) => {
	const dispatch = useDispatch()
	const { initialPageIndex, initialPageSize, total } = useSelector((state) => state.categories.data.tableData)
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
						<Avatar size={32} shape="rounded" src={row.img} icon={<FiPackage />} className="bg-white border border-slate-200 text-slate-600 shadow-sm" />
						<div className="flex flex-col">
							<span className="font-semibold text-slate-800 text-sm">{row.name}</span>
							{compact && <span className="text-xs text-slate-500 font-mono tabular-nums">{row.code}</span>}
						</div>
					</div>
				)
			},
		},
		!compact && {
			Header: 'Código',
			accessor: 'code',
			sortable: true,
			Cell: props => <span className="font-mono text-sm text-slate-600 tabular-nums">{props.value}</span>
		},
		!compact && {
			Header: 'Slug',
			accessor: 'slug',
			sortable: true,
			Cell: props => <span className="text-xs text-slate-400 italic max-w-[150px] truncate block">{props.value}</span>
		},
		{
			Header: '', // Actions
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
		state: { pageIndex, pageSize },
		setGlobalFilter: setTableGlobalFilter
	} = useTable(
		{
			columns,
			data,
			initialState: { pageIndex: initialPageIndex, pageSize: compact ? 10 : initialPageSize },
			manualPagination: false,
			filterTypes,
		},
		useFilters,
		useGlobalFilter,
		useSortBy,
		usePagination,
	)

	useEffect(() => {
		setTableGlobalFilter(globalFilter || undefined)
	}, [globalFilter, setTableGlobalFilter])

	const onPaginationChange = page => {
		gotoPage(page - 1)
	}

	return (
		<>
			<div className="overflow-x-auto h-full flex flex-col">
				<Table {...getTableProps()} className="w-full">
					<THead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10 w-full">
						{headerGroups.map(headerGroup => (
							<Tr {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map(column => (
									<Th {...column.getHeaderProps(column.getSortByToggleProps())} className="text-xs uppercase font-bold text-slate-500 tracking-wide py-3 px-4 first:pl-6 last:pr-6 whitespace-nowrap">
										<div className="flex items-center gap-1 cursor-pointer hover:text-slate-700 transition-colors">
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
                                        transition-all duration-150 border-b border-slate-100 last:border-0 hover:bg-slate-50 group
                                        h-14
                                        ${isSelected ? 'bg-slate-50' : 'bg-white'}
                                    `}
									onClick={compact ? () => onSelect && onSelect(row.original) : undefined}
								>
									{row.cells.map((cell, idx) => {
										// Add subtle left border to first cell if selected
										const isFirst = idx === 0
										return (
											<Td
												{...cell.getCellProps()}
												className={`
													px-4 py-2 first:pl-6 last:pr-6 relative
													${isSelected && isFirst ? 'after:content-[""] after:absolute after:left-0 after:top-0 after:bottom-0 after:w-1 after:bg-indigo-500' : ''}
												`}
											>
												{cell.render('Cell')}
											</Td>
										)
									})}
								</Tr>
							)
						})}
						{page.length === 0 && (
							<Tr>
								<Td className="text-center py-12" colSpan={columns.length}>
									<div className='flex flex-col items-center justify-center space-y-3 text-slate-400'>
										<HiExclamation className='w-8 h-8 opacity-20' />
										<span className="text-xs font-medium">Sin resultados</span>
									</div>
								</Td>
							</Tr>
						)}
					</TBody>
				</Table>
			</div>

			{/* Pagination at bottom */}
			<div className="border-t border-slate-200 p-3 bg-white sticky bottom-0 z-10">
				<Pagination
					pageSize={pageSize}
					currentPage={pageIndex + 1}
					total={data.length}
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