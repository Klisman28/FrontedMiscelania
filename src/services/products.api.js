import BaseService from './BaseService'
import { cleanParams } from '../utils/cleanParams'

const ProductsApi = {
    createProduct: (formData, onUploadProgress) => {
        return BaseService.post('/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress
        })
    },

    updateProduct: (id, formData, onUploadProgress) => {
        return BaseService.put(`/products/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
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
