import React, { useState, useEffect } from 'react'
import { Button, Input } from 'components/ui'
import { HiDownload, HiPlusCircle, HiOutlineSearch, HiXCircle } from 'react-icons/hi'
import { useDispatch } from 'react-redux'
import { setDrawerOpen } from '../store/stateSlice'

const CategoryTableTools = ({ globalFilter, setGlobalFilter }) => {
	const dispatch = useDispatch()
	const [localSearch, setLocalSearch] = useState(globalFilter || '')

	useEffect(() => {
		const timeout = setTimeout(() => setGlobalFilter(localSearch), 300)
		return () => clearTimeout(timeout)
	}, [localSearch, setGlobalFilter])

	return (
		<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
			<div className="relative w-full sm:w-72">
				<Input
					size="sm"
					className="w-full text-sm placeholder:text-slate-400 bg-white shadow-sm border-slate-200"
					placeholder="Buscar categorías..."
					prefix={<HiOutlineSearch className="text-lg text-slate-400 mr-1" />}
					value={localSearch}
					onChange={e => setLocalSearch(e.target.value)}
					suffix={
						localSearch && (
							<button onClick={() => setLocalSearch('')} className="text-slate-400 hover:text-slate-600 focus:outline-none">
								<HiXCircle className="text-lg" />
							</button>
						)
					}
				/>
			</div>

			<div className="flex items-center gap-3 w-full sm:w-auto">
				<Button
					size="sm"
					className="flex-1 sm:flex-none border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm transition-colors"
					icon={<HiDownload className="text-lg" />}
				>
					Exportar
				</Button>

				<Button
					size="sm"
					variant="solid"
					className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm border-transparent transition-colors"
					icon={<HiPlusCircle className="text-lg" />}
					onClick={() => dispatch(setDrawerOpen())}
				>
					Nueva
				</Button>
			</div>
		</div>
	)
}

export { CategoryTableTools }