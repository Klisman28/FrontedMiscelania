import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import warehouseService from 'services/warehouseService'

export const SLICE_NAME = 'warehouses'

export const getWarehouses = createAsyncThunk(
    SLICE_NAME + '/getWarehouses',
    async (params) => {
        const response = await warehouseService.fetchWarehouses(params)
        return response.data
    }
)

// Fetch only active stores (type = 'tienda') for sales module
export const getStores = createAsyncThunk(
    SLICE_NAME + '/getStores',
    async () => {
        const response = await warehouseService.fetchStores()
        return response.data
    }
)

export const createWarehouse = createAsyncThunk(
    SLICE_NAME + '/createWarehouse',
    async (data) => {
        const response = await warehouseService.createWarehouse(data)
        return response.data
    }
)

export const updateWarehouse = createAsyncThunk(
    SLICE_NAME + '/updateWarehouse',
    async ({ id, data }) => {
        const response = await warehouseService.updateWarehouse(id, data)
        return response.data
    }
)

export const getWarehouseStock = createAsyncThunk(
    SLICE_NAME + '/getWarehouseStock',
    async ({ id, params }) => {
        const response = await warehouseService.fetchWarehouseStock(id, params)
        return response.data
    }
)

export const deleteWarehouse = createAsyncThunk(
    SLICE_NAME + '/deleteWarehouse',
    async (id) => {
        const response = await warehouseService.deleteWarehouse(id)
        return response.data
    }
)

const initialState = {
    loading: false,
    warehouses: [],
    stores: [],       // Only tienda-type warehouses (for sales)
    stock: [],
    selectedWarehouse: null,
    error: null,
    total: 0,
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
    wsTotal: 0
}

const warehousesSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        setTableData: (state, action) => {
            state.tableData = { ...state.tableData, ...action.payload }
        },
        setSelectedWarehouse: (state, action) => {
            state.selectedWarehouse = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getWarehouses.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getWarehouses.fulfilled, (state, action) => {
                state.loading = false
                state.warehouses = action.payload.data || action.payload
                const total = action.payload.total || action.payload.meta?.total || (action.payload.data ? action.payload.data.length : 0)
                state.total = total
                state.tableData.total = total
            })
            .addCase(getWarehouses.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            // ... (rest of cases)
            .addCase(getWarehouseStock.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getWarehouseStock.fulfilled, (state, action) => {
                state.loading = false
                state.stock = action.payload.data || action.payload
                state.wsTotal = action.payload.total || 0
            })
            .addCase(getWarehouseStock.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(createWarehouse.pending, (state) => {
                state.loading = true
            })
            .addCase(createWarehouse.fulfilled, (state, action) => {
                state.loading = false
                // Optimistic update or refetch can be handled, typically refetch is triggered by UI
            })
            .addCase(createWarehouse.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(updateWarehouse.pending, (state) => {
                state.loading = true
            })
            .addCase(updateWarehouse.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(updateWarehouse.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(deleteWarehouse.pending, (state) => {
                state.loading = true
            })
            .addCase(deleteWarehouse.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(deleteWarehouse.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            // ─── Stores (tiendas only) ───
            .addCase(getStores.pending, (state) => {
                state.loading = true
            })
            .addCase(getStores.fulfilled, (state, action) => {
                state.loading = false
                state.stores = action.payload || []
            })
            .addCase(getStores.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
    },
})

export const { setSelectedWarehouse, setTableData } = warehousesSlice.actions

export default warehousesSlice.reducer
