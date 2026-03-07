/**
 * Centralized stock-level calculation for frontend.
 * Mirrors the backend logic in utils/stockLevel.js
 */

export const STOCK_LEVELS = {
    OUT_OF_STOCK: 'out_of_stock',
    LOW_STOCK: 'low_stock',
    NORMAL: 'normal',
}

export function getStockLevel(stock, stockMin) {
    const qty = stock ?? 0
    const min = stockMin ?? 0

    if (qty <= 0) {
        return {
            level: STOCK_LEVELS.OUT_OF_STOCK,
            label: 'Agotado',
            severity: 'danger',
        }
    }

    if (min > 0 && qty <= min) {
        return {
            level: STOCK_LEVELS.LOW_STOCK,
            label: 'Stock Bajo',
            severity: 'warning',
        }
    }

    return {
        level: STOCK_LEVELS.NORMAL,
        label: 'Normal',
        severity: 'success',
    }
}

/**
 * Tailwind classes for each stock severity level
 */
export const STOCK_LEVEL_STYLES = {
    [STOCK_LEVELS.OUT_OF_STOCK]: {
        dot: 'bg-red-500',
        bg: 'bg-red-50',
        text: 'text-red-700',
        ring: 'ring-red-600/20',
        icon: 'text-red-500',
        badgeBg: 'bg-red-100',
        badgeText: 'text-red-700',
    },
    [STOCK_LEVELS.LOW_STOCK]: {
        dot: 'bg-amber-500',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        ring: 'ring-amber-600/20',
        icon: 'text-amber-500',
        badgeBg: 'bg-amber-100',
        badgeText: 'text-amber-700',
    },
    [STOCK_LEVELS.NORMAL]: {
        dot: 'bg-emerald-500',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        ring: 'ring-emerald-600/20',
        icon: 'text-emerald-500',
        badgeBg: 'bg-emerald-100',
        badgeText: 'text-emerald-700',
    },
}
