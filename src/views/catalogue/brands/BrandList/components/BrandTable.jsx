import React, { useEffect, useMemo } from 'react'
import { Table, Pagination, Avatar, Select } from 'components/ui'
import { useTable, usePagination, useSortBy, useFilters, useGlobalFilter } from 'react-table'
import { HiOutlinePencil, HiOutlineTrash, HiExclamation } from 'react-icons/hi'
import { FiPackage } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { getBrands } from '../store/dataSlice'
import { toggleDeleteConfirmation, setDrawerOpen, setSelectedBrand, setActionForm } from '../store/stateSlice'
import BrandDeleteConfirmation from './BrandDeleteConfirmation'
import BrandEditDialog from './BrandEditDialog'
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
		dispatch(setSelectedBrand(row))
	}

	const onDelete = () => {
		dispatch(toggleDeleteConfirmation(true))
		dispatch(setSelectedBrand(row))
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

const BrandTable = ({ globalFilter }) => {
	const dispatch = useDispatch()
	const { initialPageIndex, initialPageSize } = useSelector((state) => state.brands.data.tableData)
	const data = useSelector((state) => state.brands.data.brandList)

	useEffect(() => {
		dispatch(getBrands())
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
			Header: 'Marca',
			accessor: 'name',
			sortable: true,
			Cell: props => {
				const row = props.row.original
				return (
					<div className="flex items-center gap-3">
						<Avatar size={32} shape="rounded" src={row.img} icon={<FiPackage />} className="bg-amber-50 text-amber-600 border border-amber-100" />
						<div className="flex flex-col">
							<span className="font-semibold text-slate-800 text-sm">{row.name}</span>
							<span className="text-[10px] text-slate-400 font-mono tabular-nums">{row.code}</span>
						</div>
					</div>
				)
			},
		},
		{
			Header: 'Código',
			accessor: 'code',
			sortable: true,
			Cell: props => <span className="font-mono text-sm text-slate-600 tabular-nums">{props.value}</span>
		},
		{
			Header: 'Slug',
			accessor: 'slug',
			sortable: true,
			Cell: props => <span className="text-xs text-slate-400 italic max-w-[200px] truncate block">{props.value}</span>
		},
		{
			Header: '',
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
		state: { pageIndex, pageSize },
		setGlobalFilter: setTableGlobalFilter
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

	useEffect(() => {
		setTableGlobalFilter(globalFilter || undefined)
	}, [globalFilter, setTableGlobalFilter])

	const onPaginationChange = page => {
		gotoPage(page - 1)
	}

	const onSelectChange = value => {
		setPageSize(Number(value))
	}

	const pageSizeOption = [10, 25, 50].map(
		number => ({ value: number, label: `${number} / Pág.` })
	)

	return (
		<>
			<div className="overflow-x-auto h-full flex flex-col">
				<Table {...getTableProps()} className="w-full">
					<THead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10 w-full">
						{headerGroups.map(headerGroup => (
							<Tr {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map(column => (
									<Th {...column.getHeaderProps(column.getSortByToggleProps())} className="text-xs uppercase font-bold text-slate-500 tracking-wide py-3 px-6 first:pl-6 last:pr-6 whitespace-nowrap">
										<div className="flex items-center gap-1 cursor-pointer hover:text-slate-700 transition-colors">
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
								<Tr {...row.getRowProps()} className="hover:bg-slate-50 transition-colors h-14 border-b border-slate-100 last:border-0 group">
									{row.cells.map(cell => {
										return <Td {...cell.getCellProps()} className="px-6 py-2 group-hover:text-slate-700">{cell.render('Cell')}</Td>
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

			<div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white sticky bottom-0 z-10">
				<Pagination
					pageSize={pageSize}
					currentPage={pageIndex + 1}
					total={data.length}
					onChange={onPaginationChange}
				/>
				<div style={{ minWidth: 120 }}>
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

			<BrandDeleteConfirmation />
			<BrandEditDialog />
		</>
	)
}

export default BrandTable