import React, { useState } from 'react'
import reducer from './store'
import { injectReducer } from 'store/index'
import { AdaptableCard } from 'components/shared'
import CategoryTable from './components/CategoryTable'
import { CategoryTableTools } from './components/CategoryTableTools'
import { useSelector } from 'react-redux'

injectReducer('categories', reducer)

const CategoryList = () => {
	const total = useSelector((state) => state.categories.data.tableData.total)
	const count = useSelector((state) => state.categories.data.categoryList).length
	const [globalFilter, setGlobalFilter] = useState('')

	return (
		<AdaptableCard className="h-full" bodyClass="h-full">
			{/* ── Header ── */}
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
				<div>
					<h3 className="text-xl font-bold text-gray-800 flex items-center gap-2.5">
						Categorías
						<span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full tabular-nums">
							{total || count}
						</span>
					</h3>
					<p className="text-gray-500 text-sm mt-1">Administra las agrupaciones de productos</p>
				</div>
				<CategoryTableTools globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
			</div>

			{/* ── Table ── */}
			<CategoryTable globalFilter={globalFilter} />
		</AdaptableCard>
	)
}

export default CategoryList