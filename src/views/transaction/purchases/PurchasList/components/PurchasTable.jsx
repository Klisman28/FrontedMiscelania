import React, { useEffect, useMemo, useState } from 'react'
import { Avatar, Badge, Table, Pagination, Input, Button, Select } from 'components/ui'
import { HiOutlineEye, HiOutlineTrash, HiOutlineSearch, HiPlusCircle, HiExclamation } from 'react-icons/hi'
import { FiPackage } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { getPurchases } from '../store/dataSlice'
import { toggleDeleteConfirmation, setSelectedPurchas, setShowDialogOpen } from '../store/stateSlice'
import useThemeClass from 'utils/hooks/useThemeClass'
import PurchasDeleteConfirmation from './PurchasDeleteConfirmation'
import PurchasShowDialog from './PurchasShowDialog'
import { NumericFormat } from 'react-number-format'
import { useTable, usePagination, useSortBy, useGlobalFilter, useAsyncDebounce } from 'react-table'
import { matchSorter } from 'match-sorter'
import { Link } from 'react-router-dom'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

// --- Filter Logic ---
function fuzzyTextFilterFn(rows, id, filterValue) {
	return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}
fuzzyTextFilterFn.autoRemove = val => !val

// --- Components ---

const ActionColumn = ({ row }) => {
	const dispatch = useDispatch()
	const { textTheme } = useThemeClass()

	const onEdit = () => {
		dispatch(setSelectedPurchas(row))
		dispatch(setShowDialogOpen(true))
	}

	const onDelete = () => {
		dispatch(toggleDeleteConfirmation(true))
		dispatch(setSelectedPurchas(row))
	}

	return (
		<div className="flex justify-end gap-2">
			<button
				className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-500 hover:text-indigo-600 transition-colors"
				onClick={onEdit}
			>
				<HiOutlineEye className="text-lg" />
			</button>
			<button
				className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-500 hover:text-red-600 transition-colors"
				onClick={onDelete}
			>
				<HiOutlineTrash className="text-lg" />
			</button>
		</div>
	)
}

const CurrencyColumn = ({ value, isTotal }) => {
	return (
		<div className="text-right">
			<NumericFormat
				displayType="text"
				value={(Math.round(value * 100) / 100).toFixed(2)}
				prefix={'S/ '}
				thousandSeparator={true}
				className={`tabular-nums ${isTotal ? 'font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors' : 'text-slate-600'}`}
			/>
		</div>
	)
}

const PurchasTable = () => {
	const dispatch = useDispatch()
	const { initialPageIndex, initialPageSize } = useSelector((state) => state.purchasList.data.tableData)
	const loading = useSelector((state) => state.purchasList.data.loading)
	const rawData = useSelector((state) => state.purchasList.data.purchasList)

	useEffect(() => {
		dispatch(getPurchases())
	}, [dispatch])

	const data = useMemo(() => rawData || [], [rawData])

	const columns = useMemo(() => [
		{
			Header: 'Fecha',
			accessor: 'dateIssue', // Corrected accessor from 'dataIssue' in prev file? No, prev code had 'dataIssue' but mapped from 'row.dateIssue'. Let's check api response if possible, but prev code: accessor: 'dataIssue', Cell: row.dateIssue. Accessor string should ideally match data key, but here we use Cell.
			// CAUTION: The previous code had accessor 'dataIssue' but the component used `row.dateIssue`.
			// I will use 'dateIssue' as accessor if that's the data key. 
			// If I look at MainColumn in prev code: `{row.dateIssue}`.
			// So I will use 'dateIssue'.
			accessor: 'dateIssue',
			sortable: true,
			Cell: props => <span className="font-medium text-slate-700">{props.value}</span>
		},
		{
			Header: 'Total',
			accessor: 'total',
			sortable: true,
			Cell: props => <CurrencyColumn value={props.value} isTotal />
		},
		{
			Header: 'SAT',
			accessor: 'igv',
			sortable: true,
			Cell: props => <CurrencyColumn value={props.value} />
		},
		{
			Header: 'Proveedor',
			accessor: 'supplier.name',
			sortable: true,
			Cell: props => <span className="font-medium text-slate-700">{props.value}</span>
		},
		{
			Header: 'Acciones',
			id: 'action',
			accessor: (row) => row,
			Cell: props => <ActionColumn row={props.row.original} />
		}
	], [])

	// --- Search State ---
	const [globalFilter, setGlobalFilter] = useState('')

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
		gotoPage,
		setPageSize,
		state: { pageIndex, pageSize },
		setGlobalFilter: setTableGlobalFilter,
		rows
	} = useTable(
		{
			columns,
			data,
			initialState: { pageIndex: initialPageIndex || 0, pageSize: initialPageSize || 10 },
			manualPagination: false, // Client side
			filterTypes,
		},
		useGlobalFilter,
		useSortBy,
		usePagination,
	)

	// Sync input with table filter
	const onSearchChange = useAsyncDebounce(value => {
		setTableGlobalFilter(value || undefined)
	}, 200)

	const handleSearch = (e) => {
		setGlobalFilter(e.target.value)
		onSearchChange(e.target.value)
	}

	const onPaginationChange = page => {
		gotoPage(page - 1)
	}

	const onSelectChange = value => {
		setPageSize(Number(value))
	}

	const pageSizeOption = [5, 10, 25, 50, 100].map(
		number => ({ value: number, label: `${number} / Pág.` })
	)

	return (
		<div className="flex flex-col gap-6">
			{/* 1) HEADER */}
			<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
				<div className="flex flex-col gap-1">
					<h1 className="text-2xl font-bold text-slate-900 tracking-tight">Compras</h1>
					<p className="text-slate-500 text-sm">Historial de compras y proveedores</p>
				</div>
				<div className="flex flex-col sm:flex-row gap-3 items-center w-full md:w-auto">
					<Input
						className="w-full sm:w-80"
						size="md"
						placeholder="Buscar compras..."
						prefix={<HiOutlineSearch className="text-lg text-slate-400" />}
						value={globalFilter}
						onChange={handleSearch}
						inputClass="rounded-xl h-11 bg-white border-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
					/>
					<Link to="registrar" className="w-full sm:w-auto">
						<Button
							variant="solid"
							size="md"
							className="w-full sm:w-auto rounded-xl h-11 px-6 font-semibold shadow-sm shadow-indigo-200 whitespace-nowrap"
							icon={<HiPlusCircle className="text-lg" />}
						>
							Nueva Compra
						</Button>
					</Link>
				</div>
			</div>

			{/* 2) CARD CONTENEDOR */}
			<div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
				<div className="overflow-x-auto">
					<Table {...getTableProps()} className="w-full">
						<THead className="bg-slate-50 border-b border-slate-200">
							{headerGroups.map(headerGroup => (
								<Tr {...headerGroup.getHeaderGroupProps()}>
									{headerGroup.headers.map(column => (
										<Th
											{...column.getHeaderProps(column.getSortByToggleProps())}
											className={`
                                                text-xs uppercase font-bold text-slate-500 tracking-wide py-4 px-6
                                                ${column.id === 'total' || column.id === 'igv' ? 'text-right' : 'text-left'}
                                            `}
										>
											<div className={`flex items-center gap-1 cursor-pointer hover:text-slate-700 transition-colors ${column.id === 'total' || column.id === 'igv' ? 'justify-end' : ''}`}>
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
								return (
									<Tr
										{...row.getRowProps()}
										className="hover:bg-slate-50 transition-colors h-16 border-b border-slate-100 last:border-0 group"
									>
										{row.cells.map(cell => {
											return (
												<Td {...cell.getCellProps()} className="px-6 py-4">
													{cell.render('Cell')}
												</Td>
											)
										})}
									</Tr>
								)
							})}
							{page.length === 0 && (
								<Tr>
									<Td className="text-center py-16" colSpan={columns.length}>
										<div className='flex flex-col items-center justify-center space-y-3 text-slate-400'>
											<div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
												<HiExclamation className='w-6 h-6 opacity-30' />
											</div>
											<span className="text-sm font-medium">No se encontraron compras</span>
										</div>
									</Td>
								</Tr>
							)}
						</TBody>
					</Table>
				</div>

				{/* 6) FOOTER / PAGINACIÓN */}
				<div className="flex flex-col md:flex-row items-center justify-between px-6 py-4 border-t border-slate-200 bg-white gap-4">
					<Pagination
						pageSize={pageSize}
						currentPage={pageIndex + 1}
						total={rows.length}
						onChange={onPaginationChange}
					/>

					<div className="text-slate-500 text-sm font-medium">
						Total registros <span className="text-slate-900 font-bold">{rows.length}</span>
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
			</div>

			<PurchasDeleteConfirmation />
			<PurchasShowDialog />
		</div>
	)
}

export default PurchasTable