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
		<div className="flex flex-col md:flex-row md:justify-between lg:items-center">
			{/* <ProductTableSearch /> */}
			{/* <ProductFilter /> */}
			<div className="block lg:inline-block mb-4 md:mb-0 md:ml-2" >
				<Button
					block
					variant="solid"
					size="sm"
					icon={<HiPlusCircle />}
					onClick={onAdd}
				>
					Nueva Caja
				</Button>
			</div>

		</div>
	)
}

export { CashierTableTools }