import React, { useRef } from 'react'
import { Button, Drawer } from 'components/ui'
import UserEditContent from './UserEditContent'
import { useDispatch, useSelector } from 'react-redux'
import { setDrawerClose, setSelectedUser } from '../store/stateSlice'

const DrawerFooter = ({onSaveClick, onCancel}) => {
	return (
		<div className="text-right w-full">
			<Button size="sm" className="mr-2" onClick={onCancel}>Cancelar</Button>
			<Button size="sm" variant="solid" onClick={onSaveClick}>Guardar</Button>
		</div>
	)
}

const UserEditDialog = () => {
	const dispatch = useDispatch()
	const drawerOpen = useSelector((state) => state.userList.state.drawerOpen)

	const onDrawerClose = () => {
		dispatch(setDrawerClose())
		dispatch(setSelectedUser({}))
	}

	const formikRef = useRef()

	const formSubmit = () => {
		formikRef.current?.submitForm()
	}

	return (
		<Drawer
			isOpen={drawerOpen}
			onClose={onDrawerClose}
			onRequestClose={onDrawerClose}
			closable={false}
			bodyClass="p-0"
			footer={<DrawerFooter onCancel={onDrawerClose} onSaveClick={formSubmit} />}
		>
			<UserEditContent ref={formikRef} />
		</Drawer>
	)
}

export default UserEditDialog
