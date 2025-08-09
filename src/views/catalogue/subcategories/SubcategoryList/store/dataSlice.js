import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetCategories } from 'services/catalogue/CategoryService'
import {
    apiGetSubcategories,
    apiDeleteSubcategory,
    apiPostSubcategory,
    apiPutSubcategory
} from 'services/catalogue/SubcategoryService'

export const getSubcategories = createAsyncThunk(
    'catalogue/subcategories/getSubcategories',
    async () => {
        const response = await apiGetSubcategories()
        return response.data
    }
)

export const postSubcategory = createAsyncThunk(
    'catalogue/subcategories/postSubcategory',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiPostSubcategory(data)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const putSubcategory = createAsyncThunk(
    'catalogue/subcategories/putSubcategory',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await apiPutSubcategory(id, data)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const deleteSubcategory = createAsyncThunk(
    'catalogue/subcategories/deleteSubcategory',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiDeleteSubcategory(id)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const getCategories = createAsyncThunk(
    'catalogue/subcategories/getCategories',
    async () => {
        const response = await apiGetCategories()
        return response.data
    }
)

export const initialTableData = {
    total: 0,
    initialPageIndex: 0,
    initialPageSize: 5,
}

const dataSlice = createSlice({
    name: 'catalogue/subcategories/data',
    initialState: {
        loading: false,
        subcategoryList: [],
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
        [getSubcategories.fulfilled]: (state, action) => {
            state.subcategoryList = action.payload.data.subcategories
            state.tableData.total = action.payload.data.total
            state.loading = false
        },
        [getSubcategories.pending]: (state) => {
            state.loading = true
        },
        [postSubcategory.fulfilled]: (state) => {
            state.loading = false
        },
        [postSubcategory.pending]: (state) => {
            state.loading = true
        },
        [postSubcategory.rejected]: (state) => {
            state.loading = false
        },
    }
})

export const { setTableData, setLoading } = dataSlice.actions

export default dataSlice.reducer
