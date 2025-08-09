import React from 'react'
import { toast, Notification } from 'components/ui'
import { useParams } from 'react-router-dom'
import { getSale } from './store/showSlice'
import { injectReducer } from 'store/index'
import reducer from './store'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'

injectReducer('saleShow', reducer)

const SaleShow = () => {

    const { saleId } = useParams()

    const dispatch = useDispatch()

    const fetchData = async () => {
        await dispatch(getSale(saleId))
    }

    useEffect(() => {
        if (saleId !== undefined) {
            fetchData()
        }
    }, [])

    return (
        <>
            hello sale show
        </>
    )
}

export default SaleShow