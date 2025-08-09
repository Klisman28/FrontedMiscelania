import React, { useRef } from 'react'
import { Button, Drawer } from 'components/ui'
import CashierEditContent from './CashierEditContent'
import { useDispatch, useSelector } from 'react-redux'
import { setDrawerClose, setSelectedCashier } from '../store/stateSlice'

const DrawerFooter = ({onSaveClick, onCancel}) => {
	return (
		<div className="text-right w-full">
			<Button size="sm" className="mr-2" onClick={onCancel}>Cancelar</Button>
			<Button size="sm" variant="solid" onClick={onSaveClick}>Guardar</Button>
		</div>
	)
}

const CashierEditDialog = () => {
	const dispatch = useDispatch()
	const drawerOpen = useSelector((state) => state.cashiers.state.drawerOpen)

	const onDrawerClose = () => {
		dispatch(setDrawerClose())
		dispatch(setSelectedCashier({}))
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
			<CashierEditContent ref={formikRef} />
		</Drawer>
	)
}

export default CashierEditDialog
