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
            method: 'put',
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
            url: '/inventory/in',
            method: 'post',
            data
        })
    },
    removeStock: async (data) => {
        return ApiService.fetchData({
            url: '/inventory/out',
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
