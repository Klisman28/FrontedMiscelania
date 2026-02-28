import React, { useEffect, useMemo } from 'react'
import { Badge } from 'components/ui'
import { DataTableSimple } from 'components/shared'
import { useDispatch, useSelector } from 'react-redux'
import { getSalesOpening, getSales } from '../store/dataSlice'
import CancelSaleModal from './CancelSaleModal'
import { SaleTableTools } from './SaleTableTools'
import SaleShowDialog from './SaleShowDialog'
import SaleRowActions from './SaleRowActions'
import { formatGTQ } from 'utils/money'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

// Extend dayjs
dayjs.extend(isBetween)

const inventoryTypeColor = {
	'Ticket': { label: 'Ticket', dotClass: 'bg-emerald-500', textClass: 'text-emerald-500' },
	'Boleta': { label: 'Boleta', dotClass: 'bg-amber-500', textClass: 'text-amber-500' },
	'Factura': { label: 'Factura', dotClass: 'bg-blue-500', textClass: 'text-blue-500' },
}

const statusColor = {
	COMPLETADA: { label: 'COMPLETADA', bgClass: 'bg-emerald-100/50', textClass: 'text-emerald-700', ringClass: 'ring-emerald-600/20' },
	ANULADA: { label: 'ANULADA', bgClass: 'bg-red-50', textClass: 'text-red-700', ringClass: 'ring-red-600/20' },
	DEVUELTA: { label: 'DEVUELTA', bgClass: 'bg-blue-50', textClass: 'text-blue-600', ringClass: 'ring-blue-600/20' },
}

const getSaleStatus = (row) => {
	if (row.deletedAt || row.status === 3) return 'ANULADA'
	if (row.status === 2) return 'DEVUELTA'
	return 'COMPLETADA'
}

const StatusColumn = ({ status }) => {
	const config = statusColor[status] || statusColor.COMPLETADA
	return (
		<span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wide ring-1 ${config.bgClass} ${config.textClass} ${config.ringClass}`}>
			{config.label}
		</span>
	)
}

const MainColumn = ({ row }) => {
	return (
		<div className="flex flex-col">
			<span className="font-bold text-slate-800 dark:text-gray-100">
				{row.id ? `#${row.id.toString().padStart(6, '0')}` : '-'}
			</span>
			<span className="text-xs text-slate-500 mt-0.5">
				{row.dateIssue ? dayjs(row.createdAt || row.dateIssue).format('DD MMM YYYY, hh:mm A') : '-'}
			</span>
		</div>
	)
}

const ClientColumn = ({ row }) => {
	return (
		<div className="flex items-center">
			{row.type !== 'Ticket' ? (
				row.type === 'Boleta' ? (
					<span className="font-semibold text-slate-700 dark:text-gray-200">
						{row.customer?.fullname || 'CF'}
					</span>
				) : (
					<span className="font-semibold text-slate-700 dark:text-gray-200">
						{row.enterprise?.name || 'CF'}
					</span>
				)
			) : (
				<span className="text-slate-400 dark:text-gray-400 italic">Consumidor Final</span>
			)}
		</div>
	)
}

const CurrencyColumn = ({ value }) => {
	return (
		<span className="font-bold text-slate-800 dark:text-gray-100 text-base">
			{formatGTQ(value)}
		</span>
	)
}

const filterData = (data, filters) => {
	if (!data || !data.length) return []

	const filtered = data.filter(row => {
		// 1. Status Filter
		const status = getSaleStatus(row)
		if (filters.status !== 'TODAS' && status !== filters.status) {
			return false
		}

		// 2. Search Filter
		if (filters.search) {
			const s = filters.search.toLowerCase()
			const clientName = (row.customer?.fullname || row.enterprise?.name || 'CF').toLowerCase()
			const saleIdStr = row.id?.toString() || ''
			const matchSearch = saleIdStr.includes(s) || clientName.includes(s) || row.total?.toString().includes(s)
			if (!matchSearch) return false
		}

		// 3. Date Filter
		if (filters.dateRange !== 'ALL' && row.dateIssue) {
			const saleDate = dayjs(row.dateIssue, 'YYYY-MM-DD')
			if (!saleDate.isValid()) return true

			const today = dayjs()
			if (filters.dateRange === 'TODAY' && !saleDate.isSame(today, 'day')) {
				return false
			}
			if (filters.dateRange === 'WEEK' && !saleDate.isAfter(today.subtract(7, 'day').startOf('day'))) {
				return false
			}
			if (filters.dateRange === 'MONTH' && !saleDate.isSame(today, 'month')) {
				return false
			}
		}

		return true
	})

	return filtered.sort((a, b) => (b.id || 0) - (a.id || 0))
}

const SaleTable = ({ openingId }) => {
	const dispatch = useDispatch()
	const { initialPageIndex, initialPageSize } = useSelector((state) => state.saleList.data.tableData)
	const loading = useSelector((state) => state.saleList.data.loading)
	const rawData = useSelector((state) => state.saleList.data.saleList) || []
	const filters = useSelector((state) => state.saleList.data.filters) || { search: '', status: 'TODAS', dateRange: 'ALL' }

	useEffect(() => {
		if (openingId !== undefined) {
			dispatch(getSalesOpening(openingId))
		} else {
			dispatch(getSales())
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [openingId])

	// Frontend Filtering Data List
	const data = useMemo(() => filterData(rawData, filters), [rawData, filters])
	const total = data.length

	const tableData = useMemo(() =>
		({ initialPageIndex, initialPageSize, total }),
		[initialPageIndex, initialPageSize, total]
	)

	const columns = useMemo(() => [
		{
			Header: 'Documento',
			accessor: 'dateIssue',
			sortable: true,
			Cell: props => <MainColumn row={props.row.original} />
		},
		{
			Header: 'Cliente',
			accessor: 'saleableId',
			sortable: false,
			Cell: props => <ClientColumn row={props.row.original} />
		},
		{
			Header: 'Comprobante',
			accessor: 'type',
			sortable: true,
			Cell: props => {
				const { type } = props.row.original
				if (!inventoryTypeColor[type]) return <span className="text-gray-500">-</span>
				return (
					<div className="flex items-center gap-1.5">
						<Badge className={inventoryTypeColor[type].dotClass} />
						<span className={`capitalize font-semibold text-xs ${inventoryTypeColor[type].textClass}`}>
							{inventoryTypeColor[type].label}
						</span>
					</div>
				)
			},
		},
		{
			Header: 'Estado',
			accessor: 'status',
			sortable: true,
			Cell: props => {
				const status = getSaleStatus(props.row.original)
				return <StatusColumn status={status} />
			}
		},
		{
			Header: 'Total',
			accessor: 'total',
			sortable: true,
			Cell: props => <CurrencyColumn value={props.row.original.total} />
		},
		{
			Header: 'Acciones',
			id: 'action',
			accessor: (row) => row,
			Cell: props => <SaleRowActions row={props.row.original} />
		}
	], [])

	return (
		<>
			<DataTableSimple
				columns={columns}
				data={data}
				skeletonAvatarColumns={[0]}
				skeletonAvatarProps={{ className: 'rounded-md' }}
				loading={loading}
				pagingData={tableData}
				tableTools={<SaleTableTools />}
				title="Ventas"
			/>
			<CancelSaleModal />
			<SaleShowDialog />
		</>
	)
}

export default SaleTable