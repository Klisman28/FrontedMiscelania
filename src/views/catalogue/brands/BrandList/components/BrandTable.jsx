import React, { useEffect, useMemo } from 'react'
import { Table, Pagination, Avatar, Select } from 'components/ui'
import { useTable, usePagination, useSortBy, useFilters, useGlobalFilter } from 'react-table'
import { HiOutlinePencil, HiOutlineTrash, HiExclamation } from 'react-icons/hi'
import { FiPackage } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { getBrands } from '../store/dataSlice'
import { toggleDeleteConfirmation, setDrawerOpen, setSelectedBrand, setActionForm } from '../store/stateSlice'
import useThemeClass from 'utils/hooks/useThemeClass'
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
		<div className="flex justify-end gap-2">
			<button className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-500 hover:text-indigo-600 transition-colors" onClick={onEdit}>
				<HiOutlinePencil />
			</button>
			<button className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-slate-100 hover:text-red-600 text-slate-500 transition-colors" onClick={onDelete}>
				<HiOutlineTrash />
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
						<span className="font-semibold text-slate-700">{row.name}</span>
					</div>
				)
			},
		},
		{
			Header: 'Código',
			accessor: 'code',
			sortable: true,
			Cell: props => <span className="font-mono text-slate-500 text-xs">{props.value}</span>
		},
		{
			Header: 'Slug',
			accessor: 'slug',
			sortable: true,
			Cell: props => <span className="text-slate-400 italic text-sm">{props.value}</span>
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
		usePagination,
		useSortBy,
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
			<div className="overflow-x-auto min-h-[400px]">
				<Table {...getTableProps()}>
					<THead className="bg-slate-50 border-b border-slate-200">
						{headerGroups.map(headerGroup => (
							<Tr {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map(column => (
									<Th {...column.getHeaderProps(column.getSortByToggleProps())} className="text-xs uppercase font-bold text-slate-500 tracking-wider py-4 px-6">
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
								<Tr {...row.getRowProps()} className="hover:bg-slate-50 transition-colors h-16 border-b border-slate-100 last:border-0">
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
										<HiExclamation className='w-8 h-8' />
										<span className="text-sm">Sin resultados</span>
									</div>
								</Td>
							</Tr>
						)}
					</TBody>
				</Table>
			</div>

			<div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white">
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