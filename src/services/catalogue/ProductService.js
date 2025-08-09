import ApiService from '../ApiService'

export async function apiGetProducts() {
    const res = ApiService.fetchData({
        url: '/products',
        method: 'get',
    })

    return res
}

export async function apiGetProduct(id) {
    const res = ApiService.fetchData({
        url: `/products/${id}`,
        method: 'get',
    })

    return res
}

export async function apiPostProduct(data) {
    const res = ApiService.fetchData({
        url: '/products',
        method: 'post',
        data: data
    })

    return res
}

export async function apiPutProduct(id, data) {
    const res = ApiService.fetchData({
        url: `/products/${id}`,
        method: 'put',
        data: data
    })

    return res
}

export async function apiDeleteProduct(id) {
    const res = ApiService.fetchData({
        url: `/products/${id}`,
        method: 'delete'
    });

    return res
}

export async function apiGetProductUnits() {
    const res = ApiService.fetchData({
        url: '/products/units',
        method: 'get',
    })

    return res
}

export async function apiSearchProducts(query) {
    const res = ApiService.fetchData({
        url: `/products/search?offset=0&limit=10&search=${query.search}`,
        method: 'get',
    })

    return res
}