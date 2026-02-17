import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Card, Input, Button, FormItem } from 'components/ui'
import { HiCash } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux'
import { postOpening, getOpeningCurrent } from '../store/dataSlice'
import toast from 'react-hot-toast'

/**
 * OpeningFormCard
 * 
 * Formulario mejorado de apertura de caja tipo POS
 * Con validaciones, autofocus y atajos de teclado
 */
const OpeningFormCard = ({ cashiers = [] }) => {
    const dispatch = useDispatch()
    const inputRef = useRef(null)

    const [initBalance, setInitBalance] = useState('')
    const [observation, setObservation] = useState('')
    const [selectedCashier, setSelectedCashier] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState({})

    const cashierList = useSelector(state => state.openingForm?.data?.cashierList || cashiers)

    // Auto-focus en el input al montar
    useEffect(() => {
        if (inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }, [])

    const validate = useCallback(() => {
        const newErrors = {}

        if (!initBalance || parseFloat(initBalance) < 0 || isNaN(parseFloat(initBalance))) {
            newErrors.initBalance = 'Saldo inicial es requerido y debe ser un número válido'
        }

        if (!selectedCashier) {
            newErrors.cashierId = 'Seleccione una caja'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }, [initBalance, selectedCashier])

    const handleClear = useCallback(() => {
        setInitBalance('')
        setObservation('')
        setSelectedCashier('')
        setErrors({})
        setTimeout(() => inputRef.current?.focus(), 100)
    }, [])

    const handleSubmit = useCallback(async () => {
        if (!validate()) return

        setIsSubmitting(true)

        try {
            const values = {
                initBalance: parseFloat(initBalance),
                cashierId: selectedCashier
            }

            const res = await dispatch(postOpening(values))
            const { message, type } = res.payload || {}

            if (type === 'success') {
                dispatch(getOpeningCurrent())
                toast.success(message || 'La caja se ha aperturado correctamente')
                handleClear()
            } else {
                toast.error(message || 'No se pudo aperturar la caja')
            }
        } catch (error) {
            toast.error('Ocurrió un error al aperturar la caja')
        } finally {
            setIsSubmitting(false)
        }
    }, [validate, initBalance, selectedCashier, observation, dispatch, handleClear])

    // Atajo de teclado Enter para confirmar
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault()
                handleSubmit()
            } else if (e.key === 'Escape') {
                e.preventDefault()
                handleClear()
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [handleSubmit, handleClear])

    const formatCurrency = (value) => {
        if (!value) return ''
        const num = parseFloat(value)
        if (isNaN(num)) return value
        return num.toFixed(2)
    }

    const isFormValid = initBalance && parseFloat(initBalance) >= 0 && !isNaN(parseFloat(initBalance)) && selectedCashier

    return (
        <Card>
            <div className="mb-4">
                <h5 className="flex items-center gap-2">
                    <HiCash className="text-indigo-600" />
                    Apertura de Caja
                </h5>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Ingresa el saldo inicial para empezar a vender
                </p>
            </div>

            <div className="space-y-4">
                {/* Selector de Caja */}
                <FormItem
                    label="Caja"
                    invalid={!!errors.cashierId}
                    errorMessage={errors.cashierId}
                >
                    <select
                        value={selectedCashier}
                        onChange={(e) => setSelectedCashier(e.target.value)}
                        className="input input-md h-11 focus:ring-indigo-600 focus-within:ring-indigo-600 focus-within:border-indigo-600 focus:border-indigo-600 w-full"
                    >
                        <option value="">Seleccione una caja...</option>
                        {cashierList.map((cashier) => (
                            <option key={cashier.id} value={cashier.id}>
                                {cashier.name} ({cashier.code})
                            </option>
                        ))}
                    </select>
                </FormItem>

                {/* Saldo Inicial */}
                <FormItem
                    label="Saldo Inicial (Q)"
                    invalid={!!errors.initBalance}
                    errorMessage={errors.initBalance}
                >
                    <input
                        ref={inputRef}
                        type="number"
                        step="0.01"
                        min="0"
                        value={initBalance}
                        onChange={(e) => setInitBalance(e.target.value)}
                        onBlur={(e) => {
                            if (e.target.value) {
                                setInitBalance(formatCurrency(e.target.value))
                            }
                        }}
                        placeholder="0.00"
                        className="input input-md h-11 focus:ring-indigo-600 focus-within:ring-indigo-600 focus-within:border-indigo-600 focus:border-indigo-600 w-full"
                    />
                </FormItem>

                {/* Observación */}
                <FormItem
                    label="Observación (Opcional)"
                >
                    <Input
                        textArea
                        value={observation}
                        onChange={(e) => setObservation(e.target.value)}
                        placeholder="Notas adicionales..."
                        rows={3}
                    />
                </FormItem>

                {/* Botón de Acción */}
                <Button
                    variant="solid"
                    className="w-full"
                    icon={<HiCash />}
                    onClick={handleSubmit}
                    disabled={!isFormValid || isSubmitting}
                    loading={isSubmitting}
                >
                    {isSubmitting ? 'Aperturando...' : 'Empezar'}
                </Button>

                {/* Ayuda de atajos */}
                <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                    <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                        Ctrl+Enter
                    </kbd>{' '}
                    para aperturar •{' '}
                    <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                        Esc
                    </kbd>{' '}
                    para limpiar
                </div>
            </div>
        </Card>
    )
}

export default OpeningFormCard
