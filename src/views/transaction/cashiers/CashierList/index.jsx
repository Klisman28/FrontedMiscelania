import React from 'react'
import reducer from './store'
import { injectReducer } from 'store/index'
import { AdaptableCard } from 'components/shared'
import CashierTable from './components/CashierTable'

injectReducer('cashiers', reducer)

const CashierList = () => {
	return (
		<AdaptableCard className="h-full" bodyClass="h-full">
			<CashierTable />
		</AdaptableCard>
	)
}

export default CashierList