import BaseService from './BaseService'

/**
 * Obtiene el listado completo de clientes.
 * NOTA: El endpoint /customers no soporta paginación ni filtrado por query params.
 * Se debe filtrar en el frontend.
 * 
 * @returns {Promise<Array>} Listado de clientes
 */
export async function getCustomers() {
    try {
        // Llamada sin parámetros, tal como solicitado
        const res = await BaseService.get('/customers')

        // Extracción directa según la estructura confirmada: res.data.data.customers
        const list = res?.data?.data?.customers ?? []

        if (process.env.NODE_ENV === 'development') {
            console.debug(`[getCustomers] Loaded ${list.length} items`)
            if (list.length > 0) {
                console.debug('[getCustomers] Sample item:', list[0])
            }
        }

        return list
    } catch (error) {
        console.error('Error fetching customers:', error)
        return []
    }
}
