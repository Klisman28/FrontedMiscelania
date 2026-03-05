import BaseService from './BaseService'
import { cleanParams } from '../utils/cleanParams'

const ProductsApi = {
    createProduct: (data, onUploadProgress) => {
        return BaseService.post('/products', data, {
            onUploadProgress
        })
    },

    updateProduct: (id, data, onUploadProgress) => {
        return BaseService.put(`/products/${id}`, data, {
            onUploadProgress
        })
    },

    getProduct: (id) => {
        return BaseService.get(`/products/${id}`)
    },

    listProducts: (params) => {
        return BaseService.get('/products', { params: cleanParams(params) })
    }
}

export default ProductsApi
