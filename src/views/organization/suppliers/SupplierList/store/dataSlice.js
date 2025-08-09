import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetSuppliers,
    apiDeleteSupplier,
    apiPostSupplier,
    apiPutSupplier
} from 'services/organization/SupplierService'

export const getSuppliers = createAsyncThunk(
    'organization/suppliers/getSuppliers',
    async () => {
        const response = await apiGetSuppliers()
        return response.data
    }
)

export const postSupplier = createAsyncThunk(
    'organization/suppliers/postSupplier',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiPostSupplier(data)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const putSupplier = createAsyncThunk(
    'organization/suppliers/putSupplier',
    async ({id, data}, { rejectWithValue }) => {
        try {
            const response = await apiPutSupplier(id, data)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const deleteSupplier = createAsyncThunk(
    'organization/suppliers/deleteSupplier',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiDeleteSupplier(id)
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
    name: 'organization/suppliers/data',
    initialState: {
        loading: false,
        supplierList: [],
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
        [getSuppliers.fulfilled]: (state, action) => {
            state.supplierList = action.payload.data.suppliers
            state.tableData.total = action.payload.data.total
            state.loading = false
        },
        [getSuppliers.pending]: (state) => {
            state.loading = true
        },
        [postSupplier.fulfilled]: (state) => {
            state.loading = false
        },
        [postSupplier.pending]: (state) => {
            state.loading = true
        },
        [postSupplier.rejected]: (state) => {
            state.loading = false
        },
    }
})

export const { setTableData, setLoading } = dataSlice.actions

export default dataSlice.reducer
