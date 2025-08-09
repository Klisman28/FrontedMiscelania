import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { actions } from 'react-table'
import { apiGetPurchas } from 'services/transaction/PurchasService'

export const getPurchas = createAsyncThunk(
    'transaction/purchases/getPurchas',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiGetPurchas(id)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

const newSlice = createSlice({
    name: 'transaction/purchases/show',
    initialState: {
        purchasData: {},
        loading: false
    },
    reducers: {},
    extraReducers: {
        [getPurchas.fulfilled]: (state, action) => {
            state.purchasData = action.payload.data
        }
    }
})

export default newSlice.reducer
