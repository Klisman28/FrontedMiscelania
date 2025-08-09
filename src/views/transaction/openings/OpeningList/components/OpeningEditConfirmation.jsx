import React from 'react'
import { toast, Notification } from 'components/ui'
import { ConfirmDialog } from 'components/shared'
import { useSelector, useDispatch } from 'react-redux'
import { toggleDeleteConfirmation } from '../store/stateSlice'
import { putOpening, resetOpeningData } from '../store/dataSlice'
import {HiInformationCircle} from 'react-icons/hi'

const OpeningEditConfirmation = () => {

    const dispatch = useDispatch()
    const dialogOpen = useSelector((state) => state.openings.state.deleteConfirmation)
    const { id, cashier } = useSelector((state) => state.openings.data.openingData)

    const onDialogClose = () => {
        dispatch(toggleDeleteConfirmation(false))
    }

    const onEdit = async () => {
        dispatch(toggleDeleteConfirmation(false))
        const res = await dispatch(putOpening({ id, data: { status: 0 } }))

        if (res.payload.type === 'success') {
            dispatch(resetOpeningData())
            toast.push(
                <Notification title={"¡Corte Existoso!"} type="success" duration={3000}>
                    El corte de caja se registró con éxito
                </Notification>
                , {
                    placement: 'top-center'
                }
            )
        } else {
            toast.push(
                <Notification title={"¡Corte Fallido!"} type="danger" duration={3000}>
                    No se puede hacer el corte, comuniquese con el administrador.
                </Notification>
                , {
                    placement: 'top-center'
                }
            )
        }
    }

    return (
        <ConfirmDialog
            isOpen={dialogOpen}
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            type="info"
            title={`Hacer Corte de ${cashier?.name}`}
            onCancel={onDialogClose}
            onConfirm={onEdit}
            confirmButtonColor="blue-500"
        >
            <p>
                ¿Está seguro de que desea hacer el corte de caja?<br />
                {/* Todos los registros relacionados con este openingo también se eliminarán. */}
                Esta acción no se puede deshacer.
            </p>
            <div className='text-amber-500 flex items-center mt-6'>
                <HiInformationCircle className='w-8 h-8 mr-2'/>
                <span>¡Recuerde antes de realizar esta acción debe hacer la rendición de cuenta!</span>
            </div>
            {/* <div className='mt-4'>
                <h6>Resumen</h6>
                <div className='flex space-x-4'>
                    <div>
                        Saldo Inicial:
                        <p className='font-bold'>00.00</p>
                    </div>
                    <div>
                        Total Ventas:
                    </div>
                    <div>
                        Total a Entrega:
                    </div>
                </div>
            </div> */}
        </ConfirmDialog>
    )
}

export default OpeningEditConfirmation