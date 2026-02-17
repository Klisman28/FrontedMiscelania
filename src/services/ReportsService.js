import ApiService from './ApiService'
import { cleanParams } from '../utils/cleanParams'

export async function apiGetSalesSummary(params) {
    return ApiService.fetchData({
        url: '/report/sales/summary',
        method: 'get',
        params: cleanParams(params)
    })
}

export async function apiGetSalesByDay(params) {
    return ApiService.fetchData({
        url: '/report/sales/by-day',
        method: 'get',
        params: cleanParams(params)
    })
}

export async function apiGetTopProducts(params) {
    return ApiService.fetchData({
        url: '/report/sales/top-products',
        method: 'get',
        params: cleanParams(params)
    })
}

export async function apiGetTopClients(params) {
    return ApiService.fetchData({
        url: '/report/sales/top-clients',
        method: 'get',
        params: cleanParams(params)
    })
}

export async function apiGetPurchasesSummary(params) {
    return ApiService.fetchData({
        url: '/report/purchases/summary',
        method: 'get',
        params: cleanParams(params)
    })
}

export async function apiGetPurchasesByDay(params) {
    return ApiService.fetchData({
        url: '/report/purchases/by-day',
        method: 'get',
        params: cleanParams(params)
    })
}

export async function apiGetTopSuppliers(params) {
    return ApiService.fetchData({
        url: '/report/purchases/top-suppliers',
        method: 'get',
        params: cleanParams(params)
    })
}

export async function apiGetLowStock(params) {
    return ApiService.fetchData({
        url: '/report/inventory/low-stock',
        method: 'get',
        params: cleanParams(params)
    })
}

export async function apiGetInventoryValuation(params) {
    return ApiService.fetchData({
        url: '/report/inventory/valuation',
        method: 'get',
        params: cleanParams(params)
    })
}

export async function apiGetReportExport(params) {
    return ApiService.fetchData({
        url: '/report/export',
        method: 'get',
        params: cleanParams(params),
        responseType: 'blob' // Important for file download
    })
}
