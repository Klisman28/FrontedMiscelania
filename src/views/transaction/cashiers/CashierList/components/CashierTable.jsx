import React, { useEffect, useMemo, useState } from 'react'
import { Table, Pagination, Select, Input } from 'components/ui'
import { HiOutlinePencil, HiOutlineTrash, HiOutlineSearch, HiOutlineCalculator } from 'react-icons/hi'
import { FiPackage } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { getCashiers } from '../store/dataSlice'
import { toggleDeleteConfirmation, setDrawerOpen, setSelectedCashier, setActionForm } from '../store/stateSlice'
import CashierDeleteConfirmation from './CashierDeleteConfirmation'
import { CashierTableTools } from './CashierTableTools'
import CashierEditDialog from './CashierEditDialog'
import { useTable, usePagination, useSortBy, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table'
import { matchSorter } from 'match-sorter'
import Loading from 'components/shared/Loading'
import TableRowSkeleton from 'components/shared/loaders/TableRowSkeleton'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

function fuzzyTextFilterFn(rows, id, filterValue) {
	return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

fuzzyTextFilterFn.autoRemove = val => !val

function FilterInput({ globalFilter, setGlobalFilter }) {
	const [value, setValue] = useState(globalFilter)
	const onChange = useAsyncDebounce(value => {
		setGlobalFilter(value || undefined)
	}, 200)

	return (
		<Input
			className="h-11 min-w-[320px] rounded-xl"
			value={value || ""}
			onChange={e => {
				setValue(e.target.value)
				onChange(e.target.value)
			}}
			placeholder="Buscar cajas..."
			prefix={<HiOutlineSearch className="text-lg text-slate-400" />}
		/>
	)
}

const ActionColumn = ({ row }) => {
	const dispatch = useDispatch()

	const onEdit = () => {
		dispatch(setActionForm('edit'))
		dispatch(setDrawerOpen())
		dispatch(setSelectedCashier(row))
	}

	const onDelete = () => {
		dispatch(toggleDeleteConfirmation(true))
		dispatch(setSelectedCashier(row))
	}

	return (
		<div className="flex justify-start text-lg gap-1">
			<button className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-600" onClick={onEdit}>
				<HiOutlinePencil />
			</button>
			<button className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-slate-100 hover:text-red-600 transition-colors text-slate-600" onClick={onDelete}>
				<HiOutlineTrash />
			</button>
		</div>
	)
}

const NameColumn = ({ row }) => {
	const ICON_SIZE = 18

	return (
		<div className="flex items-center gap-3">
			<div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
				{row.img ? (
					<img src={row.img} alt={row.name} className="h-full w-full object-cover rounded-xl" />
				) : (
					<HiOutlineCalculator size={ICON_SIZE} className="text-slate-600" />
				)}
			</div>
			<span className="font-medium text-slate-900">
				{row.name}
			</span>
		</div>
	)
}

const CashierTable = () => {
	const dispatch = useDispatch()
	const { initialPageIndex, initialPageSize, total } = useSelector((state) => state.cashiers.data.tableData)
	const loading = useSelector((state) => state.cashiers.data.loading)
	const data = useSelector((state) => state.cashiers.data.cashierList)

	useEffect(() => {
		fetchData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialPageSize, initialPageSize])

	const fetchData = () => {
		dispatch(getCashiers())
	}

	const tableData = useMemo(() =>
		({ initialPageIndex, initialPageSize, total }),
		[initialPageIndex, initialPageSize, total])

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
			Header: 'Nombre Caja',
			accessor: 'name',
			sortable: true,
			Cell: props => <NameColumn row={props.row.original} />,
		},
		{
			Header: 'Código',
			accessor: 'code',
			sortable: true,
			Cell: props => (
				<span className="font-mono text-sm text-slate-600 tabular-nums">
					{props.value}
				</span>
			)
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

	const pageSizeOption = [5, 10, 25, 50].map(
		number => ({ value: number, label: `${number} / Pág.` })
	)

	return (
		<>
			<div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
				<div>
					<h1 className="text-2xl font-bold text-slate-900">Cajas</h1>
					<p className="text-slate-500 mt-1">Administra las cajas registradoras</p>
				</div>
				<div className="flex flex-col md:flex-row gap-3 items-center">
					<FilterInput
						globalFilter={globalFilter}
						setGlobalFilter={setGlobalFilter}
					/>
					<CashierTableTools />
				</div>
			</div>

			<div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
				<Loading loading={loading && data.length !== 0} type="cover">
					<Table {...getTableProps()}>
						<THead className="bg-slate-50 border-b border-slate-200">
							{headerGroups.map(headerGroup => (
								<Tr {...headerGroup.getHeaderGroupProps()}>
									{headerGroup.headers.map(column => (
										<Th {...column.getHeaderProps(column.getSortByToggleProps())} className="px-4 py-3 text-left">
											<div className="flex items-center">
												<span className="text-xs uppercase tracking-wide font-semibold text-slate-500">
													{column.render('Header')}
												</span>
												{column.sortable && (
													<span className="ml-1">
														<Sorter sort={column.isSortedDesc} />
													</span>
												)}
											</div>
										</Th>
									))}
								</Tr>
							))}
						</THead>
						{loading && data.length === 0 ? (
							<TableRowSkeleton
								columns={columns.length}
								rows={pageSize}
								avatarProps={{ className: 'rounded-md' }}
							/>
						) : (
							<TBody {...getTableBodyProps()}>
								{page.map((row) => {
									prepareRow(row)
									return (
										<Tr {...row.getRowProps()} className="hover:bg-slate-50 border-b border-slate-100 last:border-0 h-16">
											{row.cells.map(cell => (
												<Td {...cell.getCellProps()} className="px-4 align-middle">
													{cell.render('Cell')}
												</Td>
											))}
										</Tr>
									)
								})}
								{page.length === 0 && (
									<Tr>
										<Td className="text-center" colSpan={allColumns.length}>
											<div className='flex flex-col items-center justify-center space-y-3 py-10'>
												<div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
													<FiPackage className="text-2xl" />
												</div>
												<span className="text-slate-500 font-medium">No hay cajas registradas</span>
											</div>
										</Td>
									</Tr>
								)}
							</TBody>
						)}
					</Table>
					<div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-white">
						<Pagination
							pageSize={pageSize}
							currentPage={pageIndex + 1}
							total={rows.length}
							onChange={onPaginationChange}
						/>
						<div className="text-slate-500 text-sm hidden md:block">
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
							/>
						</div>
					</div>
				</Loading>
			</div>

			<CashierDeleteConfirmation />
			<CashierEditDialog />
		</>
	)
}

export default CashierTable