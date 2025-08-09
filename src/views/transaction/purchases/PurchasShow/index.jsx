import React from 'react'
import PurchasForm from '../PurchasForm'
import { toast, Notification } from 'components/ui'
import { useNavigate, useParams } from 'react-router-dom'
import { getPurchas } from './store/showSlice'
import { injectReducer } from 'store/index'
import reducer from './store'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'

injectReducer('purchasShow', reducer)

const PurchasShow = () => {

    const { purchasId } = useParams()

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const fetchData = async () => {
        await dispatch(getPurchas(purchasId))
    }

    useEffect(() => {
        if (purchasId !== undefined) {
            fetchData()
        }
    }, [])

    return (
        <>
            <PurchasForm
                onFormSubmit={handleFormSubmit}
                onDiscard={handleDiscard}
            />
        </>
    )
}

export default PurchasShow