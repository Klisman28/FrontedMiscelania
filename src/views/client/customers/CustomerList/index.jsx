import React from 'react'
import reducer from './store'
import { injectReducer } from 'store/index'
import { AdaptableCard } from 'components/shared'
import CustomerTable from './components/CustomerTable'

injectReducer('customerList', reducer)

const CustomerList = () => {
	return (
		<AdaptableCard className="h-full" bodyClass="h-full">
			<CustomerTable />
		</AdaptableCard>
	)
}

export default CustomerList