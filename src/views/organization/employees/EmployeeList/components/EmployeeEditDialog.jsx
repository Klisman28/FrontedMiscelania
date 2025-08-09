import React, { useRef } from 'react'
import { Button, Drawer } from 'components/ui'
import EmployeeEditContent from './EmployeeEditContent'
import { useDispatch, useSelector } from 'react-redux'
import { setDrawerClose, setSelectedEmployee } from '../store/stateSlice'

const DrawerFooter = ({onSaveClick, onCancel}) => {
	return (
		<div className="text-right w-full">
			<Button size="sm" className="mr-2" onClick={onCancel}>Cancelar</Button>
			<Button size="sm" variant="solid" onClick={onSaveClick}>Guardar</Button>
		</div>
	)
}

const EmployeeEditDialog = () => {
	const dispatch = useDispatch()
	const drawerOpen = useSelector((state) => state.employeeList.state.drawerOpen)

	const onDrawerClose = () => {
		dispatch(setDrawerClose())
		dispatch(setSelectedEmployee({}))
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
			<EmployeeEditContent ref={formikRef} />
		</Drawer>
	)
}

export default EmployeeEditDialog
