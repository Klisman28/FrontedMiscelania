import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiPostSale } from 'services/transaction/SaleService'
import { apiGetOpeningCurrent } from 'services/transaction/OpeningService'

export const postSale = createAsyncThunk(
    'transaction/sales/postSale',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiPostSale(data)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const getOpeningCurrent = createAsyncThunk(
    'transaction/openings/getOpeningCurrent',
    async () => {
        const response = await apiGetOpeningCurrent()
        return response.data
    }
)

const newSlice = createSlice({
    name: 'transaction/sales/new',
    initialState: {
        openingData: {}
    },
    reducers: {},
    extraReducers: {
        [getOpeningCurrent.fulfilled]: (state, action) => {
            state.openingData = action.payload.data
            state.loading = false
        },
        [getOpeningCurrent.rejected]: (state, action) => {
            state.openingData = {}
        }
    }
})

export default newSlice.reducer
