import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetCategories,
    apiDeleteCategory,
    apiPostCategory,
    apiPutCategory
} from 'services/catalogue/CategoryService'

export const getCategories = createAsyncThunk(
    'catalogue/categories/getCategories',
    async () => {
        const response = await apiGetCategories()
        return response.data
    }
)

export const postCategory = createAsyncThunk(
    'catalogue/categories/postCategory',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiPostCategory(data)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const putCategory = createAsyncThunk(
    'catalogue/categories/putCategory',
    async ({id, data}, { rejectWithValue }) => {
        try {
            const response = await apiPutCategory(id, data)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const deleteCategory = createAsyncThunk(
    'catalogue/categories/deleteCategory',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiDeleteCategory(id)
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
    name: 'catalogue/categories/data',
    initialState: {
        loading: false,
        categoryList: [],
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
        [getCategories.fulfilled]: (state, action) => {
            state.categoryList = action.payload.data.categories
            state.tableData.total = action.payload.data.total
            state.loading = false
        },
        [getCategories.pending]: (state) => {
            state.loading = true
        },
        [postCategory.fulfilled]: (state) => {
            state.loading = false
        },
        [postCategory.pending]: (state) => {
            state.loading = true
        },
        [postCategory.rejected]: (state) => {
            state.loading = false
        },
    }
})

export const { setTableData, setLoading } = dataSlice.actions

export default dataSlice.reducer
