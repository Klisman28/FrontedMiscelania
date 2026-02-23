import React, { useState, useEffect } from 'react'
import { Card, Button, Tag, Progress, Spinner, Notification, toast } from 'components/ui'
import SaasService from 'services/SaasService'
import dayjs from 'dayjs'
import { HiExternalLink } from 'react-icons/hi'

const Billing = () => {
    const [billingData, setBillingData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [portalLoading, setPortalLoading] = useState(false)

    useEffect(() => {
        const query = new URLSearchParams(window.location.search)
        if (query.get('session_id')) {
            toast.push(
                <Notification title="Suscripción exitosa" type="success">
                    Gracias por suscribirte. Tu plan está activo.
                </Notification>
            )
            // Optional: Remove query param without reload
            window.history.replaceState({}, document.title, window.location.pathname)
        }
        fetchBilling()
    }, [])

    const fetchBilling = async () => {
        try {
            const resp = await SaasService.getBilling()
            setBillingData(resp.data)
        } catch (error) {
            console.error('Failed to fetch billing', error)
            // Mock data for development if backend fails
            setBillingData({
                plan: { name: 'Pro', price: 790, interval: 'year' },
                status: 'active',
                current_period_end: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                seats_purchased: 5,
                seats_used: 3
            })
        } finally {
            setLoading(false)
        }
    }

    const handlePortal = async () => {
        setPortalLoading(true)
        try {
            const resp = await SaasService.createPortalSession()
            if (resp.data && resp.data.url) {
                window.location.href = resp.data.url
            }
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    No se pudo abrir el portal de facturación.
                </Notification>
            )
        } finally {
            setPortalLoading(false)
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'green'
            case 'trialing': return 'blue'
            case 'past_due': return 'orange'
            case 'canceled': return 'red'
            default: return 'gray'
        }
    }

    if (loading) {
        return <div className="flex justify-center p-12"><Spinner size={40} /></div>
    }

    if (!billingData) {
        return <div className="text-center p-12">No billing information available.</div>
    }

    const { plan, status, current_period_end, seats_purchased, seats_used } = billingData
    const percentUsed = (seats_used / seats_purchased) * 100

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Facturación y Suscripción</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Plan Actual</h3>
                            <p className="text-gray-500">{plan.name} - {plan.interval === 'year' ? 'Anual' : 'Mensual'}</p>
                        </div>
                        <Tag className={`bg-${getStatusColor(status)}-100 text-${getStatusColor(status)}-600 border-0 rounded`}>
                            {status.toUpperCase()}
                        </Tag>
                    </div>

                    <div className="mb-6">
                        <p className="text-sm text-gray-500 mb-1">Próxima renovación</p>
                        <p className="font-medium">{dayjs(current_period_end).format('DD MMM, YYYY')}</p>
                    </div>

                    <div className="mt-6">
                        <Button
                            icon={<HiExternalLink />}
                            loading={portalLoading}
                            onClick={handlePortal}
                            variant="solid"
                        >
                            Administrar Suscripción
                        </Button>
                        <p className="text-xs text-gray-400 mt-2">
                            Gestionado por Stripe. Podrás cambiar de plan, método de pago o descargar facturas.
                        </p>
                    </div>
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Uso de Licencias (Seats)</h3>

                    <div className="mb-2 flex justify-between text-sm">
                        <span>Usuarios Activos</span>
                        <span className="font-bold">{seats_used} / {seats_purchased}</span>
                    </div>
                    <Progress percent={percentUsed} color="indigo-600" />

                    <div className="mt-8 bg-blue-50 p-4 rounded-md">
                        <h4 className="text-sm font-bold text-blue-900 mb-2">¿Necesitas más usuarios?</h4>
                        <p className="text-sm text-blue-800 mb-3">
                            Has utilizado {seats_used} de tus {seats_purchased} licencias disponibles.
                            Puedes agregar más licencias desde el portal de administración.
                        </p>
                        <Button size="sm" onClick={handlePortal}>
                            Aumentar Licencias
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default Billing
