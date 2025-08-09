import React, { useEffect } from 'react'
import SaleForm from '../SaleForm'
import { toast, Notification } from 'components/ui'
import { Container, DoubleSidedImage } from 'components/shared'
import { useNavigate } from 'react-router-dom'
import { postSale } from './store/newSlice'
import { injectReducer } from 'store/index'
import reducer from './store'
import { useDispatch, useSelector } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import { getOpeningCurrent } from './store/newSlice'
import { HiInformationCircle } from 'react-icons/hi'

injectReducer('saleNew', reducer)

const SaleNew = () => {

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const openingData = useSelector((state) => state.saleNew.data.openingData)

	const handleFormSubmit = async (values) => {
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

		const data = {
			number: values.number,
			type: values.type,
			dateIssue: values.dateIssue,
			products,
			igv: taxValue,
			total: total,
			status: 1,
			openingId: openingData?.id
		}

		if (values.type !== 'Ticket') {
			data.serie = values.serie
			data.saleableId = parseInt(values.client.value)

			if (values.type === 'Boleta') {
				data.saleableType = 'customers'
			} else {
				data.saleableType = 'enterprises'
			}
		}
		const res = await dispatch(postSale(data))

		const { message, type } = res.payload

		if (type === 'success') {
			toast.push(
				<Notification title={'¡Registro Exitoso!'} type="success" duration={3000}>
					{message}
				</Notification>
				, {
					placement: 'top-center'
				}
			)
			navigate(`/transacciones/min-ventas`)
		} else {
			toast.push(
				<Notification title={'¡Registro Fallido!'} type="danger" duration={3000}>
					La venta no se puede registrar, asegure de enviar todos los campos correctos.
				</Notification>
				, {
					placement: 'top-center'
				}
			)
		}

	}

	const handleDiscard = () => {
		navigate('/almacen/compras')
	}

	useEffect(() => {
		dispatch(getOpeningCurrent())
	}, [dispatch])

	return (
		<Container className="h-full">
			<div className="mb-4">
				<div className="flex items-center mb-2">
					<h3>
						<span>Registrar Venta</span>
					</h3>
				</div>
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
		</Container>
	)
}

export default SaleNew