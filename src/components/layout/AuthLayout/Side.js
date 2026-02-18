import React, { cloneElement } from 'react'
import Logo from 'components/template/Logo'
import { APP_NAME } from 'constants/app.constant'
import { HiCheck, HiOutlineShieldCheck, HiOutlineLightningBolt, HiOutlineChartBar } from 'react-icons/hi'
import './styles.css';

const FeatureCard = ({ icon, title, desc }) => (
	<div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
		<div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300">
			{icon}
		</div>
		<div>
			<h6 className="text-white font-semibold text-sm mb-0.5">{title}</h6>
			<p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
		</div>
	</div>
)

const Side = ({ children, content, ...rest }) => {
	return (
		<div className="min-h-screen grid lg:grid-cols-2 xl:grid-cols-[40%_60%] h-full">

			{/* ═══════════════════════════════════════════
				PANEL IZQUIERDO (Branding Premium)
			═══════════════════════════════════════════ */}
			<div className="hidden lg:flex flex-col justify-between relative bg-slate-900 border-r border-slate-800 overflow-hidden">

				{/* Fondo y Patrón de Puntos */}
				<div className="absolute inset-0 z-0 opacity-20"
					style={{
						backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)',
						backgroundSize: '32px 32px'
					}}
				></div>

				{/* Gradiente Overlay Sutil */}
				<div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/95 to-indigo-900/20 z-0"></div>

				{/* Contenido */}
				<div className="relative z-10 p-12 h-full flex flex-col justify-between">
					<div>
						<Logo mode="dark" className="h-10 w-auto mb-10" />

						<div className="space-y-6">
							<h1 className="text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
								Impulsa tu negocio al <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">siguiente nivel.</span>
							</h1>
							<p className="text-slate-400 text-lg max-w-md leading-relaxed">
								La plataforma todo-en-uno diseñada para simplificar tus operaciones, ventas e inventario.
							</p>
						</div>
					</div>

					<div className="space-y-4 mt-12">
						<FeatureCard
							icon={<HiOutlineLightningBolt className="text-lg" />}
							title="Rendimiento Veloz"
							desc="Interfaz optimizada para procesar ventas en milisegundos."
						/>
						<FeatureCard
							icon={<HiOutlineChartBar className="text-lg" />}
							title="Análisis en Tiempo Real"
							desc="Toma decisiones basadas en datos actualizados al instante."
						/>
						<FeatureCard
							icon={<HiOutlineShieldCheck className="text-lg" />}
							title="Seguridad Garantizada"
							desc="Tus datos y los de tus clientes siempre protegidos."
						/>
					</div>

					<div className="pt-8 border-t border-white/10 flex justify-between items-center text-xs text-slate-500">
						<span>© {new Date().getFullYear()} {APP_NAME}</span>
						<div className="flex gap-4">
							<span className="cursor-pointer hover:text-slate-300">Privacidad</span>
							<span className="cursor-pointer hover:text-slate-300">Términos</span>
						</div>
					</div>
				</div>
			</div>

			{/* ═══════════════════════════════════════════
				PANEL DERECHO (Login Form)
			═══════════════════════════════════════════ */}
			<div className="flex flex-col justify-center items-center bg-slate-50 dark:bg-gray-900 p-4 relative min-h-screen">

				{/* Decoración fondo derecho */}
				<div className="absolute inset-0 pointer-events-none overflow-hidden">
					<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20"></div>
					<div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-200/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-30"></div>
				</div>

				<div className="w-full max-w-[420px] relative z-10 flex flex-col items-center">
					{/* Header Móvil */}
					<div className="lg:hidden mb-8 text-center">
						<div className="inline-flex p-3 rounded-2xl bg-white shadow-sm mb-4">
							<Logo mode="light" className="h-8 w-auto" />
						</div>
						<h2 className="text-2xl font-bold text-slate-900 tracking-tight">Bienvenido de nuevo</h2>
					</div>

					<div className="w-full bg-white dark:bg-gray-800 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-gray-700 rounded-[2rem] p-8 sm:p-10 relative overflow-hidden">
						{/* Barra de color superior */}
						<div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

						<div className="mb-8 hidden lg:block">
							<h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Iniciar Sesión</h3>
							<p className="text-slate-500 text-sm">Ingresa tus datos para administrar tu punto de venta</p>
						</div>

						<div className="mb-6 lg:hidden text-center text-slate-500 text-sm">
							Ingresa tus credenciales para continuar
						</div>

						{children ? cloneElement(children, { ...rest }) : null}
					</div>

					<p className="mt-8 text-center text-xs text-slate-400">
						¿No tienes una cuenta? <span className="text-indigo-600 font-semibold cursor-pointer hover:underline">Contactar administrador</span>
					</p>
				</div>
			</div>

		</div>
	)
}

export default Side