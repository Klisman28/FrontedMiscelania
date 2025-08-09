import React from 'react'
import reducer from './store'
import { injectReducer } from 'store/index'
import { AdaptableCard } from 'components/shared'
import PurchasTable from './components/PurchasTable'

injectReducer('purchasList', reducer)

const PurchasList = () => {
	return (
		<AdaptableCard className="h-full" bodyClass="h-full">
			<PurchasTable />
		</AdaptableCard>
	)
}

export default PurchasList