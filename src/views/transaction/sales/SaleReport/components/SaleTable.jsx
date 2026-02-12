import React, { useEffect, useMemo, useState } from 'react'
import { Badge, Table, Pagination, Select, Input } from 'components/ui'
import { HiOutlineEye, HiOutlineTrash, HiOutlinePrinter, HiOutlineSearch, HiExclamation } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux'
import { getSales } from '../store/dataSlice'
import { toggleDeleteConfirmation, setSelectedSale, setShowDialogOpen } from '../store/stateSlice'
import useThemeClass from 'utils/hooks/useThemeClass'
import SaleDeleteConfirmation from './SaleDeleteConfirmation'
import { SaleTableTools } from './SaleTableTools'
import SaleShowDialog from './SaleShowDialog'
import { useNavigate } from 'react-router-dom'
import { NumericFormat } from 'react-number-format'
import { useTable, usePagination, useSortBy, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table'
import { matchSorter } from 'match-sorter'
import Loading from 'components/shared/Loading'
import TableRowSkeleton from 'components/shared/loaders/TableRowSkeleton'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

const inventoryTypeColor = {
	'Ticket': { label: 'Ticket', dotClass: 'bg-emerald-500', badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
	'Boleta': { label: 'Boleta', dotClass: 'bg-amber-500', badgeClass: 'bg-amber-50 text-amber-700 border border-amber-100' },
	'Factura': { label: 'Factura', dotClass: 'bg-blue-500', badgeClass: 'bg-blue-50 text-blue-700 border border-blue-100' },
}

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
			placeholder="Buscar ventas..."
			prefix={<HiOutlineSearch className="text-lg text-slate-400" />}
		/>
	)
}

const ActionColumn = ({ row }) => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	// Removed user of textTheme to strictly follow requested design (slate-100 hover)

	const onEdit = () => {
		dispatch(setSelectedSale(row))
		dispatch(setShowDialogOpen(true))
	}

	const onDelete = () => {
		dispatch(toggleDeleteConfirmation(true))
		dispatch(setSelectedSale(row))
	}

	const onPrint = () => {
		navigate(`/transacciones/ventas/${row.id}/imprimir`)
	}

	return (
		<div className="flex justify-start text-lg gap-1">
			<button className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-600" onClick={onEdit}>
				<HiOutlineEye />
			</button>
			<button className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-600" onClick={onPrint}>
				<HiOutlinePrinter />
			</button>
			<button className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-slate-100 hover:text-red-600 transition-colors text-slate-600" onClick={onDelete}>
				<HiOutlineTrash />
			</button>
		</div>
	)
}

const SaleTable = () => {
	const dispatch = useDispatch()
	const { initialPageIndex, initialPageSize, total } = useSelector((state) => state.saleReport.data.tableData)
	const loading = useSelector((state) => state.saleReport.data.loading)
	const data = useSelector((state) => state.saleReport.data.saleList)

	useEffect(() => {
		fetchSales()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialPageSize, initialPageSize])

	const fetchSales = () => {
		dispatch(getSales())
	}

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
			Header: 'Fecha',
			accessor: 'dataIssue',
			sortable: true,
			Cell: props => (
				<span className="font-medium text-slate-700">
					{props.row.original.dateIssue}
				</span>
			),
		},
		{
			Header: 'Total',
			accessor: 'total',
			sortable: true,
			Cell: props => (
				<div className="text-right font-semibold text-slate-900 tabular-nums">
					<NumericFormat
						displayType="text"
						value={(Math.round(props.row.original.total * 100) / 100).toFixed(2)}
						prefix={'Q '}
						thousandSeparator={true}
					/>
				</div>
			),
			headerClassName: 'text-right justify-end' // Assuming Table component supports this or we handle in render
		},
		{
			Header: 'SAT',
			accessor: 'igv',
			sortable: true,
			Cell: props => (
				<div className="text-right text-slate-600 tabular-nums">
					<NumericFormat
						displayType="text"
						value={(Math.round(props.row.original.igv * 100) / 100).toFixed(2)}
						prefix={'Q '}
						thousandSeparator={true}
					/>
				</div>
			),
		},
		{
			Header: 'Cliente',
			accessor: 'saleableId',
			sortable: false,
			Cell: props => {
				const row = props.row.original
				const isTicket = row.type === 'Ticket'
				const isBoleta = row.type === 'Boleta'
				let display = 'N/A'

				if (!isTicket) {
					display = isBoleta ? (row.customer?.fullname || 'CF') : (row.enterprise?.name || 'CF')
				}

				return (
					<span className={isTicket ? "text-slate-400" : "text-slate-700"}>
						{display}
					</span>
				)
			}
		},
		{
			Header: 'Tipo',
			accessor: 'type', // Match original accessor
			sortable: true,
			Cell: props => {
				const { type } = props.row.original
				const config = inventoryTypeColor[type] || inventoryTypeColor['Ticket']
				return (
					<span className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-semibold ${config.badgeClass}`}>
						<span className={`w-2 h-2 rounded-full ${config.dotClass}`}></span>
						{config.label}
					</span>
				)
			},
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
					<h1 className="text-2xl font-bold text-slate-900">Historial de Ventas</h1>
					<p className="text-slate-500 mt-1">Consulta y administra tickets</p>
				</div>
				<div className="flex flex-col md:flex-row gap-3 items-center">
					<FilterInput
						globalFilter={globalFilter}
						setGlobalFilter={setGlobalFilter}
					/>
					<SaleTableTools />
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
											<div className={`flex items-center ${column.id === 'total' || column.id === 'igv' ? 'justify-end' : ''}`}>
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
										<Tr {...row.getRowProps()} className="hover:bg-slate-50 border-b border-slate-100 last:border-0 h-14">
											{row.cells.map(cell => (
												<Td {...cell.getCellProps()} className="px-4">
													{cell.render('Cell')}
												</Td>
											))}
										</Tr>
									)
								})}
								{page.length === 0 && (
									<Tr>
										<Td className="text-center" colSpan={allColumns.length}>
											<div className='flex items-center justify-center space-x-2 py-8'>
												<HiExclamation className='text-orange-600 w-5 h-5' />
												<span className="text-slate-500">No se encontró ningún registro</span>
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
						<div className="text-slate-500 text-sm">
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

			<SaleDeleteConfirmation />
			<SaleShowDialog />
		</>
	)
}

export default SaleTable