// src/routes/AppRoutes.js
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import PublicRoute from './PublicRoute'
import ProtectedRoute from './ProtectedRoute'
import AuthorityGuard from './AuthorityGuard'
import AppRoute from './AppRoute'

import publicRoutes from 'routes/publicRoutes'
import protectedRoutes from 'routes/protectedRoutes'
import { filterByAuthority } from 'utils/navigationFilter'

export function AppRoutes() {
  // 1) Extraemos roles del usuario
  const userAuthority = useSelector(state => state.auth.user.authority)

  // 2) Filtramos sólo las rutas que el usuario puede ver
  //    Adaptamos cada ruta para que tenga subMenu (aunque no se use aquí)
  const allowedRoutes = filterByAuthority(
    protectedRoutes.map(route => ({ ...route, subMenu: [] })),
    userAuthority
  )

  return (
    <Routes>
      {/* RUTAS PÚBLICAS */}
      <Route element={<PublicRoute />}>
        {publicRoutes.map(route => (
          <Route
            key={route.key}
            path={route.path}
            element={
              <AppRoute
                component={route.component}
                routeKey={route.key}
                layout={route.layout}
              />
            }
          />
        ))}
      </Route>

      {/* RUTAS PROTEGIDAS */}
      <Route element={<ProtectedRoute />}>
        {allowedRoutes.map(route => (
          <Route
            key={route.key}
            path={route.path}
            element={
              <AuthorityGuard
                userAuthority={userAuthority}
                authority={route.authority}
              >
                <AppRoute
                  component={route.component}
                  routeKey={route.key}
                  layout={route.layout}
                />
              </AuthorityGuard>
            }
          />
        ))}
      </Route>

      {/* CATCH-ALL */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}
