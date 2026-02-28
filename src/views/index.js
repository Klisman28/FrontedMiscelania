import React, { Suspense } from 'react'
import { Loading } from 'components/shared'
import { protectedRoutes, publicRoutes } from 'configs/routes.config'
import appConfig from 'configs/app.config'
import PageContainer from 'components/template/PageContainer'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProtectedRoute from 'components/route/ProtectedRoute'
import PublicRoute from 'components/route/PublicRoute'
import AuthorityGuard from 'components/route/AuthorityGuard'
import AppRoute from 'components/route/AppRoute'
import RequireSuperAdmin from 'components/route/RequireSuperAdmin'

const { authenticatedEntryPath } = appConfig

const AllRoutes = props => {

	const userAuthority = useSelector((state) => state.auth.user.authority)

	return (
		<Routes>
			<Route path="/" element={<ProtectedRoute />}>
				<Route path="/" element={<Navigate replace to={authenticatedEntryPath} />} />

				{/* Non-SaaS Admin Routes */}
				{protectedRoutes.filter(route => !route.key.startsWith('saasAdmin.')).map((route, index) => (
					<Route
						key={route.key + index}
						path={route.path}
						element={
							<AuthorityGuard
								userAuthority={userAuthority}
								authority={route.authority}
							>
								<PageContainer {...props} {...route.meta}>
									<AppRoute
										routeKey={route.key}
										component={route.component}
										{...route.meta}
									/>
								</PageContainer>
							</AuthorityGuard>
						}
					/>
				))}

				{/* SaaS Admin Routes Wrapped in RequireSuperAdmin */}
				<Route element={<RequireSuperAdmin />}>
					{protectedRoutes.filter(route => route.key.startsWith('saasAdmin.')).map((route, index) => (
						<Route
							key={route.key + index}
							path={route.path}
							element={
								<AuthorityGuard
									userAuthority={userAuthority}
									authority={route.authority}
								>
									<PageContainer {...props} {...route.meta}>
										<AppRoute
											routeKey={route.key}
											component={route.component}
											{...route.meta}
										/>
									</PageContainer>
								</AuthorityGuard>
							}
						/>
					))}
				</Route>

				<Route path="*" element={<Navigate to="/" replace />} />
			</Route>
			<Route path="/" element={<PublicRoute />}>
				{publicRoutes.map(route => (
					<Route
						key={route.path}
						path={route.path}
						element={
							<AppRoute
								routeKey={route.key}
								component={route.component}
								{...route.meta}
							/>
						}
					/>
				))}
			</Route>
		</Routes>
	)

}

const Views = props => {
	return (
		<Suspense fallback={<Loading loading={true} />}>
			<AllRoutes {...props} />
		</Suspense>
	)
}

export default Views
