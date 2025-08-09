import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetOpenings,
    apiDeleteOpening,
    apiPostOpening,
    apiPutOpening,
    apiGetOpeningCurrent
} from 'services/transaction/OpeningService'

export const getOpenings = createAsyncThunk(
    'transaction/openings/getOpenings',
    async () => {
        const response = await apiGetOpenings()
        return response.data
    }
)

export const getOpeningCurrent = createAsyncThunk(
    'transaction/openings/getOpeningCurrent',
    async () => {
        const response = await apiGetOpeningCurrent()
        return response.data
    }
)

export const postOpening = createAsyncThunk(
    'transaction/openings/postOpening',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiPostOpening(data)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const putOpening = createAsyncThunk(
    'transaction/openings/putOpening',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await apiPutOpening(id, data)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const deleteOpening = createAsyncThunk(
    'transaction/openings/deleteOpening',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiDeleteOpening(id)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

const dataSlice = createSlice({
    name: 'transaction/openings/data',
    initialState: {
        loading: false,
        openingData: {}
    },
    reducers: {
        setLoading: (state, action) => {
            console.log(action.payload);
            state.loading = action.payload
        },
        resetOpeningData: (state) => {
            state.openingData = {}
        }
    },
    extraReducers: {
        [getOpeningCurrent.fulfilled]: (state, action) => {
            state.openingData = action.payload.data
            state.loading = false
        },
        [getOpeningCurrent.pending]: (state) => {
            state.loading = true
        },
        [postOpening.fulfilled]: (state) => {
            state.loading = false
        },
        [postOpening.pending]: (state) => {
            state.loading = true
        },
        [postOpening.rejected]: (state) => {
            state.loading = false
        },
    }
})

export const { setLoading, resetOpeningData } = dataSlice.actions

export default dataSlice.reducer
