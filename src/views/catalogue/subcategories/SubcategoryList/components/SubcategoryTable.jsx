import React, { useEffect, useMemo } from 'react'
import { Table, Pagination, Avatar } from 'components/ui'
import { useTable, usePagination, useSortBy, useFilters, useGlobalFilter } from 'react-table'
import { HiOutlinePencil, HiOutlineTrash, HiExclamation } from 'react-icons/hi'
import { FiPackage } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { getSubcategories } from '../store/dataSlice'
import { toggleDeleteConfirmation, setDrawerOpen, setSelectedSubcategory, setActionForm } from '../store/stateSlice'
import useThemeClass from 'utils/hooks/useThemeClass'
import SubcategoryDeleteConfirmation from './SubcategoryDeleteConfirmation'
import SubcategoryEditDialog from './SubcategoryEditDialog'
import { matchSorter } from 'match-sorter'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

function fuzzyTextFilterFn(rows, id, filterValue) {
	return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}
fuzzyTextFilterFn.autoRemove = val => !val

const ActionColumn = ({ row }) => {
	const dispatch = useDispatch()

	const onEdit = () => {
		dispatch(setActionForm('edit'))
		dispatch(setDrawerOpen())
		dispatch(setSelectedSubcategory(row))
	}

	const onDelete = () => {
		dispatch(toggleDeleteConfirmation(true))
		dispatch(setSelectedSubcategory(row))
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

const SubcategoryTable = ({ globalFilter, categoryIdFilter }) => {
	const dispatch = useDispatch()
	const { initialPageIndex, initialPageSize } = useSelector((state) => state.subcategories.data.tableData)
	const rawData = useSelector((state) => state.subcategories.data.subcategoryList)

	// Filter by Category ID if provided
	const data = useMemo(() => {
		if (!categoryIdFilter) return rawData
		return rawData.filter(sub => sub.categoryId === categoryIdFilter || sub.category?.id === categoryIdFilter)
	}, [rawData, categoryIdFilter])

	useEffect(() => {
		// Fetch if empty (or always to ensure freshness)
		if (rawData.length === 0) dispatch(getSubcategories())
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
			Header: 'Subcategoría',
			accessor: 'name',
			sortable: true,
			Cell: props => {
				const row = props.row.original
				return (
					<div className="flex items-center gap-3">
						<Avatar size={32} shape="rounded" src={row.img} icon={<FiPackage />} className="bg-slate-100 text-slate-500" />
						<div className="flex flex-col">
							<span className="font-semibold text-slate-700">{row.name}</span>
							<span className="text-[10px] text-slate-400">{row.code}</span>
						</div>
					</div>
				)
			},
		},
		// Show Category column ONLY if NOT filtering by category
		!categoryIdFilter && {
			Header: 'Categoría',
			accessor: 'category.name',
			sortable: true,
			Cell: props => <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">{props.value}</span>
		},
		{
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
	].filter(Boolean), [categoryIdFilter])

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		page,
		gotoPage,
		setPageSize,
		state: { pageIndex, pageSize },
		setGlobalFilter: setTableGlobalFilter
	} = useTable(
		{
			columns,
			data,
			initialState: { pageIndex: 0, pageSize: initialPageSize || 10 },
			manualPagination: false,
			filterTypes,
		},
		useFilters,
		useGlobalFilter,
		useSortBy, // FIX: Moved before pagination
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
				<Table {...getTableProps()}>
					<THead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
						{headerGroups.map(headerGroup => (
							<Tr {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map(column => (
									<Th {...column.getHeaderProps(column.getSortByToggleProps())} className="text-[10px] uppercase font-bold text-slate-500 tracking-wider py-3 px-4">
										<div className="flex items-center gap-1 cursor-pointer hover:text-slate-700">
											{column.render('Header')}
											<span><Sorter sort={column.isSortedDesc} /></span>
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
								<Tr {...row.getRowProps()} className="hover:bg-slate-50 transition-colors h-14 border-b border-slate-100 last:border-0">
									{row.cells.map(cell => {
										return <Td {...cell.getCellProps()} className="px-4 py-2">{cell.render('Cell')}</Td>
									})}
								</Tr>
							)
						})}
						{page.length === 0 && (
							<Tr>
								<Td className="text-center py-12" colSpan={columns.length}>
									<div className='flex flex-col items-center justify-center space-y-3 text-slate-400'>
										<HiExclamation className='w-6 h-6' />
										<span className="text-xs">
											{categoryIdFilter ? 'Esta categoría no tiene subcategorías' : 'Sin resultados'}
										</span>
									</div>
								</Td>
							</Tr>
						)}
					</TBody>
				</Table>
			</div>

			<div className="border-t border-slate-200 p-2 bg-white sticky bottom-0 z-10">
				<Pagination
					pageSize={pageSize}
					currentPage={pageIndex + 1}
					total={data.length}
					onChange={onPaginationChange}
					className="flex justify-center"
				/>
			</div>

			<SubcategoryDeleteConfirmation />
			<SubcategoryEditDialog />
		</>
	)
}

export default SubcategoryTable