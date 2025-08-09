import ApiService from '../ApiService'

export async function apiGetSales() {
    const res = ApiService.fetchData({
        url: '/sales',
        method: 'get',
    })

    return res
}

export async function apiPostSale(data) {
    const res = ApiService.fetchData({
        url: '/sales',
        method: 'post',
        data: data
    })

    return res
}

export async function apiPutSale(id, data) {
    const res = ApiService.fetchData({
        url: `/sales/${id}`,
        method: 'put',
        data: data
    })

    return res
}

export async function apiReturnSale(id) {
    const res = ApiService.fetchData({
        url: `sales/devolucion/${id}`,
        method: 'put',

    })
    return res
}

export async function apiDeleteSale(id) {
    const res = ApiService.fetchData({
        url: `/sales/${id}`,
        method: 'delete'
    });

    return res
}

export async function apiGetSale(id) {
    const res = ApiService.fetchData({
        url: `/sales/${id}`,
        method: 'get',
    })

    return res
}

export async function apiGetSalesOpening(openingId) {
    const res = ApiService.fetchData({
        url: `/sales/opening/${openingId}`,
        method: 'get',
    })

    return res
}