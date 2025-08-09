import React, { useState } from 'react'
import { Button, Dialog } from 'components/ui'
import { useSelector, useDispatch } from 'react-redux'
import { setShowDialogOpen } from '../store/stateSlice'
import { HiOutlineCalendar } from 'react-icons/hi'
import dayjs from 'dayjs'
import PaymentSummary from './PaymentSummary'
import CustomerInfo from './CustomerInfo'
import OrderProducts from './OrderProducts'

const SaleShowDialog = () => {

    const dispatch = useDispatch()

    const showDialogOpen = useSelector((state) => state.saleReport.state.showDialogOpen)
    const selectedSale = useSelector((state) => state.saleReport.state.selectedSale)

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
                            <span>Detalle Venta</span>
                        </h3>
                    </div>
                    <span className="flex items-center">
                        <HiOutlineCalendar className="text-lg" />
                        <span className="ltr:ml-1 rtl:mr-1">
                            {dayjs(selectedSale.dateIssue).format('DD MMM YYYY')}
                        </span>
                    </span>
                </div>
                <div className="xl:flex gap-4">
                    <div className="w-full">
                        <OrderProducts data={selectedSale.products} />
                        <div className="xl:grid grid-cols-2 gap-4 mt-4">
                            {/* <ShippingInfo data={data.shipping} /> */}
                            <div className='col-span-1 col-start-2'>
                                <PaymentSummary
                                    data={{
                                        subtotal: selectedSale.total - selectedSale.igv,
                                        igv: selectedSale.igv,
                                        total: selectedSale.total
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    {selectedSale.type !== 'Ticket' &&
                        <div className="xl:max-w-[360px] w-full">
                            <CustomerInfo
                                type={selectedSale.type}
                                data={selectedSale.type === 'Boleta'
                                    ? selectedSale.customer
                                    : selectedSale.enterprise}
                            />
                        </div>
                    }
                </div>
            </div>
        </Dialog>
    )
}

export default SaleShowDialog
