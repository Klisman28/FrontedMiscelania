import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetConfigs } from 'services/transaction/ConfigService'
import { getOrFetchConfigSignedUrl } from 'services/uploadsService'

export const fetchCompanyConfig = createAsyncThunk(
    'base/company/fetchConfig',
    async (_, { rejectWithValue }) => {
        try {
            const res = await apiGetConfigs()
            const config = res.data?.data || res.data
            let logoSignedUrl = null
            if (config?.logoKey) {
                logoSignedUrl = await getOrFetchConfigSignedUrl(config.logoKey)
            }
            return {
                companyName: config?.companyName || '',
                logoKey: config?.logoKey || null,
                logoSignedUrl,
            }
        } catch (err) {
            return rejectWithValue(err.message)
        }
    }
)

const companySlice = createSlice({
    name: 'base/company',
    initialState: {
        companyName: '',
        logoKey: null,
        logoSignedUrl: null,
        loaded: false,
    },
    reducers: {
        setCompanyInfo: (state, action) => {
            const { companyName, logoKey, logoSignedUrl } = action.payload
            if (companyName !== undefined) state.companyName = companyName
            if (logoKey !== undefined) state.logoKey = logoKey
            if (logoSignedUrl !== undefined) state.logoSignedUrl = logoSignedUrl
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCompanyConfig.fulfilled, (state, action) => {
            state.companyName = action.payload.companyName
            state.logoKey = action.payload.logoKey
            state.logoSignedUrl = action.payload.logoSignedUrl
            state.loaded = true
        })
    },
})

export const { setCompanyInfo } = companySlice.actions
export default companySlice.reducer
