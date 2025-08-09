import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetProducts,
    apiDeleteProduct,
} from 'services/catalogue/ProductService'

export const getProducts = createAsyncThunk(
    'catalogue/products/getProducts',
    async () => {
        const response = await apiGetProducts()
        return response.data
    }
)

export const deleteProduct = createAsyncThunk(
    'catalogue/products/deleteProduct',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiDeleteProduct(id)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const initialTableData = {
    total: 0,
    initialPageIndex: 0,
    initialPageSize: 5,
}

const dataSlice = createSlice({
    name: 'catalogue/products/data',
    initialState: {
        loading: false,
        productList: [],
        tableData: initialTableData,
    },
    reducers: {
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        setLoading: (state, action) => {
            console.log(action.payload);
            state.loading = action.payload
        }
    },
    extraReducers: {
        [getProducts.fulfilled]: (state, action) => {
            state.productList = action.payload.data.products
            state.tableData.total = action.payload.data.total
            state.loading = false
        },
        [getProducts.pending]: (state) => {
            state.loading = true
        }
    }
})

export const { setTableData, setLoading } = dataSlice.actions

export default dataSlice.reducer
