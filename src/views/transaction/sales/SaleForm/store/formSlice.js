import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetCustomers } from 'services/client/CustomerService'
import { apiGetEnterprises } from 'services/client/EnterpriseService'
import { apiGetConfigs } from 'services/transaction/ConfigService'
import { apiSearchProducts } from 'services/catalogue/ProductService'
import { apiGetNextTicket } from 'services/transaction/TicketService'

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
    },
    reducers: {},
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
    }
})

export default newSlice.reducer
