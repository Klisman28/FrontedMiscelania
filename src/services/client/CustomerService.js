import ApiService from '../ApiService'

export async function apiGetCustomers() {
    const res = ApiService.fetchData({
        url: '/customers',
        method: 'get',
    })

    return res
}

export async function apiPostCustomer(data) {
    const res = ApiService.fetchData({
        url: '/customers',
        method: 'post',
        data: data
    })

    return res
}

export async function apiPutCustomer(id, data) {
    const res = ApiService.fetchData({
        url: `/customers/${id}`,
        method: 'put',
        data: data
    })

    return res
}

export async function apiDeleteCustomer(id) {
    const res = ApiService.fetchData({
        url: `/customers/${id}`,
        method: 'delete'
    });

    return res
}