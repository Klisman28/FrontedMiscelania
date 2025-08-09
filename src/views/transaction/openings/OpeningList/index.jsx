import React, { useEffect } from 'react'
import reducer from './store'
import { injectReducer } from 'store/index'
import { AdaptableCard } from 'components/shared'
import OpeningData from './components/OpeningData'
import OpeningTools from './components/OpeningTools'
import { useSelector, useDispatch } from 'react-redux'
import { getOpeningCurrent } from './store/dataSlice'
import isEmpty from 'lodash/isEmpty'
import OpeningNewDialog from './components/OpeningNewDialog'
import OpeningEditConfirmation from './components/OpeningEditConfirmation'

injectReducer('openings', reducer)

const OpeningList = () => {
	const dispatch = useDispatch()

	const openingData = useSelector((state) => state.openings.data.openingData)

	const fetchData = () => {
		dispatch(getOpeningCurrent())
	}

	useEffect(() => {
		fetchData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<AdaptableCard className="h-full" bodyClass="h-full">
			<div className="mb-4">
				<div className="flex items-center mb-2">
					<h3>
						{isEmpty(openingData)
							? <span>Apertura de Caja</span>
							: <span>#{openingData.cashier.name}</span>
						}
					</h3>
				</div>
			</div>
			{isEmpty(openingData)
				? <OpeningTools />
				: <>
					<OpeningData data={openingData} />
				</>
			}
			<OpeningNewDialog />
			<OpeningEditConfirmation />
		</AdaptableCard>
	)
}

export default OpeningList