import React from 'react'
import appConfig from 'configs/app.config'
import { REDIRECT_URL_KEY } from 'constants/app.constant'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from 'store/auth/userSlice'
import useAuth from 'utils/hooks/useAuth'

const { unAuthenticatedEntryPath } = appConfig

const ProtectedRoute = () => {
	const dispatch = useDispatch()
	const { authenticated } = useAuth()
	const user = useSelector((state) => state.auth.user)
	const location = useLocation()

	// Session Patch: Ensure SuperAdmin authority is applied if missing
	React.useEffect(() => {
		if (authenticated && user && user.username) {
			const hasSuperAdminAuthority = user.authority?.includes('SUPERADMIN')

			// Re-apply same logic as useAuth.js
			const qualifyForSuperAdmin =
				user.isSuperAdmin === true ||
				user.username === 'root' ||
				(Array.isArray(user.roles) && user.roles.some(r => (typeof r === 'string' ? r : r.name) === 'superadmin'))

			if (qualifyForSuperAdmin && !hasSuperAdminAuthority) {
				const newAuthority = [...(user.authority || []), 'SUPERADMIN']
				dispatch(setUser({
					...user,
					authority: [...new Set(newAuthority)]
				}))
				console.log('SuperAdmin authority patched for session')
			}
		}
	}, [authenticated, user, dispatch])

	if (!authenticated) {
		return <Navigate to={`${unAuthenticatedEntryPath}?${REDIRECT_URL_KEY}=${location.pathname}`} replace />;
	}

	// SaaS Subscription Guard
	const allowedStatuses = ['active', 'trialing']

	// Rutas exentas para el estado de suscripción (Facturación exenta de forma implícita)
	const exemptRoutesSub = ['/saas', '/home', '/access-denied']
	const isExemptSub = exemptRoutesSub.some(path => location.pathname.startsWith(path))

	// Rutas exentas de empresa activa (POS)
	// El superadmin puede entrar a SaaS, y cualquiera puede a access-denied
	const exemptRoutesTenant = ['/saas', '/access-denied']
	const isExemptTenant = exemptRoutesTenant.some(path => location.pathname.startsWith(path))

	// Multi-tenant Company Guard
	if (user && !user.activeCompanyId && !isExemptTenant) {
		if (user.authority?.includes('SUPERADMIN')) {
			return (
				<div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 text-center p-4">
					<h2 className="text-2xl font-bold text-gray-800 mb-2">Modo Super Admin Global</h2>
					<p className="text-gray-500 mb-6">No has seleccionado una empresa para operar. El módulo actual es para inquilinos (tenant).</p>
					<button
						onClick={() => window.location.href = '/saas/companies'}
						className="px-4 py-2 bg-indigo-600 text-white rounded font-semibold text-sm cursor-pointer hover:bg-indigo-700 transition"
					>
						Ir al Administrador SaaS
					</button>
				</div>
			)
		} else {
			return (
				<div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 text-center p-4">
					<h2 className="text-2xl font-bold text-gray-800 mb-2">No tienes empresa asignada</h2>
					<p className="text-gray-500 mb-6">Contacta a tu administrador para que te asigne a una empresa. Solo los miembros de una empresa pueden acceder al sistema de punto de venta.</p>
					<button
						onClick={() => {
							dispatch(setUser(null)) // cleanup
							window.location.href = '/access-denied'
						}}
						className="px-4 py-2 bg-red-600 text-white rounded font-semibold text-sm cursor-pointer"
					>
						Salir
					</button>
				</div>
			)
		}
	}

	if (user?.subscriptionStatus && !allowedStatuses.includes(user.subscriptionStatus) && !isExemptSub) {
		return <Navigate to="/saas/facturacion" replace />
	}

	return <Outlet />
}

export default ProtectedRoute