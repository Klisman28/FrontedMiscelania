import React, { useEffect } from 'react'
import reducer from './store'
import { injectReducer } from 'store/index'
import SaleTable from './components/SaleTable'

injectReducer('saleReport', reducer)

const SaleReport = () => {
	return (
		<div className="h-full">
			<SaleTable />
		</div>
	)
}

export default SaleReport