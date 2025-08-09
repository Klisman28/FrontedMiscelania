import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiPostPurchas } from 'services/transaction/PurchasService'

export const postPurchas = createAsyncThunk(
    'transaction/purchases/postPurchas',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiPostPurchas(data)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

const newSlice = createSlice({
    name: 'transaction/purchases/new',
    initialState: {},
    reducers: {},
    extraReducers: {}
})

export default newSlice.reducer
