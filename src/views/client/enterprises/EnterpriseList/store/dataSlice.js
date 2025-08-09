import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetEnterprises,
    apiDeleteEnterprise,
    apiPostEnterprise,
    apiPutEnterprise
} from 'services/client/EnterpriseService'

export const getEnterprises = createAsyncThunk(
    'client/enterprises/getEnterprises',
    async () => {
        const response = await apiGetEnterprises()
        return response.data
    }
)

export const postEnterprise = createAsyncThunk(
    'client/enterprises/postEnterprise',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiPostEnterprise(data)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const putEnterprise = createAsyncThunk(
    'client/enterprises/putEnterprise',
    async ({id, data}, { rejectWithValue }) => {
        try {
            const response = await apiPutEnterprise(id, data)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const deleteEnterprise = createAsyncThunk(
    'client/enterprises/deleteEnterprise',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiDeleteEnterprise(id)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const initialTableData = {
    total: 0,
    initialPageIndex: 0,
    initialPageSize: 5,
}

const dataSlice = createSlice({
    name: 'client/enterprises/data',
    initialState: {
        loading: false,
        enterpriseList: [],
        tableData: initialTableData,
    },
    reducers: {
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        setLoading: (state, action) => {
            console.log(action.payload);
            state.loading = action.payload
        }
    },
    extraReducers: {
        [getEnterprises.fulfilled]: (state, action) => {
            state.enterpriseList = action.payload.data.enterprises
            state.tableData.total = action.payload.data.total
            state.loading = false
        },
        [getEnterprises.pending]: (state) => {
            state.loading = true
        },
        [postEnterprise.fulfilled]: (state) => {
            state.loading = false
        },
        [postEnterprise.pending]: (state) => {
            state.loading = true
        },
        [postEnterprise.rejected]: (state) => {
            state.loading = false
        },
    }
})

export const { setTableData, setLoading } = dataSlice.actions

export default dataSlice.reducer
