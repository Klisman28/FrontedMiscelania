import BaseService from './BaseService'
import { normalizeListResponse } from 'utils/normalizeListResponse.js'

const CatalogsApi = {
    getCategories: async () => {
        const res = await BaseService.get('/categories')
        return normalizeListResponse(res.data, 'categories')
    },

    getSubcategories: async (categoryId) => {
        try {
            // Intenta filtrar por query param si existe categoryId
            const params = categoryId ? { categoryId } : {}
            const res = await BaseService.get('/subcategories', { params })
            return normalizeListResponse(res.data, 'subcategories')
        } catch (error) {
            console.warn('Error fetching subcategories with filter, retrying without filter', error)
            // Fallback si falla el filtro
            const res = await BaseService.get('/subcategories')
            let list = normalizeListResponse(res.data, 'subcategories')

            // Filtrado manual si el backend no soportó el query param pero devolvió todo
            if (categoryId && list.length > 0) {
                list = list.filter(item => String(item.categoryId) === String(categoryId))
            }
            return list
        }
    },

    getBrands: async () => {
        const res = await BaseService.get('/brands')
        return normalizeListResponse(res.data, 'brands')
    },

    getUnits: async () => {
        const res = await BaseService.get('/products/units')
        return normalizeListResponse(res.data, 'units')
    }
}

export default CatalogsApi
