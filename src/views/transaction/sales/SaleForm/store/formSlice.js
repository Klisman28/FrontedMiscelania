import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetCustomers } from 'services/client/CustomerService'
import { apiGetEnterprises } from 'services/client/EnterpriseService'
import { apiGetConfigs } from 'services/transaction/ConfigService'
import { apiGetProducts } from 'services/catalogue/ProductService'
import { apiGetSubcategories } from 'services/catalogue/SubcategoryService'
import { apiGetNextTicket } from 'services/transaction/TicketService'
import { apiGetBrands } from 'services/catalogue/BrandService'
import { apiGetCategories } from 'services/catalogue/CategoryService'
import warehouseService from 'services/warehouseService'

export const getCustomers = createAsyncThunk(
    'transaction/sales/getCustomers',
    async () => {
        const response = await apiGetCustomers()
        return response.data
    }
)

export const getEnterprises = createAsyncThunk(
    'transaction/sales/getEnterprises',
    async () => {
        const response = await apiGetEnterprises()
        return response.data
    }
)

/**
 * Search products using the store's stock endpoint.
 * Only returns products that actually exist in the tienda (warehouse).
 * @param {{ search: string, warehouseId: number }} params
 */
export const searchProducts = createAsyncThunk(
    'transaction/sales/searchProducts',
    async ({ search, warehouseId }) => {
        if (!warehouseId) {
            // Fallback: use store products endpoint (all tiendas)
            const response = await warehouseService.fetchStoreProducts({ search, pageSize: 10 })
            return response.data
        }
        // Primary: query specific store stock
        const response = await warehouseService.fetchWarehouseStock(warehouseId, {
            search,
            pageIndex: 1,
            pageSize: 10
        })
        return response.data
    }
)

export const getAllProducts = createAsyncThunk(
    'transaction/sales/getAllProducts',
    async () => {
        const response = await apiGetProducts()
        return response.data
    }
)

/**
 * Fetch products available in stores (tiendas) with stock > 0.
 * Used by the POS "Nueva Venta" catalogue.
 */
export const getStoreProducts = createAsyncThunk(
    'transaction/sales/getStoreProducts',
    async (params = {}) => {
        const response = await warehouseService.fetchStoreProducts(params)
        return response.data
    }
)

export const getSubcategories = createAsyncThunk(
    'transaction/sales/getSubcategories',
    async () => {
        const response = await apiGetSubcategories()
        return response.data
    }
)

export const getBrands = createAsyncThunk(
    'transaction/sales/getBrands',
    async () => {
        const response = await apiGetBrands()
        return response.data
    }
)

export const getCategories = createAsyncThunk(
    'transaction/sales/getCategories',
    async () => {
        const response = await apiGetCategories()
        return response.data
    }
)

export const getConfig = createAsyncThunk(
    'transaction/sales/getConfig',
    async () => {
        const response = await apiGetConfigs()
        return response.data
    }
)

// Nuevo thunk para el siguiente ticket
export const getNextTicket = createAsyncThunk(
    'transaction/sales/getNextTicket',
    async () => {
        const response = await apiGetNextTicket()
        // el backend responde { numero: <n> }
        return response.data.numero
    }
)
// —————————————————————————————————————
const newSlice = createSlice({
    name: 'transaction/sales/data',
    initialState: {
        customerList: [],
        enterpriseList: [],
        productList: [],
        configData: [],
        searchTerm: '', // Global search term for filtering
        catalogue: {
            categories: [],
            subcategories: [],
            brands: [],
            products: []
        }
    },
    reducers: {
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload
        },
        setProductList: (state, action) => {
            state.productList = action.payload
        }
    },
    extraReducers: {
        [getCustomers.fulfilled]: (state, action) => {
            state.customerList = action.payload.data.customers
        },
        [getEnterprises.fulfilled]: (state, action) => {
            state.enterpriseList = action.payload.data.enterprises
        },
        [getConfig.fulfilled]: (state, action) => {
            state.configData = action.payload.data
        },
        [searchProducts.fulfilled]: (state, action) => {
            const payload = action.payload
            const items = payload?.data || payload || []
            // Normalize: if items come from warehouse stock endpoint,
            // they have { product, quantity } shape; from store products they have { product, storeStock }
            if (Array.isArray(items) && items.length > 0 && items[0].product) {
                state.productList = items.map(item => ({
                    ...item.product,
                    stock: item.quantity ?? item.storeStock ?? 0,
                    warehouseId: item.warehouseId
                }))
            } else {
                // Already flat product array (legacy fallback)
                state.productList = items
            }
        },
        [getNextTicket.fulfilled]: (state, action) => {
            state.nextTicket = action.payload
        },
        [getAllProducts.fulfilled]: (state, action) => {
            const payload = action.payload
            state.catalogue.products = payload?.data?.products ?? payload?.products ?? []
        },
        [getSubcategories.fulfilled]: (state, action) => {
            const payload = action.payload
            state.catalogue.subcategories = Array.isArray(payload) ? payload : (payload.data || payload.subcategories || [])
        },
        [getBrands.fulfilled]: (state, action) => {
            const payload = action.payload
            state.catalogue.brands = Array.isArray(payload) ? payload : (payload.data || payload.brands || [])
        },
        [getCategories.fulfilled]: (state, action) => {
            const payload = action.payload
            state.catalogue.categories = Array.isArray(payload) ? payload : (payload.data || payload.categories || [])
        },
        /**
         * Store products from /warehouses/stores/products
         * API returns: { data: [{ productId, product, warehouseId, warehouse, storeStock }], total, meta }
         * We normalize into the same shape as catalogue.products for backward compat.
         */
        [getStoreProducts.fulfilled]: (state, action) => {
            const payload = action.payload
            const items = payload?.data || []
            // Normalize: extract product and enrich with storeStock
            state.catalogue.products = items.map(item => ({
                ...item.product,
                stock: item.storeStock, // override stock with store stock
                warehouseId: item.warehouseId,
                warehouseName: item.warehouse?.name
            }))
        }
    }
})

export const { setSearchTerm, setProductList } = newSlice.actions

export default newSlice.reducer
