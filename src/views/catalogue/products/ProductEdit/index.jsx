import React, { useEffect } from 'react'
import { Loading, DoubleSidedImage } from 'components/shared'
import { toast, Notification } from 'components/ui'
import { useDispatch, useSelector } from 'react-redux'
import reducer from './store'
import { injectReducer } from 'store/index'
import { useNavigate, useParams } from 'react-router-dom'
import { getProduct, putProduct } from './store/editSlice'
import ProductForm from '../ProductForm'
import isEmpty from 'lodash/isEmpty'

injectReducer('productEdit', reducer)

const ProductEdit = () => {

	const dispatch = useDispatch()

	const { productId } = useParams();

	const navigate = useNavigate()

	const productData = useSelector((state) => state.productEdit.data.productData)
	const loading = useSelector((state) => state.productEdit.data.loading)

	const fetchData = (id) => {
		dispatch(getProduct(id))
	}

	const handleFormSubmit = async (values, setSubmitting) => {
		setSubmitting(true)
		const res = await dispatch(putProduct({id:productId, data:values}))
		setSubmitting(false)

		const { message, type } = res.payload

		if (type === 'success') {
			toast.push(
				<Notification title={'¡Actualización Exitoso!'} type="success" duration={3000}>
					{message}
				</Notification>
				, {
					placement: 'top-center'
				}
			)
			navigate('/catalogo/productos')
		} else {
			toast.push(
				<Notification title={'¡Actualización Exitoso!'} type="danger" duration={3000}>
					El producto no se puede actualizar, asegurese de enviar todos los campos correctos.
				</Notification>
				, {
					placement: 'top-center'
				}
			)
		}
	}

	const handleDiscard = () => {
		navigate('/catalogo/productos')
	}

	// const handleDelete = async (setDialogOpen) => {
	// 	setDialogOpen(false)
	// 	const success = await deleteProduct({id: productData.id})
	// 	if (success) {
	// 		popNotification('deleted')
	// 	}
	// }

	useEffect(() => {
		fetchData(productId)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<>
			<Loading loading={loading}>
				{!isEmpty(productData) && (
					<>
						<ProductForm
							typeAction="edit"
							initialData={productData}
							onFormSubmit={handleFormSubmit}
							onDiscard={handleDiscard}
						// onDelete={handleDelete}
						/>
					</>
				)}
			</Loading>
			{(!loading && isEmpty(productData)) && (
				<div className="h-full flex flex-col items-center justify-center">
					<DoubleSidedImage
						src="/img/others/img-2.png"
						darkModeSrc="/img/others/img-2-dark.png"
						alt="No product found!"
					/>
					<h3 className="mt-8">¡No se ha encontrado ningun producto!</h3>
				</div>
			)}
		</>
	)
}

export default ProductEdit