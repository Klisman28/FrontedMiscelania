/**
 * Normaliza la respuesta de listas desde la API.
 * Soporta múltiples formatos de respuesta comunes.
 * 
 * @param {Object} res - Objeto de respuesta de Axios
 * @param {string} entityKey - Clave de la entidad (ej: 'categories', 'brands')
 * @returns {Array} - Array de datos normalizado
 */
export const normalizeListResponse = (res, entityKey) => {
    if (!res || !res.data) {
        console.debug(`[normalizeListResponse] No data found in response for ${entityKey}`);
        return [];
    }

    let list = [];
    const { data } = res;

    // Caso A: res.data.data[entityKey] (Formato actual del usuario)
    if (data.data && Array.isArray(data.data[entityKey])) {
        list = data.data[entityKey];
    }
    // Caso B: res.data.data.rows
    else if (data.data && Array.isArray(data.data.rows)) {
        list = data.data.rows;
    }
    // Caso C: res.data.data (si ya es array)
    else if (Array.isArray(data.data)) {
        list = data.data;
    }
    // Caso D: res.data (si ya es array)
    else if (Array.isArray(data)) {
        list = data;
    }
    // Caso E: res.data[entityKey]
    else if (Array.isArray(data[entityKey])) {
        list = data[entityKey];
    } else {
        console.warn(`[normalizeListResponse] Could not find array for ${entityKey} in response`, res);
    }

    console.debug(`[normalizeListResponse] Extracted ${list.length} items for ${entityKey}`);
    return list;
};
