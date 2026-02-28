import React from 'react'
import { Button, Select, Input } from 'components/ui'
import { HiDownload, HiPlusCircle, HiOutlineSearch } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setFilters } from '../store/dataSlice'
import dayjs from 'dayjs'

const statusOptions = [
	{ value: 'TODAS', label: 'Todas las ventas' },
	{ value: 'COMPLETADA', label: 'Completadas' },
	{ value: 'ANULADA', label: 'Anuladas' } // También Devueltas si quieres
]

const dateOptions = [
	{ value: 'ALL', label: 'Cualquier fecha' },
	{ value: 'TODAY', label: 'Hoy' },
	{ value: 'WEEK', label: '7 días recientes' },
	{ value: 'MONTH', label: 'Este mes' }
]

const SaleTableTools = () => {
	const dispatch = useDispatch()
	const filters = useSelector((state) => state.saleList.data.filters) || { search: '', status: 'TODAS', dateRange: 'ALL' }

	const onSearchChange = (e) => {
		dispatch(setFilters({ search: e.target.value }))
	}

	const onStatusChange = (option) => {
		dispatch(setFilters({ status: option.value }))
	}

	const onDateChange = (option) => {
		dispatch(setFilters({ dateRange: option.value }))
	}

	return (
		<div className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-4 w-full">
			{/* Buscador & Selects (Filtros) */}
			<div className="flex flex-col md:flex-row items-center gap-3 flex-1">
				<Input
					className="w-full md:w-[280px]"
					size="sm"
					placeholder="Buscar por cliente, total, etc..."
					prefix={<HiOutlineSearch className="text-lg" />}
					onChange={onSearchChange}
					value={filters.search}
				/>

				<div className="flex items-center gap-3 w-full md:w-auto">
					<Select
						size="sm"
						className="w-full md:w-[160px]"
						options={statusOptions}
						value={statusOptions.find(opt => opt.value === filters.status)}
						onChange={onStatusChange}
						isSearchable={false}
					/>
					<Select
						size="sm"
						className="w-full md:w-[160px]"
						options={dateOptions}
						value={dateOptions.find(opt => opt.value === filters.dateRange)}
						onChange={onDateChange}
						isSearchable={false}
					/>
				</div>
			</div>

			{/* Acciones principales */}
			<div className="flex items-center justify-end gap-3 w-full xl:w-auto">
				<Link className="block shrink-0" to="/data/product-list.csv" target="_blank" download>
					<Button size="sm" icon={<HiDownload />} className="bg-white">
						Exportar
					</Button>
				</Link>
				<Link to="/transacciones/nueva-venta" className="block shrink-0">
					<Button variant="solid" size="sm" icon={<HiPlusCircle />}>
						Nueva Venta
					</Button>
				</Link>
			</div>
		</div>
	)
}

export { SaleTableTools }