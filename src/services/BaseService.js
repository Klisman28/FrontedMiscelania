import axios from 'axios'
import appConfig from 'configs/app.config'
import { TOKEN_TYPE, REQUEST_HEADER_AUTH_KEY } from 'constants/api.constant'
import { PERSIST_STORE_NAME } from 'constants/app.constant'
import deepParseJson from 'utils/deepParseJson'
import store from '../store'
import { onSignOutSuccess } from '../store/auth/sessionSlice'

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

        if (response && response.status >= 500) {
            console.error('Server Error:', response.data?.message || response.statusText);
        }

        return Promise.reject(error)
    }
)

export default BaseService