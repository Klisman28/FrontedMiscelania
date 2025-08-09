import ApiService from '../ApiService'

export async function apiGetEmployees() {
    const res = ApiService.fetchData({
        url: '/employees',
        method: 'get',
    })

    return res
}

export async function apiPostEmployee(data) {
    const res = ApiService.fetchData({
        url: '/employees',
        method: 'post',
        data: data
    })

    return res
}

export async function apiPutEmployee(id, data) {
    const res = ApiService.fetchData({
        url: `/employees/${id}`,
        method: 'put',
        data: data
    })

    return res
}

export async function apiDeleteEmployee(id) {
    const res = ApiService.fetchData({
        url: `/employees/${id}`,
        method: 'delete'
    });

    return res
}