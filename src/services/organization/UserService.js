import ApiService from '../ApiService'

export async function apiGetUsers() {
    const res = ApiService.fetchData({
        url: '/users',
        method: 'get',
    })

    return res
}

export async function apiPostUser(data) {
    const res = ApiService.fetchData({
        url: '/users',
        method: 'post',
        data: data
    })

    return res
}

export async function apiPutUser(id, data) {
    const res = ApiService.fetchData({
        url: `/users/${id}`,
        method: 'put',
        data: data
    })

    return res
}

export async function apiDeleteUser(id) {
    const res = ApiService.fetchData({
        url: `/users/${id}`,
        method: 'delete'
    });

    return res
}

export async function apiGetUserRoles() {
    const res = ApiService.fetchData({
        url: `/users/roles`,
        method: 'get',
    })

    return res
}