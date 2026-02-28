import React from 'react'
import { Button, Switcher, Tooltip } from 'components/ui'
import { HiDownload, HiPlusCircle } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setFilters } from '../store/dataSlice'

const ProductTableTools = ({ onAdd }) => {
	const dispatch = useDispatch()
	const filters = useSelector((state) => state.productList.data.filters)

	const isInactive = filters.status === 'INACTIVE'
	const isArchived = filters.status === 'ARCHIVED'

	const handleToggleInactive = () => {
		dispatch(setFilters({ status: isInactive ? 'ACTIVE' : 'INACTIVE' }))
	}

	const handleToggleArchived = () => {
		dispatch(setFilters({ status: isArchived ? 'ACTIVE' : 'ARCHIVED' }))
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