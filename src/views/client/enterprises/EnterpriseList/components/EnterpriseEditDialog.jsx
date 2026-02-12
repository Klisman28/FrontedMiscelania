import React, { useRef } from 'react'
import { Button, Drawer } from 'components/ui'
import EnterpriseEditContent from './EnterpriseEditContent'
import { useDispatch, useSelector } from 'react-redux'
import { setDrawerClose, setSelectedEnterprise } from '../store/stateSlice'
import { HiX, HiOfficeBuilding } from 'react-icons/hi'

const DrawerHeader = ({ enterprise, onClose }) => {
	return (
		<div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
			<div className="flex items-start justify-between">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
						<HiOfficeBuilding className="text-indigo-600 text-xl" />
					</div>
					<div>
						<h2 className="text-lg font-bold text-gray-900">
							{enterprise?.id ? 'Editar Empresa' : 'Nueva Empresa'}
						</h2>
						<p className="text-sm text-gray-600 mt-0.5">
							{enterprise?.id
								? `Modificar información de ${enterprise.name}`
								: 'Registrar una nueva empresa en el sistema'
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

const EnterpriseEditDialog = () => {
	const dispatch = useDispatch()
	const drawerOpen = useSelector((state) => state.enterpriseList.state.drawerOpen)
	const selectedEnterprise = useSelector((state) => state.enterpriseList.state.selectedEnterprise)

	const onDrawerClose = () => {
		dispatch(setDrawerClose())
		dispatch(setSelectedEnterprise({}))
	}

	const formikRef = useRef()

	const formSubmit = () => {
		if (formikRef.current) {
			formikRef.current.submitForm()
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
			className="enterprise-edit-drawer"
		>
			<DrawerHeader enterprise={selectedEnterprise} onClose={onDrawerClose} />

			<div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 160px)' }}>
				<EnterpriseEditContent ref={formikRef} />
			</div>

			<DrawerFooter onCancel={onDrawerClose} onSaveClick={formSubmit} />
		</Drawer>
	)
}

export default EnterpriseEditDialog
