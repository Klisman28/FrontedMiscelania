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
	const exemptRoutes = ['/saas', '/home', '/access-denied']
	const isExempt = exemptRoutes.some(path => location.pathname.startsWith(path))

	if (user?.subscriptionStatus && !allowedStatuses.includes(user.subscriptionStatus) && !isExempt) {
		return <Navigate to="/saas/facturacion" replace />
	}

	return <Outlet />
}

export default ProtectedRoute