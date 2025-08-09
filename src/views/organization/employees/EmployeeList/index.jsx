import React from 'react'
import reducer from './store'
import { injectReducer } from 'store/index'
import { AdaptableCard } from 'components/shared'
import EmployeeTable from './components/EmployeeTable'

injectReducer('employeeList', reducer)

const EmployeeList = () => {
	return (
		<AdaptableCard className="h-full" bodyClass="h-full">
			<EmployeeTable />
		</AdaptableCard>
	)
}

export default EmployeeList