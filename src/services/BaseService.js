import axios from 'axios'
import appConfig from 'configs/app.config'
import { TOKEN_TYPE, REQUEST_HEADER_AUTH_KEY } from 'constants/api.constant'
import { PERSIST_STORE_NAME } from 'constants/app.constant'
import deepParseJson from 'utils/deepParseJson'
import store from '../store'
import { onSignOutSuccess } from '../store/auth/sessionSlice'
import { toast, Notification } from 'components/ui'
import React from 'react'

const unauthorizedCode = [401]

// Priority: Env Var > App Config Fallback
const baseURL = process.env.REACT_APP_API_BASE_URL ||
    (appConfig.apiDomain + appConfig.apiPrefix + appConfig.apiVersion);

const BaseService = axios.create({
    timeout: 15000,
    baseURL: baseURL,
})

BaseService.interceptors.request.use(config => {

    const rawPersistData = localStorage.getItem(PERSIST_STORE_NAME)
    const persistData = deepParseJson(rawPersistData)

    const accessToken = persistData?.auth?.session?.token

    if (accessToken) {
        config.headers[REQUEST_HEADER_AUTH_KEY] = `${TOKEN_TYPE}${accessToken}`
    }

    // Sanitize payload to prevent companyId injection (Tenant Isolation)
    if (config.data && typeof config.data === 'object' && !(config.data instanceof FormData)) {
        if (!config.url || !config.url.includes('/auth/impersonate')) {
            if ('companyId' in config.data || 'company_id' in config.data) {
                console.warn('[SECURITY] client tried to send companyId/company_id — removed by BaseService');
                delete config.data.companyId;
                delete config.data.company_id;
            }
        }
    }

    return config
}, error => {
    return Promise.reject(error)
})

BaseService.interceptors.response.use(
    response => response,
    error => {
        const { response } = error

        // Handle Protocol Errors (Network, Timeout, CORS)
        if (error.code === 'ECONNABORTED' || !response) {
            console.error('Network/Timeout Error:', error.message);
            // Optionally dispatch a global error notification here if you have a mechanism
        }

        if (response && unauthorizedCode.includes(response.status)) {
            store.dispatch(onSignOutSuccess())
        }

        // Handle TenantGuard Specific Errors
        if (response && response.status === 400 && response.data?.message?.includes('activeCompanyId')) {
            const isSuperAdmin = store.getState().auth?.user?.authority?.includes('SUPERADMIN')
            if (isSuperAdmin) {
                toast.push(<Notification title="Empresa Requerida" type="info">Redirigiendo... Selecciona una empresa para operar en módulos tenant.</Notification>);
                // Set timeout so the push finishes visually before redirect clears it
                setTimeout(() => window.location.href = '/saas/companies', 1000)
            } else {
                toast.push(<Notification title="Error de Sesión" type="danger">Usuario sin empresa asignada</Notification>);
                store.dispatch(onSignOutSuccess())
            }
        }

        if (response && response.status === 403 && response.data?.message?.includes('not a member')) {
            toast.push(<Notification title="Acceso Denegado" type="danger">No eres miembro de esta empresa</Notification>);
            store.dispatch(onSignOutSuccess())
        }

        if (response && response.status >= 500) {
            console.error('Server Error:', response.data?.message || response.statusText);
        }

        return Promise.reject(error)
    }
)

export default BaseService