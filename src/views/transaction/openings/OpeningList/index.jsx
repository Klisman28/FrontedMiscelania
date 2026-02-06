import React, { useEffect } from 'react'
import reducer from './store'
import { injectReducer } from 'store/index'
import { Card, Button, Tag, Alert } from 'components/ui'
import { HiDesktopComputer, HiInformationCircle } from 'react-icons/hi'
import { TiLockClosed } from 'react-icons/ti'
import { useSelector, useDispatch } from 'react-redux'
import { getOpeningCurrent } from './store/dataSlice'
import { getCashiersAvailable } from '../OpeningForm/store/formSlice'
import isEmpty from 'lodash/isEmpty'
import dayjs from 'dayjs'
import 'dayjs/locale/es'

import OpeningFormCard from './components/OpeningFormCard'
import QuickActions from './components/QuickActions'
import RecentActivity from './components/RecentActivity'
import OpeningStatistic from './components/OpeningStatistics'
import OpeningEditConfirmation from './components/OpeningEditConfirmation'
import { toggleDeleteConfirmation } from './store/stateSlice'

dayjs.locale('es')

injectReducer('openings', reducer)

const OpeningList = () => {
	const dispatch = useDispatch()

	const openingData = useSelector((state) => state.openings.data.openingData)
	const cashierList = useSelector((state) => state.openingForm?.data?.cashierList || [])

	const fetchData = () => {
		dispatch(getOpeningCurrent())
		dispatch(getCashiersAvailable())
	}

	useEffect(() => {
		fetchData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleCashierCut = () => {
		dispatch(toggleDeleteConfirmation(true))
	}

	const isOpeningActive = !isEmpty(openingData)

	// Extraer datos de ventas para actividad reciente
	const recentActivities = isOpeningActive && openingData.sales?.length > 0
		? openingData.sales.slice(0, 5).map(sale => ({
			id: sale.id,
			type: 'sale',
			title: `Venta ${sale.serie ? `${sale.serie}-` : ''}${sale.number}`,
			description: `Cliente: ${sale.client?.label || 'Consumidor Final'}`,
			datetime: sale.createdAt || new Date(),
			amount: parseFloat(sale.total).toFixed(2)
		}))
		: []

	return (
		<div className="h-full">
			{/* Header de Sesión */}
			<div className="mb-6">
				<Card className="border-l-4 border-l-indigo-600">
					<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
						<div className="flex items-center gap-4">
							<div className="p-3 rounded-full bg-indigo-50 dark:bg-indigo-900/30">
								<HiDesktopComputer className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
							</div>
							<div>
								<div className="flex items-center gap-3 mb-1">
									<h3 className="mb-0">
										{isOpeningActive
											? openingData.cashier.name
											: 'Apertura de Caja'}
									</h3>
									{isOpeningActive && (
										<>
											<span className="text-sm text-gray-500 dark:text-gray-400">
												#{openingData.cashier.code}
											</span>
											<Tag className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 rounded-md border-0">
												<span className="capitalize font-semibold">
													Aperturado
												</span>
											</Tag>
										</>
									)}
								</div>
								{isOpeningActive ? (
									<div className="space-y-0.5 text-sm">
										<div>
											<span className="text-gray-500 dark:text-gray-400">Responsable:</span>{' '}
											<span className="font-semibold text-gray-700 dark:text-gray-100">
												{openingData.employee.fullname}
											</span>
										</div>
										<div>
											<span className="text-gray-500 dark:text-gray-400">Apertura:</span>{' '}
											<span className="font-semibold text-gray-700 dark:text-gray-100">
												{dayjs(openingData.startDatetime).format('ddd DD MMM YYYY, hh:mm A')}
											</span>
										</div>
									</div>
								) : (
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Para iniciar a vender, primero debes aperturar una caja
									</p>
								)}
							</div>
						</div>

						{/* Botón principal */}
						{isOpeningActive && (
							<div className="flex">
								<Button
									variant="solid"
									color="orange-600"
									size="lg"
									icon={<TiLockClosed />}
									onClick={handleCashierCut}
								>
									Corte Rápido
								</Button>
							</div>
						)}
					</div>
				</Card>
			</div>

			{/* Layout Principal */}
			{!isOpeningActive ? (
				// Vista sin apertura: Formulario + Ayuda
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Formulario de apertura */}
					<div className="lg:col-span-1">
						<OpeningFormCard cashiers={cashierList} />
					</div>

					{/* Panel de información y ayuda */}
					<div className="lg:col-span-2 space-y-6">
						<Alert
							showIcon
							type="info"
							customIcon={<HiInformationCircle />}
							className="border-blue-200 dark:border-blue-700"
						>
							<div>
								<h6 className="mb-2">¿Cómo funciona la apertura de caja?</h6>
								<ul className="text-sm space-y-1 list-disc list-inside">
									<li>Selecciona la caja que vas a utilizar</li>
									<li>Ingresa el saldo inicial (efectivo disponible)</li>
									<li>Presiona "Empezar" o usa <kbd className="px-1 py-0.5 text-xs bg-gray-200 rounded dark:bg-gray-700">Ctrl+Enter</kbd></li>
									<li>Podrás registrar ventas hasta que hagas el corte de caja</li>
								</ul>
							</div>
						</Alert>

						{/* Acciones rápidas deshabilitadas */}
						<QuickActions isOpeningActive={false} />
					</div>
				</div>
			) : (
				// Vista con apertura: Acciones + Actividad + KPIs
				<div className="space-y-6">
					{/* Acciones Rápidas */}
					<QuickActions isOpeningActive={true} />

					{/* Actividad Reciente */}
					<RecentActivity
						activities={recentActivities}
						isOpeningActive={true}
					/>

					{/* KPIs / Estadísticas */}
					<div>
						<h5 className="mb-4">Resumen de Caja</h5>
						<OpeningStatistic data={openingData} />
					</div>
				</div>
			)}

			{/* Modales */}
			<OpeningEditConfirmation />
		</div>
	)
}

export default OpeningList