import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetUsers,
    apiDeleteUser,
    apiPostUser,
    apiPutUser,
    apiGetUserRoles
} from 'services/organization/UserService'
import { apiGetEmployees } from 'services/organization/EmployeeService'

export const getUsers = createAsyncThunk(
    'organization/users/getUsers',
    async () => {
        const response = await apiGetUsers()
        return response.data
    }
)

export const postUser = createAsyncThunk(
    'organization/users/postUser',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiPostUser(data)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const putUser = createAsyncThunk(
    'organization/users/putUser',
    async ({id, data}, { rejectWithValue }) => {
        try {
            const response = await apiPutUser(id, data)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const deleteUser = createAsyncThunk(
    'organization/users/deleteUser',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiDeleteUser(id)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const getEmployees = createAsyncThunk(
    'organization/users/getEmployees',
    async () => {
        const response = await apiGetEmployees()
        return response.data
    }
)

export const getUserRoles = createAsyncThunk(
    'organization/users/getUserRoles',
    async () => {
        const response = await apiGetUserRoles()
        return response.data
    }
)

export const initialTableData = {
    total: 0,
    initialPageIndex: 0,
    initialPageSize: 5,
}

const dataSlice = createSlice({
    name: 'organization/users/data',
    initialState: {
        loading: false,
        userList: [],
        tableData: initialTableData,
        employeeList: [],
        roleList: []
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
        [getUsers.fulfilled]: (state, action) => {
            state.userList = action.payload.data.users
            state.tableData.total = action.payload.data.total
            state.loading = false
        },
        [getUsers.pending]: (state) => {
            state.loading = true
        },
        [postUser.fulfilled]: (state) => {
            state.loading = false
        },
        [postUser.pending]: (state) => {
            state.loading = true
        },
        [postUser.rejected]: (state) => {
            state.loading = false
        },
        [getEmployees.fulfilled]: (state, action) => {
            state.employeeList = action.payload.data.employees
        },
        [getUserRoles.fulfilled]: (state, action) => {
            state.roleList = action.payload.data
        },
    }
})

export const { setTableData, setLoading } = dataSlice.actions

export default dataSlice.reducer
