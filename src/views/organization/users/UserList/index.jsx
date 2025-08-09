import React from 'react'
import reducer from './store'
import { injectReducer } from 'store/index'
import { AdaptableCard } from 'components/shared'
import UserTable from './components/UserTable'

injectReducer('userList', reducer)

const UserList = () => {
	return (
		<AdaptableCard className="h-full" bodyClass="h-full">
			<UserTable />
		</AdaptableCard>
	)
}

export default UserList