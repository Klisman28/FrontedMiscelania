import ApiService from '../ApiService'

export async function apiGetSubcategories() {
    const res = ApiService.fetchData({
        url: '/subcategories',
        method: 'get',
    })

    return res
}

export async function apiPostSubcategory(data) {
    const res = ApiService.fetchData({
        url: '/subcategories',
        method: 'post',
        data: data
    })

    return res
}

export async function apiPutSubcategory(id, data) {
    const res = ApiService.fetchData({
        url: `/subcategories/${id}`,
        method: 'put',
        data: data
    })

    return res
}

export async function apiDeleteSubcategory(id) {
    const res = ApiService.fetchData({
        url: `/subcategories/${id}`,
        method: 'delete'
    });

    return res
}