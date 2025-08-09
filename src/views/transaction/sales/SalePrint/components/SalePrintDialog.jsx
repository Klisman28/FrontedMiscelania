import React, { useState } from 'react'
import { Button, Dialog } from 'components/ui'
import { useSelector, useDispatch } from 'react-redux'
import { setPrintDialogOpen } from '../store/printSlice'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'

const SalePrintDialog = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const printDialogOpen = useSelector((state) => state.salePrint.data.printDialogOpen)
    const saleData = useSelector((state) => state.salePrint.data.saleData)

    const onDialogClose = e => {
        dispatch(setPrintDialogOpen(false))
        navigate('/transacciones/mis-ventas')
    }

    return (
        <Dialog
            isOpen={printDialogOpen}
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            width={1000}
            height="full"
        >
            <div className="">
                Comprobante de venta
            </div>
        </Dialog>
    )
}

export default SalePrintDialog
