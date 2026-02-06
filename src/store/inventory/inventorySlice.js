import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import inventoryService from 'services/inventoryService'

export const SLICE_NAME = 'inventory'

export const stockIn = createAsyncThunk(
    SLICE_NAME + '/stockIn',
    async (data, { rejectWithValue }) => {
        try {
            const response = await inventoryService.stockIn(data)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)

const initialState = {
    loading: false,
    success: false,
    error: null,
}

const inventorySlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        resetStockInState: (state) => {
            state.loading = false
            state.success = false
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(stockIn.pending, (state) => {
                state.loading = true
                state.success = false
                state.error = null
            })
            .addCase(stockIn.fulfilled, (state) => {
                state.loading = false
                state.success = true
            })
            .addCase(stockIn.rejected, (state, action) => {
                state.loading = false
                state.success = false
                state.error = action.payload || action.error.message
            })
    },
})

export const { resetStockInState } = inventorySlice.actions

export default inventorySlice.reducer
