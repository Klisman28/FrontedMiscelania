import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiPostProduct } from 'services/catalogue/ProductService'

export const postProduct = createAsyncThunk(
    'catalogue/products/postProduct',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiPostProduct(data)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

const newSlice = createSlice({
    name: 'catalogue/categories/new',
    initialState: {
        subcategoryList: [],
        brandList: [],
        unitList: [],
    },
    reducers: {},
    extraReducers: {}
})

export default newSlice.reducer
