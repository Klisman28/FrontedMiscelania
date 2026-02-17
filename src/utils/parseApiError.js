
export const parseApiError = (error, fallback = 'Ocurrió un error inesperado') => {

    // 1. Detect network/timeout errors
    if (!error.response) {
        if (error.code === 'ECONNABORTED') {
            return 'El servidor tardó demasiado en responder (Timeout). Verifique su conexión o backend.';
        }
        if (error.message && error.message.includes('Network Error')) {
            return 'Error de conexión. Verifique que el servidor esté encendido.';
        }
        return error.message || fallback;
    }

    // 2. Detect HTML response (Proxy error, 502 Bad Gateway, 404 from frontend server)
    const contentType = error.response.headers?.['content-type'];
    if (contentType && contentType.includes('text/html')) {
        return `Error del Servidor (${error.response.status}): Posible problema de proxy o backend no disponible.`;
    }

    // 3. Standard API Error format
    if (error.response?.data?.message) {
        return error.response.data.message
    }

    if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        return error.response.data.errors.map(e => e.message || e).join(', ')
    }

    // 4. Fallback to status text
    if (error.response.statusText) {
        return `Error ${error.response.status}: ${error.response.statusText}`
    }

    return fallback
}
