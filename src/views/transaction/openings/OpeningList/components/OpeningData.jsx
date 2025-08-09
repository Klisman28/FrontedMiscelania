import React from 'react'
import { Card, Button, Tag } from 'components/ui'
import { HiDesktopComputer, HiPlusCircle } from 'react-icons/hi'
import { TiLockClosed } from 'react-icons/ti'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { useDispatch } from 'react-redux'
import { toggleDeleteConfirmation } from '../store/stateSlice'
import OpeningStatistic from '../components/OpeningStatistics'

dayjs.locale("es");

const OpeningData = ({ data }) => {

	const dispatch = useDispatch()

	const handleCashierCut = async () => {
		dispatch(toggleDeleteConfirmation(true))
	}

	return (
		<>
			<Card className="mb-4" bordered>
				<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
					<div className="flex items-center gap-3">
						<HiDesktopComputer className='h-12 w-12 text-blue-600' />
						<div>
							<div className="flex items-center">
								<h6 >{data.cashier.name}</h6>
								<span className='text-sm ml-4'>#{data.cashier.code}</span>
								<Tag className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 rounded-md border-0 mx-2">
									<span className="capitalize">
										Aperturado
									</span>
								</Tag>
							</div>
							<div className=''>
								<div>
									Responsable:
									<span className='ml-2 text-gray-700 font-semibold dark:text-gray-100'>
										{data.employee.fullname}
									</span>
								</div>
								<div>
									Apertura:
									<span className='ml-2 text-gray-700 font-semibold dark:text-gray-100'>
										{dayjs(data.startDatetime).format('ddd DD MMM YYYY, hh:mm A')}
									</span>
								</div>
							</div>
						</div>
					</div>
					<div className="flex">
						<Button
							className="mr-2 mb-2"
							variant="solid"
							color="orange-600"
							icon={<TiLockClosed />}
							onClick={handleCashierCut}
						>
							{/* <TiLockClosed /> */}
							Hacer Corte de Caja
						</Button>
					</div>
				</div>
			</Card>
			<OpeningStatistic data={data} />
		</>
	)
}

export default OpeningData
