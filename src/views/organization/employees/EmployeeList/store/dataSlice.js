import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetEmployees,
    apiDeleteEmployee,
    apiPostEmployee,
    apiPutEmployee
} from 'services/organization/EmployeeService'

export const getEmployees = createAsyncThunk(
    'organization/employees/getEmployees',
    async () => {
        const response = await apiGetEmployees()
        return response.data
    }
)

export const postEmployee = createAsyncThunk(
    'organization/employees/postEmployee',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiPostEmployee(data)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const putEmployee = createAsyncThunk(
    'organization/employees/putEmployee',
    async ({id, data}, { rejectWithValue }) => {
        try {
            const response = await apiPutEmployee(id, data)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const deleteEmployee = createAsyncThunk(
    'organization/employees/deleteEmployee',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiDeleteEmployee(id)
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
    name: 'organization/employees/data',
    initialState: {
        loading: false,
        employeeList: [],
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
        [getEmployees.fulfilled]: (state, action) => {
            state.employeeList = action.payload.data.employees
            state.tableData.total = action.payload.data.total
            state.loading = false
        },
        [getEmployees.pending]: (state) => {
            state.loading = true
        },
        [postEmployee.fulfilled]: (state) => {
            state.loading = false
        },
        [postEmployee.pending]: (state) => {
            state.loading = true
        },
        [postEmployee.rejected]: (state) => {
            state.loading = false
        },
    }
})

export const { setTableData, setLoading } = dataSlice.actions

export default dataSlice.reducer
