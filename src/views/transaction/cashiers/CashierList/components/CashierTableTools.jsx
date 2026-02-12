import React from 'react'
import { Button } from 'components/ui'
import { HiPlusCircle } from 'react-icons/hi'
import { useDispatch } from 'react-redux'
import { setDrawerOpen, setActionForm } from '../store/stateSlice'

const CashierTableTools = () => {

	const dispatch = useDispatch();

	const onAdd = () => {
		dispatch(setActionForm('create'))
		dispatch(setDrawerOpen())
	}

	return (
		<Button
			block
			variant="solid"
			className="h-11"
			icon={<HiPlusCircle />}
			onClick={onAdd}
		>
			Nueva Caja
		</Button>
	)

}

export { CashierTableTools }