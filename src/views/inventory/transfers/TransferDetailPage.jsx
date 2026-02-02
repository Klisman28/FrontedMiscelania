import React, { useEffect } from 'react'
import { Card, Button, Table, Tag } from 'components/ui'
import { Loading } from 'components/shared'
import { HiOutlineArrowLeft } from 'react-icons/hi'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { injectReducer } from 'store/index'
import reducer, { fetchTransferById } from 'store/transfers/transfersSlice'
import dayjs from 'dayjs'

injectReducer('transfers', reducer)

const { Tr, Th, Td, THead, TBody } = Table

const TransferDetailPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { current, loadingCurrent, errorCurrent } = useSelector((state) => state.transfers)

    useEffect(() => {
        if (id) {
            dispatch(fetchTransferById(id))
        }
    }, [id, dispatch])

    if (loadingCurrent) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loading loading={true} />
            </div>
        )
    }

    if (errorCurrent) {
        return (
            <div className="flex flex-col justify-center items-center h-full text-red-500">
                <h3>Error al cargar transferencia</h3>
                <p>{errorCurrent}</p>
                <Button className="mt-4" onClick={() => navigate('/inventory/transfers')}>
                    Volver
                </Button>
            </div>
        )
    }

    if (!current) return null

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-4">
                <Button size="sm" icon={<HiOutlineArrowLeft />} onClick={() => navigate('/inventory/transfers')} />
                <h3>Detalle de Transferencia #{current.id}</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                    <Card>
                        <h5 className="mb-4">Items Transferidos</h5>
                        <Table>
                            <THead>
                                <Tr>
                                    <Th>Producto</Th>
                                    <Th>SKU</Th>
                                    <Th>Cantidad</Th>
                                </Tr>
                            </THead>
                            <TBody>
                                {current.items?.map((item, index) => (
                                    <Tr key={index}>
                                        <Td>
                                            <div className="font-semibold">{item.product?.name || 'Desconocido'}</div>
                                        </Td>
                                        <Td>{item.product?.sku || item.product?.code || '-'}</Td>
                                        <Td>{item.quantity}</Td>
                                    </Tr>
                                ))}
                                {(!current.items || current.items.length === 0) && (
                                    <Tr>
                                        <Td colSpan="3" className="text-center">No hay items</Td>
                                    </Tr>
                                )}
                            </TBody>
                        </Table>
                    </Card>
                </div>
                <div className="lg:col-span-1">
                    <Card>
                        <h5 className="mb-4">Información General</h5>
                        <div className="flex flex-col gap-4">
                            <div>
                                <span className="font-semibold block text-gray-500">Estado</span>
                                <Tag className="mt-1 bg-emerald-100 text-emerald-600 border-0 rounded">
                                    {current.status || 'COMPLETADO'}
                                </Tag>
                            </div>
                            <div>
                                <span className="font-semibold block text-gray-500">Fecha</span>
                                <div>{dayjs(current.createdAt).format('DD/MM/YYYY HH:mm')}</div>
                            </div>
                            <div>
                                <span className="font-semibold block text-gray-500">Origen</span>
                                <div>{current.fromWarehouse?.name}</div>
                            </div>
                            <div>
                                <span className="font-semibold block text-gray-500">Destino</span>
                                <div>{current.toWarehouse?.name}</div>
                            </div>
                            <div>
                                <span className="font-semibold block text-gray-500">Observación</span>
                                <div className="italic text-gray-600">
                                    {current.observation || 'Sin observaciones'}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default TransferDetailPage
