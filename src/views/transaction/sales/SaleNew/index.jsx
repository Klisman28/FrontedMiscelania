import React, { useEffect } from 'react'
import SaleForm from '../SaleForm'
import { toastError } from 'utils/toast'
import toast from 'react-hot-toast'
import { DoubleSidedImage } from 'components/shared'
import { useNavigate } from 'react-router-dom'
import { postSale } from './store/newSlice'
import { injectReducer } from 'store/index'
import reducer from './store'
import { useDispatch, useSelector } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import { getOpeningCurrent } from './store/newSlice'
import { HiInformationCircle, HiOutlineShoppingCart, HiOutlineCube } from 'react-icons/hi'
import { setSideNavCollapse } from 'store/theme/themeSlice'

injectReducer('saleNew', reducer)

const SaleNew = () => {

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const openingData = useSelector((state) => state.saleNew.data.openingData)

	// Auto-collapse sidebar
	useEffect(() => {
		dispatch(setSideNavCollapse(true))
		return () => {
			dispatch(setSideNavCollapse(false))
		}
	}, [dispatch])

	const handleFormSubmit = async (values) => {
		// console.log('HANDLE FORM SUBMIT - VALUES', values);

		const products = values.products.map((product) => (
			{
				productId: product.productId,
				unitPrice: product.price,
				quantity: product.quantity
			}
		))

		const subtotal = values.products.reduce((sum, element) => sum + element.subtotal, 0)
		const subtotalRounded = Math.round(subtotal * 100) / 100
		const taxValue = values.applyIgv ? Math.round((0.18 * subtotalRounded) * 100) / 100 : 0
		const total = values.applyIgv ? (taxValue + subtotalRounded) : subtotalRounded

		if (!openingData || !openingData.id) {
			toast.error('No se detectó una caja abierta (openingId missing)')
			return;
		}

		const data = {
			number: values.number,
			type: values.type,
			dateIssue: values.dateIssue,
			products,
			igv: taxValue,
			total: total,
			status: 1,
			openingId: openingData.id,
			warehouseId: values.warehouseId
		}

		if (values.type !== 'Ticket') {
			data.serie = values.serie
			data.saleableId = parseInt(values.client.value)

			// Fix: ensure valid saleableType
			if (values.type === 'Boleta') {
				data.saleableType = 'customers'
			} else {
				data.saleableType = 'enterprises' // Verify if this is correct for Factura
			}
		}

		// console.log('DISPATCHING POST SALE', data);

		const res = await dispatch(postSale(data))

		const payload = res.payload || {}
		const { message, type } = payload

		if (type === 'success') {
			toast.success(message || 'Venta registrada con éxito')
			navigate(`/transacciones/min-ventas`)
		} else {
			console.error('POST SALE FAILED', res);
			// Default error message if payload is missing
			const errorMsg = message || 'Ocurrió un error al procesar la venta.'
			toast.error(errorMsg)
		}

	}

	const handleDiscard = () => {
		navigate('/almacen/compras')
	}

	useEffect(() => {
		dispatch(getOpeningCurrent())
	}, [dispatch])

	return (
		<div className="h-full">
			<div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
				<div className="flex items-center gap-4">
					<div className="bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none bg-gradient-to-br from-indigo-500 to-indigo-700 text-white">
						<HiOutlineShoppingCart className="text-2xl" />
					</div>
					<div>
						<h3 className="text-xl font-bold text-gray-800 dark:text-white tracking-tight leading-none mb-1">
							Punto de Venta
						</h3>
						<p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
							Nueva Transacción
						</p>
					</div>
				</div>
				{/* Optional: Add Shift Info or Time here if needed */}
				{!isEmpty(openingData) && (
					<div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100">
						<div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
						<span className="text-xs font-bold">Caja Abierta</span>
					</div>
				)}
			</div>

			{!isEmpty(openingData) ?
				<SaleForm
					onFormSubmit={handleFormSubmit}
					onDiscard={handleDiscard}
				/> :
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
		</div>
	)
}

export default SaleNew