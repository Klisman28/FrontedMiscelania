import React, { useEffect } from 'react'
import ConfigForm from '../ConfigForm'
import { toast, Notification } from 'components/ui'
import { useNavigate } from 'react-router-dom'
import { postConfig, getConfig } from './store/newSlice'
import { injectReducer } from 'store/index'
import reducer from './store'
import { useDispatch } from 'react-redux'
import isEmpty from 'lodash/isEmpty'

injectReducer('configNew', reducer)

const ConfigNew = () => {

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const handleFormSubmit = async (values, setSubmitting) => {
		setSubmitting(true)
		const res = await dispatch(postConfig(values))
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
			navigate('/transacciones/configuracion-de-ventas')
		} else {
			toast.push(
				<Notification title={'¡Registro Fallido!'} type="danger" duration={3000}>
					La configuración no se puede guardar, asegure de enviar todos los campos correctos.
				</Notification>
				,{
					placement: 'top-center'
				}
			)
		}
		
	}

	const handleDiscard = () => {
		navigate('/transacciones/configuracion-de-ventas')
	}

	useEffect(() => {
		const handleGetConfig = async () => {
			const res = await dispatch(getConfig());
			if(!isEmpty(res.payload.data)) {
				navigate(`/transacciones/configuracion-de-ventas/${res.payload.data.id}/editar`)
			}
		}

		handleGetConfig()
	}, [])

	return (
		<>
			<ConfigForm 
				onFormSubmit={handleFormSubmit}
				onDiscard={handleDiscard}
			/>
		</>
	)
}

export default ConfigNew