import React from 'react'
import PurchasForm from '../PurchasForm'
import { toast, Notification } from 'components/ui'
import { useNavigate } from 'react-router-dom'
import { postPurchas } from './store/newSlice'
import { injectReducer } from 'store/index'
import reducer from './store'
import { useDispatch } from 'react-redux'

injectReducer('purchasNew', reducer)

const PurchasNew = () => {

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const handleFormSubmit = async (values) => {
		const products = values.products.map((product) => (
			{
				productId: product.productId,
				unitCost: product.cost,
				quantity: product.quantity
			}
		))

		const subtotal = values.products.reduce((sum, element) => sum + element.subtotal, 0)
		const subtotalRounded = Math.round(subtotal * 100) / 100
		const taxValue = values.applyIgv ? Math.round((0.05 * subtotalRounded) * 100 ) /100 : 0
		const total = values.applyIgv ? (taxValue + subtotalRounded) : subtotalRounded

		const data = {
			dateIssue: values.dateIssue,
			supplierId: parseInt(values.supplier.value),
			products,
			igv: taxValue,
			total: total
		}

		const res = await dispatch(postPurchas(data))

		const { message, type } = res.payload

		if (type === 'success') {
			toast.push(
				<Notification title={'¡Registro Exitoso!'} type="success" duration={3000}>
					{message}
				</Notification>
				,{
					placement: 'top-center'
				}
			)
			navigate('/almacen/compras')
		} else {
			toast.push(
				<Notification title={'¡Registro Fallido!'} type="danger" duration={3000}>
					La compra no se puede registrar, asegure de enviar todos los campos correctos.
				</Notification>
				,{
					placement: 'top-center'
				}
			)
		}
		
	}

	const handleDiscard = () => {
		navigate('/almacen/compras')
	}

	return (
		<>
			<PurchasForm 
				onFormSubmit={handleFormSubmit}
				onDiscard={handleDiscard}
			/>
		</>
	)
}

export default PurchasNew