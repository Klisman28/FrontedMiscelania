import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import inventoryService from 'services/inventoryService'

export const SLICE_NAME = 'transfers'

export const fetchTransfers = createAsyncThunk(
    SLICE_NAME + '/fetchTransfers',
    async (params) => {
        const response = await inventoryService.getTransfers(params)
        console.log('fetchTransfers response:', response)
        return response.data
    }
)

export const fetchTransferById = createAsyncThunk(
    SLICE_NAME + '/fetchTransferById',
    async (id) => {
        const response = await inventoryService.getTransferById(id)
        return response.data
    }
)

export const createTransfer = createAsyncThunk(
    SLICE_NAME + '/createTransfer',
    async (data, { rejectWithValue }) => {
        try {
            const response = await inventoryService.createTransfer(data)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data.message || error.message)
        }
    }
)

const initialState = {
    loadingList: false,
    list: [],
    errorList: null,
    tableData: {
        pageIndex: 1,
        pageSize: 10,
        sort: {
            order: '',
            key: ''
        },
        query: '',
        total: 0
    },

    loadingCurrent: false,
    current: null,
    errorCurrent: null,

    creating: false,
    createSuccess: false,
    errorCreate: null
}

const transfersSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        resetCreateState: (state) => {
            state.creating = false
            state.createSuccess = false
            state.errorCreate = null
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Transfers
            .addCase(fetchTransfers.pending, (state) => {
                state.loadingList = true
                state.errorList = null
            })
            .addCase(fetchTransfers.fulfilled, (state, action) => {
                state.loadingList = false
                state.list = action.payload.data || action.payload
                state.tableData.total = action.payload.total || (action.payload.data ? action.payload.data.length : 0)
                state.total = action.payload.total || 0
            })
            .addCase(fetchTransfers.rejected, (state, action) => {
                state.loadingList = false
                state.errorList = action.error.message
            })

            // Fetch Transfer By Id
            .addCase(fetchTransferById.pending, (state) => {
                state.loadingCurrent = true
                state.errorCurrent = null
            })
            .addCase(fetchTransferById.fulfilled, (state, action) => {
                state.loadingCurrent = false
                state.current = action.payload
            })
            .addCase(fetchTransferById.rejected, (state, action) => {
                state.loadingCurrent = false
                state.errorCurrent = action.error.message
            })

            // Create Transfer
            .addCase(createTransfer.pending, (state) => {
                state.creating = true
                state.createSuccess = false
                state.errorCreate = null
            })
            .addCase(createTransfer.fulfilled, (state) => {
                state.creating = false
                state.createSuccess = true
            })
            .addCase(createTransfer.rejected, (state, action) => {
                state.creating = false
                state.createSuccess = false
                state.errorCreate = action.payload || action.error.message
            })
    },
})

export const { resetCreateState, setTableData } = transfersSlice.actions

export default transfersSlice.reducer
