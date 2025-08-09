import React, { useState } from 'react'
import { Button, Dialog } from 'components/ui'
import { useSelector, useDispatch } from 'react-redux'
import { setShowDialogOpen } from '../store/stateSlice'
import { HiOutlineCalendar } from 'react-icons/hi'
import dayjs from 'dayjs'
import PaymentSummary from './PaymentSummary'
import SupplierInfo from './SupplierInfo'
import OrderProducts from './OrderProducts'

const PurchasShowDialog = () => {

    const dispatch = useDispatch()

    const showDialogOpen = useSelector((state) => state.purchasList.state.showDialogOpen)
    const selectedPurchas = useSelector((state) => state.purchasList.state.selectedPurchas)

    const onDialogClose = e => {
        dispatch(setShowDialogOpen(false))
    }

    return (
        <Dialog
            isOpen={showDialogOpen}
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            width={1000}
            height="full"
        >
            <div className="flex flex-col h-full justify-between">
                <div className="mb-2">
                    <div className="flex items-center mb-1">
                        <h3>
                            <span>Detalle compra</span>
                        </h3>
                    </div>
                    <span className="flex items-center">
                        <HiOutlineCalendar className="text-lg" />
                        <span className="ltr:ml-1 rtl:mr-1">
                            {dayjs(selectedPurchas.dateIssue).format('DD MMM YYYY')}
                        </span>
                    </span>
                </div>
                <div className="xl:flex gap-4">
                    <div className="w-full">
                        <OrderProducts data={selectedPurchas.products} />
                        <div className="xl:grid grid-cols-2 gap-4 mt-4">
                            {/* <ShippingInfo data={data.shipping} /> */}
                            <PaymentSummary
                                data={{
                                    subtotal: selectedPurchas.total - selectedPurchas.igv,
                                    igv: selectedPurchas.igv,
                                    total: selectedPurchas.total
                                }}
                            />
                        </div>
                    </div>
                    <div className="xl:max-w-[360px] w-full">
                        <SupplierInfo data={{...selectedPurchas.supplier}} />
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default PurchasShowDialog
