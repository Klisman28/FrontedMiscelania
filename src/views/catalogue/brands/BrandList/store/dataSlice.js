import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetBrands,
    apiDeleteBrand,
    apiPostBrand,
    apiPutBrand
} from 'services/catalogue/BrandService'

export const getBrands = createAsyncThunk(
    'catalogue/brands/getBrands',
    async () => {
        const response = await apiGetBrands()
        return response.data
    }
)

export const postBrand = createAsyncThunk(
    'catalogue/brands/postBrand',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiPostBrand(data)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const putBrand = createAsyncThunk(
    'catalogue/brands/putBrand',
    async ({id, data}, { rejectWithValue }) => {
        try {
            const response = await apiPutBrand(id, data)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const deleteBrand = createAsyncThunk(
    'catalogue/brands/deleteBrand',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiDeleteBrand(id)
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
    name: 'catalogue/brands/data',
    initialState: {
        loading: false,
        brandList: [],
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
        [getBrands.fulfilled]: (state, action) => {
            state.brandList = action.payload.data.brands
            state.tableData.total = action.payload.data.total
            state.loading = false
        },
        [getBrands.pending]: (state) => {
            state.loading = true
        },
        [postBrand.fulfilled]: (state) => {
            state.loading = false
        },
        [postBrand.pending]: (state) => {
            state.loading = true
        },
        [postBrand.rejected]: (state) => {
            state.loading = false
        },
    }
})

export const { setTableData, setLoading } = dataSlice.actions

export default dataSlice.reducer
