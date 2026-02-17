/**
 * Normaliza la respuesta para listas de entidades específicas.
 * Extrae el array de datos de varias estructuras de respuesta posibles.
 * 
 * @param {Object} res - Respuesta de Axios
 * @param {string} key - Clave de la entidad (ej: 'customers', 'enterprises')
 * @returns {Array} - Lista de entidades normalizada o []
 */
export function normalizeEntityList(res, key) {
    const payload = res?.data
    const list = payload?.data?.[key] ?? payload?.[key] ?? payload?.data ?? payload ?? []

    if (!Array.isArray(list)) {
        return []
    }

    if (process.env.NODE_ENV === 'development') {
        console.debug(`[normalizeEntityList] ${key}: ${list.length} items`)
    }

    return list
}
