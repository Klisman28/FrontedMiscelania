import React from 'react'
import reducer from './store'
import { injectReducer } from 'store/index'
import { AdaptableCard } from 'components/shared'
import EnterpriseTable from './components/EnterpriseTable'

injectReducer('enterpriseList', reducer)

const EnterpriseList = () => {
	return (
		<AdaptableCard className="h-full" bodyClass="h-full">
			<EnterpriseTable />
		</AdaptableCard>
	)
}

export default EnterpriseList