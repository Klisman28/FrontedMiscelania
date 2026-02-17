import BaseService from '../BaseService'

export const getBrands = async () => {
    return BaseService.get('/brands')
}

export const getCategories = async () => {
    return BaseService.get('/categories')
}

export const getSubcategories = async () => {
    return BaseService.get('/subcategories')
}

export const getProductUnits = async () => {
    return BaseService.get('/products/units')
}
