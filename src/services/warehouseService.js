import ApiService from './ApiService'
import { cleanParams } from '../utils/cleanParams'

const warehouseService = {
    fetchWarehouses: async (params) => {
        return ApiService.fetchData({
            url: '/warehouses',
            method: 'get',
            params: cleanParams(params)
        })
    },
    /**
     * Fetch only active stores (type = 'tienda')
     * Used by sales module to populate warehouse selector
     */
    fetchStores: async () => {
        return ApiService.fetchData({
            url: '/warehouses/stores',
            method: 'get',
        })
    },
    /**
     * Fetch products available in stores (stock > 0 in tiendas)
     * Used by "Nueva Venta" catalogue and quick search
     */
    fetchStoreProducts: async (params) => {
        return ApiService.fetchData({
            url: '/warehouses/stores/products',
            method: 'get',
            params: cleanParams(params)
        })
    },
    createWarehouse: async (data) => {
        return ApiService.fetchData({
            url: '/warehouses',
            method: 'post',
            data
        })
    },
    updateWarehouse: async (id, data) => {
        return ApiService.fetchData({
            url: `/warehouses/${id}`,
            method: 'patch',
            data
        })
    },
    fetchWarehouseStock: async (id, params) => {
        return ApiService.fetchData({
            url: `/warehouses/${id}/stock`,
            method: 'get',
            params: cleanParams(params)
        })
    },
    fetchWarehouse: async (id) => {
        return ApiService.fetchData({
            url: `/warehouses/${id}`,
            method: 'get',
        })
    },
    deleteWarehouse: async (id) => {
        return ApiService.fetchData({
            url: `/warehouses/${id}`,
            method: 'delete',
        })
    },
    addStock: async (data) => {
        return ApiService.fetchData({
            url: '/inventory/add',
            method: 'post',
            data
        })
    },
    removeStock: async (data) => {
        return ApiService.fetchData({
            url: '/inventory/remove',
            method: 'post',
            data
        })
    },
    transferStock: async (data) => {
        return ApiService.fetchData({
            url: '/inventory/transfer',
            method: 'post',
            data
        })
    }
}

export default warehouseService

