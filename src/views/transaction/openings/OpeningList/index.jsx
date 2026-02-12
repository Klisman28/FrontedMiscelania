import React, { useEffect } from 'react'
import reducer from './store'
import openingFormReducer from '../OpeningForm/store'
import { injectReducer } from 'store/index'
import { Card, Button, Tag, Alert } from 'components/ui'
import { HiDesktopComputer, HiInformationCircle } from 'react-icons/hi'
import { TiLockClosed } from 'react-icons/ti'
import { useSelector, useDispatch } from 'react-redux'
import { getOpeningCurrent, getOpeningSummary } from './store/dataSlice'
import { getCashiers } from '../OpeningForm/store/formSlice'
import isEmpty from 'lodash/isEmpty'
import dayjs from 'dayjs'
import 'dayjs/locale/es'

import OpeningFormCard from './components/OpeningFormCard'
import QuickActions from './components/QuickActions'
import RecentActivity from './components/RecentActivity'
import OpeningStatistic from './components/OpeningStatistics'
import OpeningEditConfirmation from './components/OpeningEditConfirmation'
import CashMovementModal from './components/cash/CashMovementModal'
import { toggleDeleteConfirmation } from './store/stateSlice'
import { useState } from 'react'

dayjs.locale('es')

injectReducer('openings', reducer)
injectReducer('openingForm', openingFormReducer)

const OpeningList = () => {
	const dispatch = useDispatch()
	const [isCashModalOpen, setIsCashModalOpen] = useState(false)

	const openingData = useSelector((state) => state.openings.data.openingData)
	const openingSummary = useSelector((state) => state.openings.data.openingSummary)
	const cashierList = useSelector((state) => state.openingForm?.data?.cashierList || [])

	const fetchData = () => {
		dispatch(getOpeningCurrent()).then((action) => {
			if (action.payload && action.payload.data && action.payload.data.id) {
				dispatch(getOpeningSummary(action.payload.data.id))
			}
		})
		dispatch(getCashiers())
	}

	useEffect(() => {
		fetchData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleCashierCut = () => {
		dispatch(toggleDeleteConfirmation(true))
	}

	const handleCashMovement = () => {
		setIsCashModalOpen(true)
	}

	const isOpeningActive = !isEmpty(openingData)

	// Extraer datos de ventas y movimientos para actividad reciente
	// Combinar sales y cashMovements si existen
	const sales = openingData.sales?.map(sale => ({
		id: `sale-${sale.id}`,
		type: 'sale',
		title: `Venta ${sale.serie ? `${sale.serie}-` : ''}${sale.number}`,
		description: `Cliente: ${sale.client?.label || 'Consumidor Final'}`,
		datetime: sale.createdAt || new Date(),
		amount: parseFloat(sale.total).toFixed(2)
	})) || []

	const movements = openingData.cashMovements?.map(mov => ({
		id: `mov-${mov.id}`,
		type: mov.type === 'CASH_IN' ? 'deposit' : 'withdrawal',
		title: mov.type === 'CASH_IN' ? 'Ingreso (Fondo)' : 'Retiro de Efectivo',
		description: mov.description,
		datetime: mov.createdAt || new Date(),
		amount: parseFloat(mov.amount).toFixed(2)
	})) || []

	// Combinar y ordenar
	const recentActivities = isOpeningActive
		? [...sales, ...movements]
			.sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
			.slice(0, 5)
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
					<QuickActions
						isOpeningActive={true}
						onCashMovementClick={handleCashMovement}
					/>

					{/* Actividad Reciente */}
					<RecentActivity
						activities={recentActivities}
						isOpeningActive={true}
					/>

					{/* KPIs / Estadísticas */}
					<div>
						<h5 className="mb-4">Resumen de Caja</h5>
						<OpeningStatistic data={openingData} summary={openingSummary} />
					</div>
				</div>
			)}

			{/* Modales */}
			<OpeningEditConfirmation />

			{isOpeningActive && (
				<CashMovementModal
					isOpen={isCashModalOpen}
					onClose={() => setIsCashModalOpen(false)}
					openingId={openingData.id}
				/>
			)}
		</div>
	)
}

export default OpeningList