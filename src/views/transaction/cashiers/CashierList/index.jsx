import React from 'react'
import reducer from './store'
import { injectReducer } from 'store/index'

import CashierTable from './components/CashierTable'

injectReducer('cashiers', reducer)

const CashierList = () => {
	return (
		<div className="h-full">
			<CashierTable />
		</div>
	)
}

export default CashierList