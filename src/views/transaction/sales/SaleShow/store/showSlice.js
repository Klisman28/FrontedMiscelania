import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetSale } from 'services/transaction/SaleService'

export const getSale = createAsyncThunk(
    'transaction/sales/getSale',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiGetSale(id)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

const newSlice = createSlice({
    name: 'transaction/sales/show',
    initialState: {
        saleData: {},
        loading: false
    },
    reducers: {},
    extraReducers: {
        [getSale.fulfilled]: (state, action) => {
            state.saleData = action.payload.data
        }
    }
})

export default newSlice.reducer
