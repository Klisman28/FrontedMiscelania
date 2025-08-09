import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetCashiersAvailable } from 'services/transaction/CashierService'

export const getCashiersAvailable = createAsyncThunk(
    'transaction/openings/getCashiersAvailable',
    async () => {
        const response = await apiGetCashiersAvailable()
        return response.data
    }
)

const formSlice = createSlice({
    name: 'transaction/openings/form',
    initialState: {
        cashierList: [],
    },
    reducers: {},
    extraReducers: {
        [getCashiersAvailable.fulfilled]: (state, action) => {
            state.cashierList = action.payload.data
        }
    }
})

export default formSlice.reducer
