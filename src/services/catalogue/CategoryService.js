import ApiService from '../ApiService'

export async function apiGetCategories() {
    const res = ApiService.fetchData({
        url: '/categories',
        method: 'get',
    })

    return res
}

export async function apiPostCategory(data) {
    const res = ApiService.fetchData({
        url: '/categories',
        method: 'post',
        data: data
    })

    return res
}

export async function apiPutCategory(id, data) {
    const res = ApiService.fetchData({
        url: `/categories/${id}`,
        method: 'put',
        data: data
    })

    return res
}

export async function apiDeleteCategory(id) {
    const res = ApiService.fetchData({
        url: `/categories/${id}`,
        method: 'delete'
    });

    return res
}