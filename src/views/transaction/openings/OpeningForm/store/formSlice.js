import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetCashiers } from 'services/transaction/CashierService'

export const getCashiers = createAsyncThunk(
    'transaction/openings/getCashiers',
    async () => {
        const response = await apiGetCashiers()
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
        [getCashiers.fulfilled]: (state, action) => {
            state.cashierList = action.payload.data.cashiers
        }
    }
})

export default formSlice.reducer
