import React, { useEffect } from 'react'
import reducer from './store'
import { injectReducer } from 'store/index'
import { AdaptableCard, DoubleSidedImage } from 'components/shared'
import SaleTable from './components/SaleTable'
import isEmpty from 'lodash/isEmpty'
import { useSelector } from 'react-redux'
import { HiInformationCircle } from 'react-icons/hi'
import { useDispatch } from 'react-redux'
import { getOpeningCurrent } from './store/dataSlice'

injectReducer('saleList', reducer)

const SaleList = () => {

	const dispatch = useDispatch()

	const openingData = useSelector((state) => state.saleList.data.openingData)

	useEffect(() => {
		dispatch(getOpeningCurrent())
	}, [dispatch])

	return (
		<AdaptableCard className="h-full" bodyClass="h-full">
			{!isEmpty(openingData) ?
				<SaleTable openingId={openingData.id} />
				:
				<div className="h-full flex flex-col items-center">
					<h5 className="mt-8">No existe ninguna caja aperturada</h5>
					<div className='text-amber-500 flex justify-center my-2'>
						<HiInformationCircle className='w-6 h-6' />
						<span >
							Para iniciar a vender, primero debes aperturar una caja
						</span>
					</div>
					<DoubleSidedImage
						src="/img/others/img-2.png"
						darkModeSrc="/img/others/img-2-dark.png"
						alt="No product found!"
						className="w-40"
					/>
				</div>
			}
		</AdaptableCard>
	)
}

export default SaleList