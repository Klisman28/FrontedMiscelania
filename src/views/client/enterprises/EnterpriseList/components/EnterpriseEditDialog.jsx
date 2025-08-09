import React, { useRef } from 'react'
import { Button, Drawer } from 'components/ui'
import EnterpriseEditContent from './EnterpriseEditContent'
import { useDispatch, useSelector } from 'react-redux'
import { setDrawerClose, setSelectedEnterprise } from '../store/stateSlice'

const DrawerFooter = ({onSaveClick, onCancel}) => {
	return (
		<div className="text-right w-full">
			<Button size="sm" className="mr-2" onClick={onCancel}>Cancelar</Button>
			<Button size="sm" variant="solid" onClick={onSaveClick}>Guardar</Button>
		</div>
	)
}

const EnterpriseEditDialog = () => {
	const dispatch = useDispatch()
	const drawerOpen = useSelector((state) => state.enterpriseList.state.drawerOpen)

	const onDrawerClose = () => {
		dispatch(setDrawerClose())
		dispatch(setSelectedEnterprise({}))
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
			<EnterpriseEditContent ref={formikRef} />
		</Drawer>
	)
}

export default EnterpriseEditDialog
