import React, { cloneElement } from 'react'
import Logo from 'components/template/Logo'
import { APP_NAME } from 'constants/app.constant'
import {
	HiOutlineShieldCheck,
	HiOutlineLightningBolt,
	HiOutlineChartBar,
	HiOutlineShoppingCart
} from 'react-icons/hi'
import './styles.css'

/* ─── Feature Card ─── */
const FeatureCard = ({ icon, title, desc, delay = 0 }) => (
	<div
		className={`auth-feature-card auth-fade-in`}
		style={{ animationDelay: `${delay}s` }}
	>
		<div className="auth-feature-icon" style={{ background: 'rgba(99, 102, 241, 0.12)' }}>
			{icon}
		</div>
		<div>
			<h6 className="text-white font-semibold text-sm mb-0.5 tracking-tight">{title}</h6>
			<p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
		</div>
	</div>
)

const Side = ({ children, content, ...rest }) => {
	return (
		<div className="min-h-screen grid lg:grid-cols-2 xl:grid-cols-[42%_58%] h-full">

			{/* ═══════════════════════════════════════════
				PANEL IZQUIERDO — Branding Premium
			═══════════════════════════════════════════ */}
			<div className="hidden lg:flex flex-col justify-between relative bg-slate-900 overflow-hidden">

				{/* Animated gradient blobs */}
				<div className="auth-blob-1"></div>
				<div className="auth-blob-2"></div>
				<div className="auth-blob-3"></div>

				{/* Dot pattern (masked) */}
				<div className="absolute inset-0 z-0 auth-dot-pattern opacity-30"></div>

				{/* Base overlay */}
				<div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900/90 z-[1]"></div>

				{/* Contenido */}
				<div className="relative z-10 p-10 xl:p-12 h-full flex flex-col justify-between">

					{/* Top: Logo + Headline */}
					<div>
						<div className="auth-fade-in">
							<Logo mode="dark" className="h-10 w-auto mb-10" />
						</div>

						<div className="space-y-5 auth-fade-in auth-fade-in-delay-1">
							<h1 className="text-3xl xl:text-[2.75rem] font-extrabold text-white tracking-tight leading-[1.15]">
								Impulsa tu negocio al{' '}
								<span className="auth-gradient-text">
									siguiente nivel.
								</span>
							</h1>
							<p className="text-slate-400 text-base xl:text-lg max-w-md leading-relaxed">
								La plataforma todo-en-uno diseñada para simplificar tus operaciones, ventas e inventario.
							</p>
						</div>
					</div>

					{/* Middle: Feature cards */}
					<div className="space-y-3 mt-10">
						<FeatureCard
							icon={<HiOutlineLightningBolt className="text-lg text-indigo-400" />}
							title="Rendimiento Veloz"
							desc="Interfaz optimizada para procesar ventas en milisegundos."
							delay={0.2}
						/>
						<FeatureCard
							icon={<HiOutlineChartBar className="text-lg text-cyan-400" />}
							title="Análisis en Tiempo Real"
							desc="Toma decisiones basadas en datos actualizados al instante."
							delay={0.3}
						/>
						<FeatureCard
							icon={<HiOutlineShieldCheck className="text-lg text-emerald-400" />}
							title="Seguridad Garantizada"
							desc="Tus datos y los de tus clientes siempre protegidos."
							delay={0.4}
						/>
						<FeatureCard
							icon={<HiOutlineShoppingCart className="text-lg text-purple-400" />}
							title="Punto de Venta Integral"
							desc="Control total de inventario, ventas y reportes en un solo lugar."
							delay={0.5}
						/>
					</div>

					{/* Footer */}
					<div className="auth-footer-separator flex justify-between items-center text-xs text-slate-500 auth-fade-in auth-fade-in-delay-4">
						<span>© {new Date().getFullYear()} {APP_NAME}</span>
						<div className="flex gap-4">
							<span className="cursor-pointer hover:text-slate-300 transition-colors">Privacidad</span>
							<span className="cursor-pointer hover:text-slate-300 transition-colors">Términos</span>
						</div>
					</div>
				</div>
			</div>

			{/* ═══════════════════════════════════════════
				PANEL DERECHO — Login Form
			═══════════════════════════════════════════ */}
			<div className="flex flex-col justify-center items-center auth-right-panel p-4 sm:p-6 min-h-screen">

				<div className="w-full max-w-[420px] relative z-10 flex flex-col items-center">

					{/* Header Móvil */}
					<div className="lg:hidden mb-8 text-center auth-fade-in">
						<div className="auth-avatar-badge mx-auto mb-4">
							<HiOutlineShoppingCart className="text-2xl" />
						</div>
						<h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
							Bienvenido de nuevo
						</h2>
						<p className="text-slate-500 text-sm mt-1">
							Ingresa tus credenciales para continuar
						</p>
					</div>

					{/* Card del formulario */}
					<div className="auth-card w-full p-8 sm:p-10 auth-fade-in auth-fade-in-delay-1">

						{/* Barra decorativa animada */}
						<div className="auth-card-accent"></div>

						{/* Header Desktop */}
						<div className="mb-8 hidden lg:block">
							<div className="flex items-center gap-4 mb-5">
								<div className="auth-avatar-badge">
									<HiOutlineShoppingCart className="text-2xl" />
								</div>
								<div>
									<h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
										Bienvenido de nuevo
									</h3>
									<p className="text-slate-400 text-sm mt-0.5">
										Ingresa tus datos para continuar
									</p>
								</div>
							</div>
						</div>

						{children ? cloneElement(children, { ...rest }) : null}
					</div>

					{/* Link inferior */}
					<p className="mt-8 text-center text-xs text-slate-400 auth-fade-in auth-fade-in-delay-3">
						¿No tienes una cuenta?{' '}
						<span className="text-indigo-600 font-semibold cursor-pointer hover:text-indigo-700 hover:underline transition-colors">
							Contactar administrador
						</span>
					</p>
				</div>
			</div>

		</div>
	)
}

export default Side