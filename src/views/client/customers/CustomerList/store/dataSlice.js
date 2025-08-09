import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetCustomers,
    apiDeleteCustomer,
    apiPostCustomer,
    apiPutCustomer
} from 'services/client/CustomerService'

export const getCustomers = createAsyncThunk(
    'client/customers/getCustomers',
    async () => {
        const response = await apiGetCustomers()
        return response.data
    }
)

export const postCustomer = createAsyncThunk(
    'client/customers/postCustomer',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiPostCustomer(data)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const putCustomer = createAsyncThunk(
    'client/customers/putCustomer',
    async ({id, data}, { rejectWithValue }) => {
        try {
            const response = await apiPutCustomer(id, data)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const deleteCustomer = createAsyncThunk(
    'client/customers/deleteCustomer',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiDeleteCustomer(id)
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
    name: 'client/customers/data',
    initialState: {
        loading: false,
        customerList: [],
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
        [getCustomers.fulfilled]: (state, action) => {
            state.customerList = action.payload.data.customers
            state.tableData.total = action.payload.data.total
            state.loading = false
        },
        [getCustomers.pending]: (state) => {
            state.loading = true
        },
        [postCustomer.fulfilled]: (state) => {
            state.loading = false
        },
        [postCustomer.pending]: (state) => {
            state.loading = true
        },
        [postCustomer.rejected]: (state) => {
            state.loading = false
        },
    }
})

export const { setTableData, setLoading } = dataSlice.actions

export default dataSlice.reducer
