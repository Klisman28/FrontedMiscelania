import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetCustomers } from 'services/client/CustomerService'
import { apiGetEnterprises } from 'services/client/EnterpriseService'
import { apiGetConfigs } from 'services/transaction/ConfigService'
import { apiSearchProducts, apiGetProducts } from 'services/catalogue/ProductService'
import { apiGetSubcategories } from 'services/catalogue/SubcategoryService'
import { apiGetNextTicket } from 'services/transaction/TicketService'
import { apiGetBrands } from 'services/catalogue/BrandService'
import { apiGetCategories } from 'services/catalogue/CategoryService'

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

export const searchProducts = createAsyncThunk(
    'transaction/sales/searchProducts',
    async (query) => {
        const response = await apiSearchProducts(query)
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
            state.productList = action.payload.data
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
        }
    }
})

export const { setSearchTerm, setProductList } = newSlice.actions

export default newSlice.reducer
