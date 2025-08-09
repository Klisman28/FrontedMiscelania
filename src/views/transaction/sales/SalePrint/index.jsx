import React from 'react'
import { toast, Notification } from 'components/ui'
import { useParams } from 'react-router-dom'
import { getSale, setPrintDialogOpen } from './store/printSlice'
import { injectReducer } from 'store/index'
import reducer from './store'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import SalePrintDialog from './components/SalePrintDialog'

injectReducer('salePrint', reducer)

const SalePrint = () => {

    const { saleId } = useParams()

    const dispatch = useDispatch()

    const fetchData = async () => {
        await dispatch(getSale(saleId))
    }

    useEffect(() => {
        dispatch(setPrintDialogOpen(true))
        if (saleId !== undefined) {
            fetchData()
        }
    }, [])

    return (
        <>
           <SalePrintDialog />
        </>
    )
}

export default SalePrint