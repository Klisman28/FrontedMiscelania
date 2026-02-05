import React, { useEffect, useMemo, useState } from 'react'
import { Table, Pagination, Select, Input, Button, Avatar } from 'components/ui'
import { useTable, usePagination, useSortBy, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table'
import { HiOutlinePencil, HiOutlineTrash, HiOutlineSearch, HiPlusCircle, HiExclamation, HiDownload } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux'
import { getSuppliers } from '../store/dataSlice'
import { toggleDeleteConfirmation, setDrawerOpen, setSelectedSupplier, setActionForm } from '../store/stateSlice'
import { Link } from 'react-router-dom'
import SupplierDeleteConfirmation from './SupplierDeleteConfirmation'
import SupplierEditDialog from './SupplierEditDialog'
import { matchSorter } from 'match-sorter'

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
			placeholder="Buscar proveedores..."
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
		dispatch(setSelectedSupplier(row))
	}

	const onDelete = () => {
		dispatch(toggleDeleteConfirmation(true))
		dispatch(setSelectedSupplier(row))
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

const SupplierTable = () => {
	const dispatch = useDispatch()
	const { initialPageIndex, initialPageSize, total } = useSelector((state) => state.supplierList.data.tableData)
	const data = useSelector((state) => state.supplierList.data.supplierList)

	useEffect(() => {
		dispatch(getSuppliers())
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
			Header: 'Empresa',
			accessor: 'name',
			sortable: true,
			Cell: props => (
				<div className="flex items-center">
					<Avatar size={32} shape="circle" className="mr-3 bg-amber-100 text-amber-600 font-bold">
						{props.value ? props.value.charAt(0).toUpperCase() : 'P'}
					</Avatar>
					<span className="font-semibold text-slate-900">{props.value}</span>
				</div>
			),
		},
		{
			Header: 'NIT',
			accessor: 'ruc',
			sortable: true,
			Cell: props => <span className="text-slate-600 font-medium tabular-nums">{props.value}</span>
		},
		{
			Header: 'Sitio',
			accessor: 'website',
			sortable: true,
			Cell: props => props.value ? <a href={props.value} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{props.value}</a> : <span className="text-slate-400">-</span>
		},
		{
			Header: 'Email',
			accessor: 'email',
			sortable: true,
			Cell: props => props.value ? <a href={`mailto:${props.value}`} className="text-slate-600 hover:text-indigo-600 truncate block max-w-[150px]" title={props.value}>{props.value}</a> : <span className="text-slate-400">-</span>
		},
		{
			Header: 'Teléfono',
			accessor: 'telephone',
			sortable: true,
			Cell: props => <span className="tabular-nums">{props.value}</span>
		},
		{
			Header: 'Dirección',
			accessor: 'address',
			sortable: true,
			Cell: props => <span className="truncate max-w-[200px] block" title={props.value}>{props.value}</span>
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
			{/* Header */}
			<div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
				<div>
					<h3 className="text-xl font-bold text-slate-900 tracking-tight">Proveedores</h3>
					<p className="text-slate-500 text-sm mt-1">Administra empresas proveedoras y su contacto</p>
				</div>
				<div className="flex flex-col md:flex-row gap-3 items-center">
					<FilterInput globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
					<Link
						className="block w-full md:w-auto"
						to="/data/product-list.csv"
						target="_blank"
						download
					>
						<Button
							size="md"
							className="rounded-xl h-11 w-full font-medium"
							icon={<HiDownload className="text-lg" />}
						>
							Exportar
						</Button>
					</Link>
					<Button
						variant="solid"
						size="md"
						className="rounded-xl h-11 w-full md:w-auto px-6 font-semibold shadow-lg shadow-indigo-500/20"
						icon={<HiPlusCircle className="text-lg" />}
						onClick={onAdd}
					>
						Nuevo Proveedor
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
											return <Td {...cell.getCellProps()} className="px-6 py-4 text-sm text-slate-700">{cell.render('Cell')}</Td>
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

			<SupplierDeleteConfirmation />
			<SupplierEditDialog />
		</div>
	)
}

export default SupplierTable