import React from 'react'
import reducer from './store'
import { injectReducer } from 'store/index'
import { AdaptableCard } from 'components/shared'
import SubcategoryTable from './components/SubcategoryTable'

injectReducer('subcategories', reducer)

const SubcategoryList = () => {
	return (
		<AdaptableCard className="h-full" bodyClass="h-full">
			<SubcategoryTable />
		</AdaptableCard>
	)
}

export default SubcategoryList