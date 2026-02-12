import appConfig from 'configs/app.config'

// Currency configuration
export const CURRENCY_SYMBOL = appConfig.currencySymbol || 'Q'

// Format currency value
export const formatCurrency = (value) => {
    const numValue = parseFloat(value) || 0
    return `${CURRENCY_SYMBOL}${numValue.toFixed(2)}`
}

// Parse currency value (remove symbol and parse)
export const parseCurrency = (value) => {
    if (typeof value === 'number') return value
    if (typeof value === 'string') {
        return parseFloat(value.replace(CURRENCY_SYMBOL, '').trim()) || 0
    }
    return 0
}
