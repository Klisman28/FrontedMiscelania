import React, { useRef } from 'react'
import { Button, Drawer } from 'components/ui'
import CustomerEditContent from './CustomerEditContent'
import { useDispatch, useSelector } from 'react-redux'
import { setDrawerClose, setSelectedCustomer } from '../store/stateSlice'
import { HiX, HiUserGroup } from 'react-icons/hi'

const DrawerHeader = ({ customer, onClose }) => {
	const isNew = !customer?.id

	return (
		<div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
			<div className="flex items-start justify-between">
				<div className="flex items-center gap-3">
					<div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isNew ? 'bg-emerald-100' : 'bg-blue-100'}`}>
						<HiUserGroup className={`text-xl ${isNew ? 'text-emerald-600' : 'text-blue-600'}`} />
					</div>
					<div>
						<h2 className="text-lg font-bold text-gray-900">
							{isNew ? 'Nuevo Cliente' : 'Editar Cliente'}
						</h2>
						<p className="text-sm text-gray-600 mt-0.5">
							{isNew
								? 'Registrar un nuevo cliente en el sistema'
								: `Modificar datos de ${customer.name || customer.firstName}`
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
					className="min-w-[100px]"
					onClick={onSaveClick}
				>
					Guardar
				</Button>
			</div>
		</div>
	)
}

const CustomerEditDialog = () => {
	const dispatch = useDispatch()
	const drawerOpen = useSelector((state) => state.customerList.state.drawerOpen)
	const selectedCustomer = useSelector((state) => state.customerList.state.selectedCustomer)

	const onDrawerClose = () => {
		dispatch(setDrawerClose())
		dispatch(setSelectedCustomer({}))
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
			width={700}
			className="customer-edit-drawer"
		>
			<DrawerHeader customer={selectedCustomer} onClose={onDrawerClose} />

			<div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 160px)' }}>
				<CustomerEditContent ref={formikRef} />
			</div>

			<DrawerFooter onCancel={onDrawerClose} onSaveClick={formSubmit} />
		</Drawer>
	)
}

export default CustomerEditDialog
