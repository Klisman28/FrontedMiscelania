import React from 'react'
import reducer from './store'
import { injectReducer } from 'store/index'
import { AdaptableCard } from 'components/shared'
import UserTable from './components/UserTable'

import { useSelector } from 'react-redux'
import { Button } from 'components/ui'

injectReducer('userList', reducer)

const UserList = () => {
	const activeCompanyId = useSelector((state) => state.auth.user.activeCompanyId)

	if (!activeCompanyId) {
		return (
			<div className="h-full flex flex-col items-center justify-center p-6 text-center">
				<h2 className="text-2xl font-bold text-gray-800 mb-2">Modo Super Admin Global</h2>
				<p className="text-gray-500 mb-6 max-w-lg">
					Para administrar usuarios del sistema punto de venta, primero debes seleccionar una empresa para operar.
					Los usuarios globales se administran en la sección SaaS Admin.
				</p>
				<Button
					variant="solid"
					onClick={() => window.location.href = '/saas/companies'}
				>
					Ir al Administrador SaaS
				</Button>
			</div>
		)
	}

	return (
		<AdaptableCard className="h-full" bodyClass="h-full">
			<UserTable />
		</AdaptableCard>
	)
}

export default UserList