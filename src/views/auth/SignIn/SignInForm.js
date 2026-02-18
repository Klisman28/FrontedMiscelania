import React from 'react'
import { Input, Button, Checkbox, FormItem, FormContainer, Alert } from 'components/ui'
import { PasswordInput, ActionLink } from 'components/shared'
import useTimeOutMessage from 'utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import useAuth from 'utils/hooks/useAuth'
import { HiOutlineUser, HiOutlineLockClosed, HiExclamationCircle } from 'react-icons/hi'

const validationSchema = Yup.object().shape({
	username: Yup.string().required('Por favor ingrese su usuario'),
	password: Yup.string().required('Por favor ingrese su contraseña'),
	rememberMe: Yup.bool()
})

const SignInForm = props => {

	const {
		disableSubmit = false,
		className,
		forgotPasswordUrl = '/forgot-password',
		signUpUrl = '/sign-up'
	} = props

	const [message, setMessage] = useTimeOutMessage()

	const { signIn } = useAuth()

	const onSignIn = async (values, setSubmitting) => {
		const { username, password } = values
		setSubmitting(true)

		const result = await signIn({ username, password })

		if (result.status === 'failed') {
			setMessage(result.message)
		}

		setSubmitting(false)
	}

	return (
		<div className={className}>
			{message && (
				<Alert
					className="mb-6 rounded-xl border border-red-100 bg-red-50 text-red-600 font-medium shadow-sm"
					type="danger"
					showIcon
				>
					{message}
				</Alert>
			)}
			<Formik
				initialValues={{
					username: '',
					password: '',
					rememberMe: true
				}}
				validationSchema={validationSchema}
				onSubmit={(values, { setSubmitting }) => {
					if (!disableSubmit) {
						onSignIn(values, setSubmitting)
					} else {
						setSubmitting(false)
					}
				}}
			>
				{({ touched, errors, isSubmitting }) => (
					<Form>
						<FormContainer>

							{/* Campo Usuario */}
							<FormItem
								label="Usuario"
								invalid={errors.username && touched.username}
								// Ocultamos el mensaje de error default porque lo mostramos personalizado
								errorMessage={errors.username}
								className="mb-6"
								labelClass="!text-xs !font-bold !uppercase !tracking-wide !text-slate-500 mb-2"
							>
								<div className="relative group">
									<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
										<HiOutlineUser className={`text-xl transition-colors ${errors.username && touched.username ? 'text-rose-500' : 'text-slate-400 group-focus-within:text-indigo-500'}`} />
									</div>
									<Field
										type="text"
										autoComplete="off"
										name="username"
										placeholder="Ej. usuario123"
										component={Input}
										className={`h-12 pl-11 rounded-xl transition-all duration-200 font-medium placeholder:font-normal
											${errors.username && touched.username
												? 'bg-rose-50 border-rose-300 focus:ring-rose-200 focus:border-rose-400 text-rose-900 placeholder:text-rose-300'
												: 'bg-slate-50 border-transparent hover:bg-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-slate-700 placeholder:text-slate-400'
											}
										`}
									/>
									{errors.username && touched.username && (
										<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
											<HiExclamationCircle className="text-xl text-rose-500" />
										</div>
									)}
								</div>
							</FormItem>

							{/* Campo Password */}
							<FormItem
								label="Contraseña"
								invalid={errors.password && touched.password}
								errorMessage={errors.password}
								className="mb-6"
								labelClass="!text-xs !font-bold !uppercase !tracking-wide !text-slate-500 mb-2"
							>
								<div className="relative group">
									<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
										<HiOutlineLockClosed className={`text-xl transition-colors ${errors.password && touched.password ? 'text-rose-500' : 'text-slate-400 group-focus-within:text-indigo-500'}`} />
									</div>
									<Field
										autoComplete="off"
										name="password"
										placeholder="••••••••"
										component={PasswordInput}
										// PasswordInput wrapper style
										className={`h-12 rounded-xl transition-all duration-200 font-medium !pl-11
											${errors.password && touched.password
												? 'bg-rose-50 border-rose-300 focus:ring-rose-200 focus:border-rose-400 text-rose-900 placeholder:text-rose-300'
												: 'bg-slate-50 border-transparent hover:bg-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-slate-700 placeholder:text-slate-400'
											}
										`}
									/>
								</div>
							</FormItem>

							{/* Remember */}
							<div className="flex justify-between items-center mb-8">
								<Field
									className="mb-0"
									name="rememberMe"
									component={Checkbox}
									// Custom checkbox style would be ideal, but default is fine with text color tweak
									children={<span className="text-sm text-slate-600 font-medium select-none cursor-pointer hover:text-indigo-600 transition-colors">Recordar dispositivo</span>}
								/>
								<span className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer hover:underline">
									¿Olvidaste contraseña?
								</span>
							</div>

							<Button
								block
								loading={isSubmitting}
								variant="solid"
								type="submit"
								className="h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold tracking-wide shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 transform hover:-translate-y-0.5"
							>
								{isSubmitting ? 'Verificando...' : 'Iniciar Sesión'}
							</Button>

						</FormContainer>
					</Form>
				)}
			</Formik>
		</div>
	)
}

export default SignInForm
