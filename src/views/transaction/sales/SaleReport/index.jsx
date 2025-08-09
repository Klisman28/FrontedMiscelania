import React, { useEffect } from 'react'
import reducer from './store'
import { injectReducer } from 'store/index'
import { AdaptableCard } from 'components/shared'
import SaleTable from './components/SaleTable'

injectReducer('saleReport', reducer)

const SaleReport = () => {

	return (
		<AdaptableCard className="h-full" bodyClass="h-full">
			<SaleTable />
		</AdaptableCard>
	)
}

export default SaleReport