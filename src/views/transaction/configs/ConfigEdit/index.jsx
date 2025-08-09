import React, { useEffect } from 'react'
import { Loading, DoubleSidedImage } from 'components/shared'
import { toast, Notification } from 'components/ui'
import { useDispatch, useSelector } from 'react-redux'
import reducer from './store'
import { injectReducer } from 'store/index'
import { useNavigate, useParams } from 'react-router-dom'
import { getConfig, putConfig } from './store/editSlice'
import ConfigForm from '../ConfigForm'
import isEmpty from 'lodash/isEmpty'

injectReducer('configEdit', reducer)

const ConfigEdit = () => {

	const dispatch = useDispatch()

	const { configId } = useParams();

	const navigate = useNavigate()

	const configData = useSelector((state) => state.configEdit.data.configData)
	const loading = useSelector((state) => state.configEdit.data.loading)

	const fetchData = (id) => {
		dispatch(getConfig(id))
	}

	const handleFormSubmit = async (values, setSubmitting) => {
		setSubmitting(true)
		const res = await dispatch(putConfig({id:configId, data:values}))
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
			navigate('/transacciones/configuracion-de-ventas')
		} else {
			toast.push(
				<Notification title={'¡Actualización Exitoso!'} type="danger" duration={3000}>
					La configuración no se puede actualizar, asegurese de enviar todos los campos correctos.
				</Notification>
				, {
					placement: 'top-center'
				}
			)
		}
	}

	const handleDiscard = () => {
		navigate('/transacciones/configuracion-de-ventas')
	}

	// const handleDelete = async (setDialogOpen) => {
	// 	setDialogOpen(false)
	// 	const success = await deleteConfig({id: configData.id})
	// 	if (success) {
	// 		popNotification('deleted')
	// 	}
	// }

	useEffect(() => {
		fetchData(configId)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<>
			<Loading loading={loading}>
				{!isEmpty(configData) && (
					<>
						<ConfigForm
							typeAction="edit"
							initialData={configData}
							onFormSubmit={handleFormSubmit}
							onDiscard={handleDiscard}
						// onDelete={handleDelete}
						/>
					</>
				)}
			</Loading>
			{(!loading && isEmpty(configData)) && (
				<div className="h-full flex flex-col items-center justify-center">
					<DoubleSidedImage
						src="/img/others/img-2.png"
						darkModeSrc="/img/others/img-2-dark.png"
						alt="No config found!"
					/>
					<h3 className="mt-8">¡No se ha encontrado ninguna configiración!</h3>
				</div>
			)}
		</>
	)
}

export default ConfigEdit