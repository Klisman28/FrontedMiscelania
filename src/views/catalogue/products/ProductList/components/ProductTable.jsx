import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Avatar, toast, Notification } from 'components/ui'
import ProductDataTable from './ProductDataTable'
import { HiOutlinePencil, HiOutlineTrash, HiDotsVertical, HiOutlineBan, HiOutlineRefresh, HiOutlineArchive } from 'react-icons/hi'
import { FiPackage } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts, updateProductStatus } from '../store/dataSlice'
import { toggleDeleteConfirmation, setSelectedProduct } from '../store/stateSlice'
import ProductDeleteConfirmation from './ProductDeleteConfirmation'
import { ProductTableTools } from './ProductTableTools'

// ── Status config ──
const productStatusConfig = {
	ACTIVE: {
		label: 'Activo',
		dotClass: 'bg-emerald-500',
		bgClass: 'bg-emerald-50',
		textClass: 'text-emerald-700',
		ringClass: 'ring-emerald-600/20',
	},
	INACTIVE: {
		label: 'Descontinuado',
		dotClass: 'bg-amber-500',
		bgClass: 'bg-amber-50',
		textClass: 'text-amber-700',
		ringClass: 'ring-amber-600/20',
	},
	ARCHIVED: {
		label: 'Archivado',
		dotClass: 'bg-slate-400',
		bgClass: 'bg-slate-50',
		textClass: 'text-slate-600',
		ringClass: 'ring-slate-400/20',
	},
}

const getStockBadge = (stock, stockMin) => {
	if (stock === 0) {
		return { label: `0`, className: 'bg-red-100 text-red-600' }
	}
	if (stock < stockMin) {
		return { label: ` (${stock}/${stockMin})`, className: 'bg-amber-100 text-amber-600' }
	}
	return { label: ` (${stock}/${stockMin})`, className: 'bg-emerald-100 text-emerald-600' }
}

// ── Product column ──
const CategoryColumn = ({ row }) => {
	const status = row.status || 'ACTIVE'
	const isInactive = status !== 'ACTIVE'
	const avatar = row.imageUrl ?
		<Avatar src={row.imageUrl} className={`rounded-lg h-10 w-10 shadow-sm border border-gray-100 ${isInactive ? 'opacity-50 grayscale' : ''}`} /> :
		<Avatar icon={<FiPackage />} className={`rounded-lg h-10 w-10 bg-gray-100 text-gray-400 ${isInactive ? 'opacity-50' : ''}`} />
	return (
		<div className="flex items-center gap-3">
			<div className="flex-shrink-0 w-10 h-10">{avatar}</div>
			<div className="flex flex-col">
				<div className="flex items-center gap-1.5">
					<span className={`font-semibold line-clamp-1 ${isInactive ? 'text-gray-400' : 'text-gray-900'}`} title={row.name}>
						{row.name}
					</span>
					{isInactive && (
						<span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ring-1 ${productStatusConfig[status]?.bgClass} ${productStatusConfig[status]?.textClass} ${productStatusConfig[status]?.ringClass}`}>
							{productStatusConfig[status]?.label}
						</span>
					)}
				</div>
				<span className="text-xs text-gray-400 font-medium">{row.sku}</span>
			</div>
		</div>
	)
}

// ══════════════════════════════════════════════════════════════════
// Portal Dropdown Menu — renders at document.body level so table
// overflow/sticky cells never clip it.
// ══════════════════════════════════════════════════════════════════
const PortalMenu = ({ anchorRef, open, onClose, children }) => {
	const menuRef = useRef(null)
	const [pos, setPos] = useState({ top: 0, left: 0 })

	// Position relative to anchor
	useEffect(() => {
		if (!open || !anchorRef.current) return
		const rect = anchorRef.current.getBoundingClientRect()
		const menuW = 208 // w-52
		let left = rect.right - menuW
		let top = rect.bottom + 4

		// Prevent off-screen right
		if (left < 8) left = 8
		// Prevent off-screen bottom → flip above
		if (top + 260 > window.innerHeight) {
			top = rect.top - 4 // will be adjusted by transform
		}
		setPos({ top, left })
	}, [open, anchorRef])

	// Click outside
	useEffect(() => {
		if (!open) return
		const handler = (e) => {
			if (menuRef.current && !menuRef.current.contains(e.target) &&
				anchorRef.current && !anchorRef.current.contains(e.target)) {
				onClose()
			}
		}
		document.addEventListener('mousedown', handler, true)
		return () => document.removeEventListener('mousedown', handler, true)
	}, [open, onClose, anchorRef])

	// ESC key
	useEffect(() => {
		if (!open) return
		const handler = (e) => { if (e.key === 'Escape') onClose() }
		document.addEventListener('keydown', handler, true)
		return () => document.removeEventListener('keydown', handler, true)
	}, [open, onClose])

	if (!open) return null

	return createPortal(
		<div
			ref={menuRef}
			className="fixed z-[9999] w-52 py-1.5 rounded-lg shadow-xl bg-white ring-1 ring-black/5 animate-in fade-in"
			style={{
				top: pos.top,
				left: pos.left,
				animation: 'portalMenuIn 120ms ease-out',
			}}
			role="menu"
		>
			{children}
		</div>,
		document.body
	)
}

// Single menu item
const MenuItem = ({ icon, label, onClick, className = '', danger = false }) => (
	<button
		type="button"
		role="menuitem"
		onClick={onClick}
		className={`
			w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium
			transition-colors outline-none
			${danger
				? 'text-red-500 hover:bg-red-50 hover:text-red-600'
				: className || 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
			}
		`}
	>
		{icon}
		{label}
	</button>
)

const MenuDivider = () => <div className="my-1 border-t border-slate-100" />

// ── Row Actions ──
const ActionColumn = ({ row, onEdit }) => {
	const dispatch = useDispatch()
	const [statusLoading, setStatusLoading] = useState(false)
	const [menuOpen, setMenuOpen] = useState(false)
	const triggerRef = useRef(null)
	const status = row.status || 'ACTIVE'

	const closeMenu = useCallback(() => setMenuOpen(false), [])

	const onEditClick = () => { closeMenu(); onEdit(row) }

	const onDelete = () => {
		closeMenu()
		dispatch(toggleDeleteConfirmation(true))
		dispatch(setSelectedProduct(row))
	}

	const handleStatusChange = async (newStatus) => {
		closeMenu()
		setStatusLoading(true)
		try {
			await dispatch(updateProductStatus({ id: row.id, status: newStatus, reason: '' })).unwrap()
			const label = productStatusConfig[newStatus]?.label || newStatus
			toast.push(
				<Notification title="Estado actualizado" type="success" duration={3000}>
					"{row.name}" ahora está <b>{label}</b>
				</Notification>,
				{ placement: 'top-center' }
			)
			dispatch(getProducts())
		} catch (err) {
			const errMsg = err?.message || 'Error al cambiar estado'
			toast.push(
				<Notification title="Error" type="danger" duration={4000}>{errMsg}</Notification>,
				{ placement: 'top-center' }
			)
		} finally {
			setStatusLoading(false)
		}
	}

	return (
		<div className="flex justify-end">
			<button
				ref={triggerRef}
				type="button"
				className={`
					p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/40
					${statusLoading
						? 'text-indigo-500 bg-indigo-50 pointer-events-none'
						: 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
					}
				`}
				aria-label={`Acciones para ${row.name}`}
				aria-haspopup="true"
				aria-expanded={menuOpen}
				disabled={statusLoading}
				onClick={() => setMenuOpen(prev => !prev)}
			>
				{statusLoading
					? <span className="block h-5 w-5 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin" />
					: <HiDotsVertical className="text-lg" />
				}
			</button>

			<PortalMenu anchorRef={triggerRef} open={menuOpen} onClose={closeMenu}>
				<MenuItem icon={<HiOutlinePencil className="text-lg text-slate-400" />} label="Editar" onClick={onEditClick} />

				{status === 'ACTIVE' && (
					<MenuItem icon={<HiOutlineBan className="text-lg" />} label="Descontinuar" onClick={() => handleStatusChange('INACTIVE')} className="text-amber-600 hover:bg-amber-50" />
				)}
				{(status === 'INACTIVE' || status === 'ARCHIVED') && (
					<MenuItem icon={<HiOutlineRefresh className="text-lg" />} label="Reactivar" onClick={() => handleStatusChange('ACTIVE')} className="text-emerald-600 hover:bg-emerald-50" />
				)}
				{(status === 'ACTIVE' || status === 'INACTIVE') && (
					<MenuItem icon={<HiOutlineArchive className="text-lg" />} label="Archivar" onClick={() => handleStatusChange('ARCHIVED')} className="text-slate-500 hover:bg-slate-50" />
				)}

				<MenuDivider />
				<MenuItem icon={<HiOutlineTrash className="text-lg" />} label="Eliminar" onClick={onDelete} danger />
			</PortalMenu>
		</div>
	)
}


// ── Main table component ──
const ProductTable = ({ onEdit, onAdd }) => {

	const dispatch = useDispatch()
	const { initialPageIndex, initialPageSize, total } = useSelector((state) => state.productList.data.tableData)
	const loading = useSelector((state) => state.productList.data.loading)
	const data = useSelector((state) => state.productList.data.productList)
	const filters = useSelector((state) => state.productList.data.filters)

	useEffect(() => {
		dispatch(getProducts())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filters.status])

	const tableData = useMemo(() =>
		({ initialPageIndex, initialPageSize, total }),
		[initialPageIndex, initialPageSize, total])

	const columns = useMemo(() => [
		{
			Header: 'Producto',
			accessor: 'name',
			sortable: true,
			Cell: props => {
				const row = props.row.original
				return <CategoryColumn row={row} />
			},
		},
		{
			Header: 'SKU',
			accessor: 'sku',
			Cell: props => <span className="text-gray-600 font-medium tabular-nums">{props.value}</span>
		},
		{
			Header: 'Descripción',
			accessor: 'description',
			Cell: props => {
				const { description } = props.row.original
				return (
					<div className="text-xs text-gray-500 max-w-xs truncate" title={description}>{description}</div>
				)
			}
		},
		{
			Header: 'Marca',
			accessor: 'brand.name',
			Cell: props => <span className="text-gray-700 font-medium">{props.value}</span>
		},
		{
			Header: 'Subcategoría',
			accessor: 'subcategory.name',
			Cell: props => <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
				{props.value}
			</span>
		},
		{
			Header: 'Costo',
			accessor: 'cost',
			alignRight: true,
			Cell: props => {
				const { cost } = props.row.original
				return (
					<div className='flex items-center justify-end font-medium text-gray-700 tabular-nums'>
						<span className='text-xs text-gray-400 mr-1'>Q</span>{parseFloat(cost).toFixed(2)}
					</div>
				)
			}
		},
		{
			Header: 'Ganancia',
			accessor: 'utility',
			alignRight: true,
			Cell: props => {
				const { utility } = props.row.original
				return (
					<div className='flex items-center justify-end font-medium text-gray-700 tabular-nums'>
						<span className='text-xs text-gray-400 mr-1'>Q</span>{parseFloat(utility).toFixed(2)}
					</div>
				)
			}
		},
		{
			Header: 'Precio',
			accessor: 'price',
			alignRight: true,
			Cell: props => {
				const { price } = props.row.original
				return (
					<div className='flex items-center justify-end font-bold text-gray-900 tabular-nums'>
						<span className='text-xs text-gray-400 mr-1'>Q</span>{parseFloat(price).toFixed(2)}
					</div>
				)
			}
		},
		{
			Header: 'Stock',
			accessor: 'stock',
			alignRight: true,
			Cell: (props) => {
				const { stock, stockMin } = props.row.original
				const stockBadge = getStockBadge(stock, stockMin)
				return (
					<div className="flex justify-end">
						<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${stockBadge.className}`}>
							{stockBadge.label}
						</span>
					</div>
				)
			},
		},
		{
			Header: 'Estado',
			accessor: 'status',
			sortable: true,
			Cell: (props) => {
				const status = props.row.original.status || 'ACTIVE'
				const config = productStatusConfig[status] || productStatusConfig.ACTIVE
				return (
					<div className="flex items-center">
						<span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ring-1 ${config.bgClass} ${config.textClass} ${config.ringClass}`}>
							<span className={`h-1.5 w-1.5 rounded-full ${config.dotClass}`}></span>
							{config.label}
						</span>
					</div>
				)
			},
		},
		{
			Header: 'Vencimiento',
			accessor: 'expirationDate',
			Cell: (props) => {
				const { expirationDate, hasExpiration } = props.row.original
				if (!hasExpiration) return <span className="text-gray-300 text-center block">-</span>

				const dateValue = new Date(expirationDate)
				const today = new Date()
				today.setHours(0, 0, 0, 0)
				const isExpired = dateValue < today

				const baseClasses = 'px-2 py-1 rounded-md text-xs font-semibold whitespace-nowrap'
				const expiredClasses = 'text-red-700 bg-red-50 ring-1 ring-red-600/20'
				const validClasses = 'text-gray-600 bg-gray-50'

				return (
					<span className={`${baseClasses} ${isExpired ? expiredClasses : validClasses}`}>
						{expirationDate}
					</span>
				)
			}
		},
		{
			Header: 'Acciones',
			id: 'action',
			accessor: (row) => row,
			Cell: props => <ActionColumn row={props.row.original} onEdit={onEdit} />
		}
	], [onEdit])

	return (
		<div className="h-full">
			<ProductDataTable
				columns={columns}
				data={data}
				skeletonAvatarColumns={[0]}
				skeletonAvatarProps={{ className: 'rounded-md' }}
				loading={loading}
				pagingData={tableData}
				tableTools={<ProductTableTools onAdd={onAdd} />}
				title="Productos"
			/>
			<ProductDeleteConfirmation />
		</div>
	)
}

export default ProductTable