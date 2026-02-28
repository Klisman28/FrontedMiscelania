import React, { useState, useRef, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { HiOutlineEye, HiOutlinePrinter, HiDotsVertical } from 'react-icons/hi'
import { AiOutlineStop } from 'react-icons/ai'
import { BsArrowReturnLeft } from 'react-icons/bs'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setSelectedSale, toggleDeleteConfirmation, setShowDialogOpen } from '../store/stateSlice'
import useThemeClass from 'utils/hooks/useThemeClass'
import { apiReturnSale } from 'services/transaction/SaleService'
import { getSales } from '../store/dataSlice'

const PortalMenu = ({ anchorRef, open, onClose, children }) => {
    const menuRef = useRef(null)
    const [pos, setPos] = useState({ top: 0, left: 0 })

    useEffect(() => {
        if (!open || !anchorRef.current) return
        const rect = anchorRef.current.getBoundingClientRect()
        const menuW = 208
        let left = rect.right - menuW
        let top = rect.bottom + 4
        if (left < 8) left = 8
        if (top + 200 > window.innerHeight) {
            top = rect.top - 4
        }
        setPos({ top, left })
    }, [open, anchorRef])

    useEffect(() => {
        if (!open) return
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target) &&
                anchorRef.current && !anchorRef.current.contains(e.target)) {
                onClose()
            }
        }
        document.addEventListener('mousedown', handler, true)
        return () => document.removeEventListener('mousedown', handler, true)
    }, [open, onClose, anchorRef])

    useEffect(() => {
        if (!open) return
        const handler = (e) => { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', handler, true)
        return () => document.removeEventListener('keydown', handler, true)
    }, [open, onClose])

    if (!open) return null

    return createPortal(
        <div
            ref={menuRef}
            className="fixed z-[9999] w-52 py-1.5 rounded-lg shadow-xl bg-white ring-1 ring-black/5 animate-in fade-in"
            style={{ top: pos.top, left: pos.left, animation: 'portalMenuIn 120ms ease-out' }}
            role="menu"
        >
            {children}
        </div>,
        document.body
    )
}

const MenuItem = ({ icon, label, onClick, className = '', danger = false, disabled = false }) => (
    <button
        type="button"
        role="menuitem"
        onClick={onClick}
        disabled={disabled}
        className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium transition-colors outline-none
			${danger ? 'text-red-500 hover:bg-red-50 hover:text-red-600' : className || 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}
			${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
    >
        {icon}
        {label}
    </button>
)

const MenuDivider = () => <div className="my-1 border-t border-slate-100" />

const SaleRowActions = ({ row }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { textTheme } = useThemeClass()

    const [menuOpen, setMenuOpen] = useState(false)
    const triggerRef = useRef(null)

    const closeMenu = useCallback(() => setMenuOpen(false), [])

    const status = row.deletedAt || row.status === 3 ? 'ANULADA' : (row.status === 2 ? 'DEVUELTA' : 'COMPLETADA')
    const isAnnulled = status === 'ANULADA'
    const isReturned = status === 'DEVUELTA'

    const onEdit = () => {
        closeMenu()
        dispatch(setSelectedSale(row))
        dispatch(setShowDialogOpen(true))
    }

    const onPrint = () => {
        closeMenu()
        navigate(`/transacciones/ventas/${row.id}/imprimir`)
    }

    const onAnnul = () => {
        closeMenu()
        dispatch(setSelectedSale(row))
        dispatch(toggleDeleteConfirmation(true))
    }

    const onReturn = async () => {
        closeMenu()
        try {
            await apiReturnSale(row.id)
            dispatch(getSales())
            console.log('Devolución realizada con éxito')
        } catch (error) {
            console.error('Error al devolver la venta', error)
        }
    }

    return (
        <div className="flex justify-end items-center gap-2">
            {/* Acción primaria (Ojo) */}
            <button
                onClick={onEdit}
                className={`p-2 rounded-full transition-colors text-slate-400 hover:bg-slate-100 hover:${textTheme}`}
                title="Ver Venta"
            >
                <HiOutlineEye className="text-lg" />
            </button>

            {/* Menú Dropdown (...) */}
            <button
                ref={triggerRef}
                onClick={() => setMenuOpen(p => !p)}
                className="p-2 rounded-full transition-colors text-slate-400 hover:text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            >
                <HiDotsVertical className="text-lg" />
            </button>

            <PortalMenu anchorRef={triggerRef} open={menuOpen} onClose={closeMenu}>
                <MenuItem
                    icon={<HiOutlinePrinter className="text-lg" />}
                    label="Imprimir Venta"
                    onClick={onPrint}
                    disabled={isAnnulled}
                />

                {/* Devolución si el cliente lo requiere, asumo habilitada excepto anuladas/devueltas */}
                {!isAnnulled && !isReturned && (
                    <MenuItem
                        icon={<BsArrowReturnLeft className="text-lg" />}
                        label="Devolver"
                        onClick={onReturn}
                        className="text-blue-600 hover:bg-blue-50"
                    />
                )}

                <MenuDivider />

                <MenuItem
                    icon={<AiOutlineStop className="text-lg" />}
                    label={isAnnulled ? "Ya anulada" : "Anular Venta"}
                    onClick={onAnnul}
                    danger
                    disabled={isAnnulled}
                />
            </PortalMenu>
        </div>
    )
}

export default SaleRowActions
