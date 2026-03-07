import React from 'react'
import { Button, Switcher, Tooltip } from 'components/ui'
import { HiDownload, HiPlusCircle, HiExclamationCircle, HiXCircle } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setFilters } from '../store/dataSlice'

const ProductTableTools = ({ onAdd }) => {
	const dispatch = useDispatch()
	const filters = useSelector((state) => state.productList.data.filters)

	const isInactive = filters.status === 'INACTIVE'
	const isArchived = filters.status === 'ARCHIVED'
	const stockLevel = filters.stockLevel || null

	const handleToggleInactive = () => {
		dispatch(setFilters({ status: isInactive ? 'ACTIVE' : 'INACTIVE', stockLevel: null }))
	}

	const handleToggleArchived = () => {
		dispatch(setFilters({ status: isArchived ? 'ACTIVE' : 'ARCHIVED', stockLevel: null }))
	}

	const handleStockFilter = (level) => {
		dispatch(setFilters({
			stockLevel: stockLevel === level ? null : level,
			status: 'ACTIVE',
		}))
	}

	return (
		<div className="flex flex-row items-center gap-3 flex-wrap">

			{/* ── Filter toggles ── */}
			<div className="flex items-center gap-4 mr-2">
				<Tooltip title="Mostrar productos descontinuados en el listado">
					<label className="flex items-center gap-2 cursor-pointer select-none">
						<Switcher
							checked={isInactive}
							onChange={handleToggleInactive}
							className="scale-[0.8]"
						/>
						<span className={`text-xs font-medium whitespace-nowrap transition-colors ${isInactive ? 'text-amber-600' : 'text-gray-400'}`}>
							Descontinuados
						</span>
					</label>
				</Tooltip>
				<Tooltip title="Mostrar productos archivados en el listado">
					<label className="flex items-center gap-2 cursor-pointer select-none">
						<Switcher
							checked={isArchived}
							onChange={handleToggleArchived}
							className="scale-[0.8]"
						/>
						<span className={`text-xs font-medium whitespace-nowrap transition-colors ${isArchived ? 'text-slate-600' : 'text-gray-400'}`}>
							Archivados
						</span>
					</label>
				</Tooltip>
			</div>

			{/* ── Stock level quick filters ── */}
			<div className="hidden sm:block w-px h-6 bg-gray-200" />
			<div className="flex items-center gap-1.5">
				<Tooltip title="Filtrar productos con stock bajo">
					<button
						type="button"
						onClick={() => handleStockFilter('low_stock')}
						className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all
							${stockLevel === 'low_stock'
								? 'bg-amber-100 text-amber-700 ring-1 ring-amber-300'
								: 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
							}`}
					>
						<HiExclamationCircle className="w-3.5 h-3.5" />
						Stock Bajo
					</button>
				</Tooltip>
				<Tooltip title="Filtrar productos agotados">
					<button
						type="button"
						onClick={() => handleStockFilter('out_of_stock')}
						className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all
							${stockLevel === 'out_of_stock'
								? 'bg-red-100 text-red-700 ring-1 ring-red-300'
								: 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
							}`}
					>
						<HiXCircle className="w-3.5 h-3.5" />
						Agotados
					</button>
				</Tooltip>
			</div>

			{/* ── Divider ── */}
			<div className="hidden sm:block w-px h-6 bg-gray-200" />

			<Link
				className="block lg:inline-block"
				to="/data/product-list.csv"
				target="_blank"
				download
			>
				<Button
					block
					size="md"
					className="flex items-center gap-2 h-10 rounded-xl"
					icon={<HiDownload className="text-lg" />}
				>
					Exportar
				</Button>
			</Link>
			<div className="block lg:inline-block">
				<Button
					block
					variant="solid"
					size="md"
					className="flex items-center gap-2 h-10 rounded-xl"
					icon={<HiPlusCircle className="text-lg" />}
					onClick={onAdd}
				>
					Nuevo Producto
				</Button>
			</div>

		</div>
	)
}

export { ProductTableTools }