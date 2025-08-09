import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetProduct,
    apiPutProduct,
} from 'services/catalogue/ProductService'

export const getProduct = createAsyncThunk(
    'catalogue/products/getProduct',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiGetProduct(id)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const putProduct = createAsyncThunk(
    'catalogue/products/putProduct',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await apiPutProduct(id, data)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

const dataSlice = createSlice({
    name: 'catalogo/products/data',
    initialState: {
        loading: false,
        productData: {},

    },
    reducers: {
    },
    extraReducers: {
        [getProduct.fulfilled]: (state, action) => {
            state.productData = action.payload.data
            state.loading = false
        },
        [getProduct.pending]: (state) => {
            state.loading = true
        },
        [getProduct.rejected]: (state) => {
            state.loading = false
            state.productData = {}
        },
    }
})

export default dataSlice.reducer
