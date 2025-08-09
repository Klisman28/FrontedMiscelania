import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiPostConfig } from 'services/transaction/ConfigService'
import { apiGetConfigs } from 'services/transaction/ConfigService'

export const postConfig = createAsyncThunk(
    'catalogue/configs/postConfig',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiPostConfig(data)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const getConfig = createAsyncThunk(
    'transaction/sales/getConfig',
    async () => {
        const response = await apiGetConfigs()
        return response.data
    }
)

const newSlice = createSlice({
    name: 'catalogue/configs/new',
    initialState: {
        subcategoryList: [],
        brandList: [],
        unitList: [],
        configData: {}
    },
    reducers: {},
    extraReducers: {
        [getConfig.fulfilled]: (state, action) => {
            state.configData = action.payload.data
        },
    }
})

export default newSlice.reducer
