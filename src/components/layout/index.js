import React, { memo, useMemo, lazy, Suspense, useEffect } from 'react'
import { Loading } from 'components/shared'
import { useSelector, useDispatch } from 'react-redux'
import {
	// LAYOUT_TYPE_CLASSIC, 
	LAYOUT_TYPE_MODERN,
	// LAYOUT_TYPE_SIMPLE,
	// LAYOUT_TYPE_STACKED_SIDE,
	// LAYOUT_TYPE_DECKED,
	// LAYOUT_TYPE_BLANK
} from 'constants/theme.constant'
import useAuth from 'utils/hooks/useAuth'
import useDirection from 'utils/hooks/useDirection'
import { fetchCompanyConfig } from 'store/base/companySlice'

const layouts = {
	// [LAYOUT_TYPE_CLASSIC]: lazy(() => import('./ClassicLayout')),
	[LAYOUT_TYPE_MODERN]: lazy(() => import('./ModernLayout')),
	// [LAYOUT_TYPE_STACKED_SIDE]: lazy(() => import('./StackedSideLayout')),
	// [LAYOUT_TYPE_SIMPLE]: lazy(() => import('./SimpleLayout')),
	// [LAYOUT_TYPE_DECKED]: lazy(() => import('./DeckedLayout')),
	// [LAYOUT_TYPE_BLANK]: lazy(() => import('./BlankLayout')),
}

const Layout = () => {

	const layoutType = useSelector((state) => state.theme.layout.type)
	const { token, signedIn } = useSelector((state) => state.auth.session)
	const user = useSelector((state) => state.auth.user)
	const dispatch = useDispatch()

	const { authenticated } = useAuth()

	// Rehydrate JWT to userSlice sync (App Init)
	useEffect(() => {
		if (authenticated && token) {
			let decodedPayload = {}
			try {
				const base64Url = token.split('.')[1]
				const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
				const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
					return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
				}).join(''))
				decodedPayload = JSON.parse(jsonPayload)
			} catch (e) {
				console.error("JWT Decode error on init", e)
			}

			const activeCompanyId = decodedPayload.activeCompanyId ?? null
			const tenantRole = decodedPayload.tenantRole ?? null
			const isSuperAdmin = !!decodedPayload.isSuperAdmin || (decodedPayload.roles || []).includes('SUPERADMIN')

			// Only dispatch if values drift, to prevent infinite loops
			if (user.activeCompanyId !== activeCompanyId || user.tenantRole !== tenantRole || user.isSuperAdmin !== isSuperAdmin) {
				const mergedAuthority = isSuperAdmin && !user.authority.includes('SUPERADMIN')
					? [...user.authority, 'SUPERADMIN']
					: user.authority;

				dispatch({
					type: 'auth/user/setUser',
					payload: {
						...user,
						activeCompanyId,
						tenantRole,
						isSuperAdmin,
						authority: mergedAuthority
					}
				})
			}
		}
	}, [authenticated, token, user.activeCompanyId, user.tenantRole, dispatch])

	// Fetch company config (logo + name) on auth
	const companyLoaded = useSelector((state) => state.base.company.loaded)
	const companyName = useSelector((state) => state.base.company.companyName)
	const logoSignedUrl = useSelector((state) => state.base.company.logoSignedUrl)

	useEffect(() => {
		if (authenticated && !companyLoaded) {
			dispatch(fetchCompanyConfig())
		}
	}, [authenticated, companyLoaded, dispatch])

	// Update browser tab title and Favicon
	useEffect(() => {
		document.title = companyName || 'POS'
		if (logoSignedUrl) {
			let link = document.querySelector("link[rel~='icon']");
			if (!link) {
				link = document.createElement('link');
				link.rel = 'icon';
				document.getElementsByTagName('head')[0].appendChild(link);
			}
			link.href = logoSignedUrl;
		}
	}, [companyName, logoSignedUrl])

	useDirection()

	const AppLayout = useMemo(() => {
		if (authenticated) {
			return layouts[layoutType]
		}
		return lazy(() => import('./AuthLayout'))
	}, [layoutType, authenticated])

	return (
		<Suspense
			fallback={
				<div className="flex flex-auto flex-col h-[100vh]">
					<Loading loading={true} />
				</div>
			}
		>
			{/* 👇 envolvemos AppLayout en un contenedor a pantalla completa */}
			<div className="min-h-screen flex flex-col">
				<AppLayout />
			</div>
		</Suspense>
	)
}

export default memo(Layout)