import React from 'react'
import reducer from './store'
import { injectReducer } from 'store/index'
import { AdaptableCard } from 'components/shared'
import SupplierTable from './components/SupplierTable'

injectReducer('supplierList', reducer)

const SupplierList = () => {
	return (
		<AdaptableCard className="h-full" bodyClass="h-full">
			<SupplierTable />
		</AdaptableCard>
	)
}

export default SupplierList