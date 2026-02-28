import React, { useState } from 'react'
import { Dialog, Button, Input, toast, Notification } from 'components/ui'
import { useSelector, useDispatch } from 'react-redux'
import { setSelectedSale, toggleDeleteConfirmation } from '../store/stateSlice'
import { deleteSale, getSales } from '../store/dataSlice'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { formatGTQ } from 'utils/money'

const CancelSaleModal = () => {
    const dispatch = useDispatch()
    const dialogOpen = useSelector((state) => state.saleList.state.deleteConfirmation)
    const selectedSale = useSelector((state) => state.saleList.state.selectedSale)

    const [reason, setReason] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const onDialogClose = () => {
        dispatch(toggleDeleteConfirmation(false))
        setReason('')
        setError(false)
    }

    const onCancel = async () => {
        if (!reason.trim()) {
            setError(true)
            return
        }

        setLoading(true)
        try {
            // Pasamos `reason` si tu endpoint deleteSale() / patch soporta el motivo.
            // Actualmente se llama deleteSale(id). Si puedes modificar deleteSale 
            // agrégale { id: selectedSale.id, reason }. 
            // Para asegurar comptatibilidad asumo que se pasa id:
            const res = await dispatch(deleteSale(selectedSale.id))

            const { message, type } = res.payload || {}

            if (type === 'success' || res.meta?.requestStatus === 'fulfilled') {
                dispatch(getSales())
                dispatch(setSelectedSale({}))
                toast.push(
                    <Notification title="Anulación exitosa" type="success" duration={3000}>
                        {message || 'La venta y su inventario han sido revertidos correctamente.'}
                    </Notification>,
                    { placement: 'top-center' }
                )
                onDialogClose()
            } else {
                toast.push(
                    <Notification title="Anulación fallida" type="danger" duration={3000}>
                        {message || 'No se pudo anular la venta.'}
                    </Notification>,
                    { placement: 'top-center' }
                )
            }
        } catch (err) {
            toast.push(
                <Notification title="Error inesperado" type="danger" duration={3000}>
                    Verifique su conexión e inténtelo de nuevo.
                </Notification>,
                { placement: 'top-center' }
            )
        } finally {
            setLoading(false)
        }
    }

    if (!selectedSale || !selectedSale.id) return null

    return (
        <Dialog
            isOpen={dialogOpen}
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            className="mt-20"
            contentClassName="pb-0"
        >
            <div className="flex flex-col h-full">
                <div className="flex gap-4">
                    <div className="flex justify-center items-center h-12 w-12 rounded-full bg-red-100 text-red-600 flex-shrink-0">
                        <HiOutlineExclamationCircle className="text-2xl" />
                    </div>
                    <div>
                        <h4 className="mb-2 text-slate-800 font-bold">Anular Venta #{selectedSale.id}</h4>
                        <div className="text-sm text-slate-500 mb-4 bg-slate-50 p-4 rounded-xl ring-1 ring-slate-100">
                            Esta acción <strong>revertirá todo el inventario</strong> asociado a esta venta y la marcará como ANULADA. <br /><br />
                            <strong>Fecha de venta:</strong> {selectedSale.dateIssue}<br />
                            <strong>Total:</strong> {formatGTQ(selectedSale.total || 0)}
                        </div>
                    </div>
                </div>

                <div className="mt-4 mb-6 px-[64px]">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Motivo de anulación <span className="text-red-500">*</span>
                    </label>
                    <Input
                        textArea
                        placeholder="Ej: El cliente devolvió los productos..."
                        value={reason}
                        onChange={(e) => {
                            setReason(e.target.value)
                            if (e.target.value.trim()) setError(false)
                        }}
                        className={error ? 'border-red-500 bg-red-50 focus:ring-red-500' : ''}
                    />
                    {error && <span className="text-red-500 text-xs font-medium mt-1 inline-block">El motivo es obligatorio</span>}
                </div>

                <div className="text-right flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                    <Button
                        size="sm"
                        variant="plain"
                        onClick={onDialogClose}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        size="sm"
                        variant="solid"
                        onClick={onCancel}
                        className="bg-red-600 hover:bg-red-700 text-white"
                        loading={loading}
                    >
                        Sí, anular venta
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default CancelSaleModal
