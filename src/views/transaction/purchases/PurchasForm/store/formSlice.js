import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetSuppliers } from 'services/organization/SupplierService'
import { apiSearchProducts } from 'services/catalogue/ProductService'

export const getSuppliers = createAsyncThunk(
    'transaction/purchases/getSuppliers',
    async () => {
        const response = await apiGetSuppliers()
        return response.data
    }
)

export const searchProducts = createAsyncThunk(
    'transaction/purchases/searchProducts',
    async (query) => {
        const response = await apiSearchProducts(query)
        return response.data
    }
)


const newSlice = createSlice({
    name: 'transaction/categories/data',
    initialState: {
        supplierList: [],
        productList: [],
    },
    reducers: {},
    extraReducers: {
        [getSuppliers.fulfilled]: (state, action) => {
            state.supplierList = action.payload.data.suppliers
        },
        [searchProducts.fulfilled]: (state, action) => {
            state.productList = action.payload.data
        },
    }
})

export default newSlice.reducer
