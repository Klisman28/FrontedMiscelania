import React, { useState, useRef, useEffect } from 'react'
import { Dialog, Button, FormItem, Input, Tabs, Notification, toast } from 'components/ui'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { NumericFormat } from 'react-number-format'
import { useDispatch, useSelector } from 'react-redux'
import { createCashMovement, getOpeningCurrent, getOpeningSummary } from '../../store/dataSlice'
import { HiCash, HiArrowSmLeft, HiArrowSmRight } from 'react-icons/hi'

const { TabNav, TabList, TabContent } = Tabs

const validationSchema = Yup.object().shape({
    amount: Yup.number()
        .required('Monto es requerido')
        .positive('El monto debe ser mayor a 0'),
    description: Yup.string()
        .required('Descripción requerida')
})

const NumberFormatInput = ({ field, form, ...props }) => {
    return (
        <NumericFormat
            customInput={Input}
            type="text"
            onValueChange={({ floatValue }) => {
                form.setFieldValue(field.name, floatValue)
            }}
            value={field.value}
            prefix={'Q '}
            thousandSeparator={true}
            decimalScale={2}
            fixedDecimalScale={true}
            autoComplete="off"
            {...props}
        />
    )
}

const CashMovementModal = ({ isOpen, onClose, openingId }) => {
    const dispatch = useDispatch()
    const [currentTab, setCurrentTab] = useState('deposit')
    const inputRef = useRef(null)

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const payload = {
                openingId: openingId,
                type: currentTab === 'deposit' ? 'CASH_IN' : 'CASH_OUT',
                amount: values.amount,
                description: values.description
            }

            const result = await dispatch(createCashMovement(payload))

            if (createCashMovement.fulfilled.match(result)) {
                toast.push(
                    <Notification title="Éxito" type="success">
                        Movimiento registrado correctamente
                    </Notification>,
                    { placement: 'top-center' }
                )
                dispatch(getOpeningCurrent()) // Refresh data
                dispatch(getOpeningSummary(openingId))
                onClose()
                resetForm()
            } else {
                toast.push(
                    <Notification title="Error" type="danger">
                        {result.payload?.message || 'Error al registrar movimiento'}
                    </Notification>,
                    { placement: 'top-center' }
                )
            }
        } catch (error) {
            console.error(error)
            toast.push(
                <Notification title="Error" type="danger">
                    Ocurrió un error inesperado
                </Notification>,
                { placement: 'top-center' }
            )
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            width={500}
        >
            <div className="flex flex-col h-full justify-between">
                <div className="mb-4">
                    <h5 className="mb-2">Registrar Movimiento de Efectivo</h5>
                    <p className="text-gray-500 text-sm">
                        Registre ingresos (fondos) o retiros de efectivo de la caja actual.
                    </p>
                </div>

                <Tabs value={currentTab} onChange={val => setCurrentTab(val)}>
                    <TabList>
                        <TabNav value="deposit" icon={<HiArrowSmRight className="text-green-500" />}>
                            Ingreso (Fondo)
                        </TabNav>
                        <TabNav value="withdrawal" icon={<HiArrowSmLeft className="text-red-500" />}>
                            Retiro
                        </TabNav>
                    </TabList>

                    <div className="mt-4">
                        <Formik
                            initialValues={{ amount: '', description: '' }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ errors, touched, isSubmitting }) => (
                                <Form>
                                    <FormItem
                                        label="Monto"
                                        invalid={errors.amount && touched.amount}
                                        errorMessage={errors.amount}
                                    >
                                        <Field name="amount" component={NumberFormatInput} placeholder="0.00" />
                                    </FormItem>

                                    <FormItem
                                        label="Descripción / Motivo"
                                        invalid={errors.description && touched.description}
                                        errorMessage={errors.description}
                                    >
                                        <Field
                                            name="description"
                                            component={Input}
                                            textArea
                                            placeholder="Ej: Fondo para cambio, Pago de servicio..."
                                        />
                                    </FormItem>

                                    <div className="text-right mt-6">
                                        <Button
                                            className="mr-2"
                                            variant="plain"
                                            type="button"
                                            onClick={onClose}
                                            disabled={isSubmitting}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            variant="solid"
                                            type="submit"
                                            loading={isSubmitting}
                                            icon={<HiCash />}
                                            color={currentTab === 'deposit' ? 'green-600' : 'red-600'}
                                        >
                                            {currentTab === 'deposit' ? 'Registrar Ingreso' : 'Registrar Retiro'}
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </Tabs>
            </div>
        </Dialog>
    )
}

export default CashMovementModal
