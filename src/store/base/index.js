import { combineReducers } from '@reduxjs/toolkit'
import common from './commonSlice'
import company from './companySlice'

const reducer = combineReducers({
    common,
    company,
})

export default reducer
