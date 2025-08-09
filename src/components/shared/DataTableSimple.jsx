import React, { useMemo, useState } from 'react'
import { Table, Pagination, Select, Input } from 'components/ui'
import { useTable, usePagination, useSortBy, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table'
import PropTypes from 'prop-types'
import Loading from './Loading'
import TableRowSkeleton from './loaders/TableRowSkeleton'
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
			className="w-full lg:w-52 mb-2 lg:mb-0"
			size="sm"
			value={value || ""}
			onChange={e => {
				setValue(e.target.value)
				onChange(e.target.value)
			}}
			// style={{ maxWidth: 180 }}
			placeholder="Buscar Categorías..."
			prefix={<HiOutlineSearch className="text-lg" />}
		/>
	)
}

function fuzzyTextFilterFn(rows, id, filterValue) {
	return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val

const DataTableSimple = props => {

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
		// Add a new fuzzyTextFilterFn filter type.
		fuzzyText: fuzzyTextFilterFn,
		// Or, override the default text filter to use
		// "startWith"
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
		// preGlobalFilteredRows,
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
		useFilters, // useFilters!
		useGlobalFilter, // useGlobalFilter!
		useSortBy,
		usePagination,
	)

	// const firstPageRows = page.slice(0, 10)

	const onPaginationChange = page => {
		gotoPage(page - 1)
	}

	const onSelectChange = value => {
		setPageSize(Number(value))
	}

	return (
		<>
			<div className='flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4'>
				<h3 className='mb-2 lg:mb-0'>{ title }</h3>
				<div className="lg:flex items-center justify-between">
					<FilterInput
						globalFilter={globalFilter}
						setGlobalFilter={setGlobalFilter}
					/>
					{ tableTools }
					
				</div>
			</div>
			<Loading loading={loading && data.length !== 0} type="cover">
				<Table {...getTableProps()}>
					<THead>
						{headerGroups.map(headerGroup => (
							<Tr {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map(column => (
									column.sortable ? (
										<Th {...column.getHeaderProps(column.getSortByToggleProps())}>
											{column.render('Header')}
											<span className='cursor-default'>
												<Sorter sort={column.isSortedDesc} />
											</span>
										</Th>
									) : (
										<Th {...column.getHeaderProps()}>
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
											<Tr {...row.getRowProps()}>
												{row.cells.map(cell => {
													return <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>
												})}
											</Tr>
										)
									})}
									{page.length === 0 && (
										<Tr>
											<Td className="text-center" colSpan={allColumns.length}>
												<div className='flex items-center justify-center space-x-2'>
													<HiExclamation className='text-orange-600 w-5 h-5' />
													No se encontró ningún registro
												</div>
											</Td>
										</Tr>
									)}
								</TBody>
							)
					}
				</Table>
				<div className="flex items-center justify-between mt-4">
					<Pagination
						pageSize={pageSize}
						currentPage={pageIndex + 1}
						total={rows.length}
						onChange={onPaginationChange}
					/>
					<div>
						<span>
							{/* Mostrando de {(pageIndex * pageSize) + 1 } hasta {((pageIndex + 1) * pageSize)} del Total de {rows.length} */}
							Total registros {rows.length}
						</span>
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

DataTableSimple.propTypes = {
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

DataTableSimple.defaultProps = {
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

export default DataTableSimple