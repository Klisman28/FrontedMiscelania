import React from 'react'
import { Tooltip } from 'components/ui'
import { getStockLevel, STOCK_LEVEL_STYLES } from 'utils/stockLevel'
import { HiExclamationCircle, HiXCircle } from 'react-icons/hi'

/**
 * StockLevelBadge — reusable badge component for stock status.
 *
 * Usage:
 *   <StockLevelBadge stock={5} stockMin={10} />
 *   <StockLevelBadge stock={0} stockMin={10} showIcon />
 *   <StockLevelBadge stock={5} stockMin={10} compact />
 */
const StockLevelBadge = ({
    stock,
    stockMin,
    showIcon = false,
    compact = false,
    showQuantity = true,
    className = '',
}) => {
    const { level, label, severity } = getStockLevel(stock, stockMin)
    const styles = STOCK_LEVEL_STYLES[level]

    if (!styles) return null

    const isAlert = severity !== 'success'
    const qty = stock ?? 0
    const min = stockMin ?? 0

    const tooltipText = isAlert
        ? `${label}: ${qty} de ${min} mínimo`
        : `Stock: ${qty} | Mínimo: ${min}`

    const Icon = level === 'out_of_stock' ? HiXCircle : HiExclamationCircle

    if (compact) {
        return (
            <Tooltip title={tooltipText}>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ring-1 ${styles.bg} ${styles.text} ${styles.ring} ${className}`}>
                    {showIcon && isAlert && <Icon className="w-3 h-3" />}
                    <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
                    {showQuantity ? qty : label}
                </span>
            </Tooltip>
        )
    }

    return (
        <Tooltip title={tooltipText}>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${styles.bg} ${styles.text} ${styles.ring} ${className}`}>
                {showIcon && isAlert && <Icon className="w-3.5 h-3.5" />}
                <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
                {showQuantity && <span className="tabular-nums">{qty}</span>}
                {showQuantity && min > 0 && <span className="opacity-50">/ {min}</span>}
                {!showQuantity && label}
            </span>
        </Tooltip>
    )
}

export default StockLevelBadge
