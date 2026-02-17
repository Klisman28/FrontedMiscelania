import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getBrands, getCategories, getSubcategories, getProductUnits } from '../../services/catalogue/catalogs.api'

// Helper for delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper for fetching all
const fetchAllData = async () => {
    // Using Promise.allSettled as requested
    const results = await Promise.allSettled([
        getBrands(),
        getCategories(),
        getSubcategories(),
        getProductUnits()
    ]);

    // Check if any critical catalog failed. We treat all as critical here.
    const errors = results.filter(r => r.status === 'rejected');
    if (errors.length > 0) {
        throw new Error('Some catalogs failed to load.');
    }

    // Extract values. Assuming Axios response -> .data
    return {
        brands: results[0].value.data,
        categories: results[1].value.data,
        subcategories: results[2].value.data,
        units: results[3].value.data
    };
};

export const getCatalogs = createAsyncThunk(
    'catalogs/get',
    async (_, { rejectWithValue }) => {
        try {
            return await fetchAllData();
        } catch (error) {
            console.warn('Catalogs fetch failed, retrying in 800ms...');
            await delay(800);
            try {
                return await fetchAllData();
            } catch (retryError) {
                return rejectWithValue('Failed to load catalogs after retry.');
            }
        }
    }
)

const initialState = {
    loading: false,
    error: null,
    brands: [],
    categories: [],
    subcategories: [],
    units: [],
    loaded: false
}

const catalogsSlice = createSlice({
    name: 'catalogs',
    initialState,
    reducers: {
        resetCatalogs: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCatalogs.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getCatalogs.fulfilled, (state, action) => {
                state.loading = false
                state.loaded = true
                state.brands = action.payload.brands || []
                state.categories = action.payload.categories || []
                state.subcategories = action.payload.subcategories || []
                state.units = action.payload.units || []
            })
            .addCase(getCatalogs.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export const { resetCatalogs } = catalogsSlice.actions

export default catalogsSlice.reducer
