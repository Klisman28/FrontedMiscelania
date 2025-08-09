import React from 'react'
import reducer from './store'
import { injectReducer } from 'store/index'
import { AdaptableCard } from 'components/shared'
import CategoryTable from './components/CategoryTable'

injectReducer('categories', reducer)

const CategoryList = () => {
	return (
		<AdaptableCard className="h-full" bodyClass="h-full">
			<CategoryTable />
		</AdaptableCard>
	)
}

export default CategoryList