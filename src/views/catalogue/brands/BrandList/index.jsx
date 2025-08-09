import React from 'react'
import reducer from './store'
import { injectReducer } from 'store/index'
import { AdaptableCard } from 'components/shared'
import BrandTable from './components/BrandTable'

injectReducer('brands', reducer)

const BrandList = () => {
	return (
		<AdaptableCard className="h-full" bodyClass="h-full">
			<BrandTable />
		</AdaptableCard>
	)
}

export default BrandList