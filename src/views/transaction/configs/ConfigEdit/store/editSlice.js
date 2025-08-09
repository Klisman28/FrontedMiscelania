import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetConfig,
    apiPutConfig,
} from 'services/transaction/ConfigService'

export const getConfig = createAsyncThunk(
    'transaction/configs/getConfig',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiGetConfig(id)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const putConfig = createAsyncThunk(
    'transaction/configs/putConfig',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await apiPutConfig(id, data)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

const dataSlice = createSlice({
    name: 'catalogo/configs/data',
    initialState: {
        loading: false,
        configData: {},
    },
    reducers: {
    },
    extraReducers: {
        [getConfig.fulfilled]: (state, action) => {
            state.configData = action.payload.data
            state.loading = false
        },
        [getConfig.pending]: (state) => {
            state.loading = true
        },
        [getConfig.rejected]: (state) => {
            state.loading = false
            state.configData = {}
        },
    }
})

export default dataSlice.reducer
