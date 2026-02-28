import React, { useRef } from 'react'
import { Button, Drawer } from 'components/ui'
import UserEditContent from './UserEditContent'
import { useDispatch, useSelector } from 'react-redux'
import { setDrawerClose, setSelectedUser } from '../store/stateSlice'
import { HiX, HiUser } from 'react-icons/hi'

const DrawerHeader = ({ user, onClose }) => {
	return (
		<div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
			<div className="flex items-start justify-between">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
						<HiUser className="text-indigo-600 text-xl" />
					</div>
					<div>
						<h2 className="text-lg font-bold text-gray-900">
							{user?.id ? 'Editar Usuario' : 'Nuevo Usuario'}
						</h2>
						<p className="text-sm text-gray-600 mt-0.5">
							{user?.id
								? `Modificar información y permisos de ${user.username}`
								: 'Crear una nueva cuenta de usuario'
							}
						</p>
					</div>
				</div>
				<button
					onClick={onClose}
					className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
				>
					<HiX className="text-xl text-gray-500" />
				</button>
			</div>
		</div>
	)
}

const DrawerFooter = ({ onSaveClick, onCancel }) => {
	return (
		<div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 px-6 py-4">
			<div className="flex items-center justify-end gap-3">
				<Button
					size="sm"
					className="min-w-[100px]"
					onClick={onCancel}
				>
					Cancelar
				</Button>
				<Button
					size="sm"
					variant="solid"
					className="min-w-[100px] bg-indigo-600 hover:bg-indigo-700"
					onClick={onSaveClick}
				>
					Guardar
				</Button>
			</div>
		</div>
	)
}

const UserEditDialog = () => {
	const dispatch = useDispatch()
	const drawerOpen = useSelector((state) => state.userList.state.drawerOpen)
	const selectedUser = useSelector((state) => state.userList.state.selectedUser)

	const onDrawerClose = () => {
		dispatch(setDrawerClose())
		dispatch(setSelectedUser({}))
	}

	const formikRef = useRef()

	const formSubmit = () => {
		console.log('🔘 Save button clicked')
		console.log('FormikRef:', formikRef.current)
		if (formikRef.current) {
			console.log('📝 Calling submitForm...')
			formikRef.current.submitForm()
		} else {
			console.error('❌ FormikRef is null!')
		}
	}

	return (
		<Drawer
			isOpen={drawerOpen}
			onClose={onDrawerClose}
			onRequestClose={onDrawerClose}
			closable={false}
			bodyClass="p-0"
			width={700}
			className="user-edit-drawer"
		>
			{/* Header */}
			<DrawerHeader user={selectedUser} onClose={onDrawerClose} />

			{/* Content - Scrollable */}
			<div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 160px)' }}>
				<UserEditContent ref={formikRef} />
			</div>

			{/* Footer */}
			<DrawerFooter onCancel={onDrawerClose} onSaveClick={formSubmit} />
		</Drawer>
	)
}

export default UserEditDialog
