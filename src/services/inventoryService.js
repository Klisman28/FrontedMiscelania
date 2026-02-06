import ApiService from './ApiService'

const inventoryService = {
    getTransfers: async (params) => {
        return ApiService.fetchData({
            url: '/inventory/transfers',
            method: 'get',
            params
        })
    },
    getTransferById: async (id) => {
        return ApiService.fetchData({
            url: `/inventory/transfers/${id}`,
            method: 'get',
        })
    },
    createTransfer: async (data) => {
        return ApiService.fetchData({
            url: '/inventory/transfer',
            method: 'post',
            data
        })
    },
    addStock: async (data) => {
        return ApiService.fetchData({
            url: '/inventory/in',
            method: 'post',
            data
        })
    },
    stockIn: async (data) => {
        return ApiService.fetchData({
            url: '/inventory/in',
            method: 'post',
            data
        })
    },
}

export default inventoryService
