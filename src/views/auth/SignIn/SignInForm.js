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
	rememberMe: Yup.bool(),
})

const SignInForm = (props) => {
	const {
		disableSubmit = false,
		className,
		forgotPasswordUrl = '/forgot-password',
		signUpUrl = '/sign-up',
	} = props

	const [message, setMessage] = useTimeOutMessage()
	const { signIn } = useAuth()

	const onSignIn = async (values, setSubmitting) => {
		const { username, password } = values
		setSubmitting(true)

		const result = await signIn({ username, password })
		if (result.status === 'failed') setMessage(result.message)

		setSubmitting(false)
	}

	const baseLabel =
		'!text-[11px] !font-bold !uppercase !tracking-wider !text-slate-500 dark:!text-slate-300 mb-2'

	const baseInput =
		'h-[46px] rounded-2xl transition-all duration-200 text-sm font-semibold placeholder:font-normal ' +
		'bg-slate-50/80 border-slate-200/70 hover:border-slate-300 hover:bg-slate-100/70 ' +
		'focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 ' +
		'text-slate-800 placeholder:text-slate-400'

	const errorInput =
		'h-[46px] rounded-2xl transition-all duration-200 text-sm font-semibold placeholder:font-normal ' +
		'bg-rose-50/70 border-rose-200 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-300 ' +
		'text-rose-900 placeholder:text-rose-300'

	return (
		<div className={className}>
			{/* Card */}
			<div className="rounded-3xl border border-slate-200/70 bg-white/80 backdrop-blur p-6 sm:p-7 shadow-[0_10px_35px_-20px_rgba(15,23,42,0.35)] dark:bg-slate-900/60 dark:border-slate-700/60">
				{/* Header */}
				<div className="mb-6">


				</div>

				{message && (
					<Alert
						className="mb-5 rounded-2xl border border-red-100 bg-red-50 text-red-700 font-medium shadow-sm"
						type="danger"
						showIcon
					>
						{message}
					</Alert>
				)}

				<Formik
					initialValues={{ username: '', password: '', rememberMe: true }}
					validationSchema={validationSchema}
					onSubmit={(values, { setSubmitting }) => {
						if (!disableSubmit) onSignIn(values, setSubmitting)
						else setSubmitting(false)
					}}
				>
					{({ touched, errors, isSubmitting }) => (
						<Form>
							<FormContainer>
								{/* Usuario */}
								<FormItem
									label="Usuario"
									invalid={errors.username && touched.username}
									errorMessage={errors.username}
									className="mb-5"
									labelClass={baseLabel}
								>
									<div className="relative group">
										<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
											<HiOutlineUser
												className={`text-lg transition-all duration-200 ${errors.username && touched.username
													? 'text-rose-400'
													: 'text-slate-400 group-focus-within:text-indigo-500'
													}`}
											/>
										</div>

										<Field
											id="username"
											type="text"
											autoComplete="username"
											name="username"
											placeholder="Ej. usuario123"
											component={Input}
											aria-invalid={Boolean(errors.username && touched.username)}
											className={`${errors.username && touched.username ? errorInput : baseInput} pl-11 pr-10`}
										/>

										{errors.username && touched.username && (
											<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
												<HiExclamationCircle className="text-lg text-rose-400" />
											</div>
										)}
									</div>
								</FormItem>

								{/* Password */}
								<FormItem
									label="Contraseña"
									invalid={errors.password && touched.password}
									errorMessage={errors.password}
									className="mb-5"
									labelClass={baseLabel}
								>
									<div className="relative group">
										<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
											<HiOutlineLockClosed
												className={`text-lg transition-all duration-200 ${errors.password && touched.password
													? 'text-rose-400'
													: 'text-slate-400 group-focus-within:text-indigo-500'
													}`}
											/>
										</div>

										<Field
											id="password"
											autoComplete="current-password"
											name="password"
											placeholder="••••••••"
											component={PasswordInput}
											aria-invalid={Boolean(errors.password && touched.password)}
											className={`${errors.password && touched.password ? errorInput : baseInput} !pl-11 pr-10`}
										/>
									</div>
								</FormItem>

								{/* Remember + Forgot */}
								<div className="flex items-center justify-between mb-6">
									<Field
										className="mb-0"
										name="rememberMe"
										component={Checkbox}
										children={
											<span className="text-sm text-slate-700 dark:text-slate-200 font-medium select-none cursor-pointer hover:text-indigo-600 transition-colors">
												Recordar dispositivo
											</span>
										}
									/>

									<ActionLink
										to={forgotPasswordUrl}
										className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
									>
										¿Olvidaste contraseña?
									</ActionLink>
								</div>

								{/* Submit */}
								<Button
									block
									loading={isSubmitting}
									variant="solid"
									type="submit"
									className="
                    h-[46px] rounded-2xl font-semibold
                    bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800
                    shadow-[0_10px_25px_-15px_rgba(79,70,229,0.65)]
                    transition-all
                  "
								>
									{isSubmitting ? 'Verificando...' : 'Iniciar Sesión'}
								</Button>

								{/* Optional: footer */}
								<div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
									¿No tienes cuenta?{' '}
									<ActionLink
										to={signUpUrl}
										className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
									>
										Crear cuenta
									</ActionLink>
								</div>
							</FormContainer>
						</Form>
					)}
				</Formik>
			</div>
		</div>
	)
}

export default SignInForm
