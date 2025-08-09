import React from 'react'
import ProductForm from '../ProductForm'
import { toast, Notification } from 'components/ui'
import { useNavigate } from 'react-router-dom'
import { postProduct } from './store/newSlice'
import { injectReducer } from 'store/index'
import reducer from './store'
import { useDispatch } from 'react-redux'

injectReducer('productNew', reducer)

const ProductNew = () => {

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const handleFormSubmit = async (values, setSubmitting) => {
		setSubmitting(true)
		const res = await dispatch(postProduct(values))
		setSubmitting(false)

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
			navigate('/catalogo/productos')
		} else {
			toast.push(
				<Notification title={'¡Registro Fallido!'} type="danger" duration={3000}>
					El producto no se puede guardar, asegure de enviar todos los campos correctos.
				</Notification>
				,{
					placement: 'top-center'
				}
			)
		}
		
	}

	const handleDiscard = () => {
		navigate('/catalogo/productos')
	}

	return (
		<>
			<ProductForm 
				onFormSubmit={handleFormSubmit}
				onDiscard={handleDiscard}
			/>
		</>
	)
}

export default ProductNew