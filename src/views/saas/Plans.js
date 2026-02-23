import React, { useState, useEffect } from 'react'
import { Card, Button, Input, Switcher, Spinner, Notification, toast } from 'components/ui'
import SaasService from 'services/SaasService'
import { HiCheck } from 'react-icons/hi'

const Plans = () => {
    const [plans, setPlans] = useState([])
    const [loading, setLoading] = useState(false) // Set to true if fetching from API
    const [interval, setInterval] = useState('month') // 'month' or 'year'
    const [seats, setSeats] = useState(1)
    const [processing, setProcessing] = useState(null)

    // Mock Plans if API fails or for initial development
    const mockPlans = [
        {
            id: 1,
            name: 'Basic',
            price_month: 29,
            price_year: 290,
            seat_price_month: 5,
            seat_price_year: 50,
            seats_included: 1,
            features: ['Gestión de inventario', 'Módulo de ventas', 'Reportes básicos', '1 usuario incluido']
        },
        {
            id: 2,
            name: 'Pro',
            price_month: 79,
            price_year: 790,
            seat_price_month: 10,
            seat_price_year: 100,
            seats_included: 3,
            features: ['Todo en Basic', 'Módulo de compras', 'Facturación electrónica', 'Soporte prioritario', '3 usuarios incluidos']
        },
        {
            id: 3,
            name: 'Enterprise',
            price_month: 199,
            price_year: 1990,
            seat_price_month: 15,
            seat_price_year: 150,
            seats_included: 10,
            features: ['Todo en Pro', 'API Access', 'Reportes personalizados', 'Múltiples sucursales', '10 usuarios incluidos']
        }
    ]

    useEffect(() => {
        fetchPlans()
    }, [])

    const fetchPlans = async () => {
        setLoading(true)
        try {
            const resp = await SaasService.getPlans()
            if (resp.data) {
                setPlans(resp.data)
            } else {
                setPlans(mockPlans)
            }
        } catch (error) {
            console.log('Using mock plans due to API error/missing endpoint')
            setPlans(mockPlans)
        } finally {
            setLoading(false)
        }
    }

    const calculateTotal = (plan) => {
        const basePrice = interval === 'month' ? plan.price_month : plan.price_year
        const seatPrice = interval === 'month' ? plan.seat_price_month : plan.seat_price_year
        const extraSeats = Math.max(0, seats - plan.seats_included)
        const total = basePrice + (extraSeats * seatPrice)
        return total
    }

    const handleSubscribe = async (planId) => {
        setProcessing(planId)
        try {
            const resp = await SaasService.createCheckoutSession({
                planId,
                seats,
                interval
            })
            if (resp.data && resp.data.url) {
                window.location.href = resp.data.url
            }
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    No se pudo iniciar el pago. Intente de nuevo.
                </Notification>
            )
        } finally {
            setProcessing(null)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Planes y Precios</h2>
                <p className="text-lg text-gray-600 mb-8">Elige el plan perfecto para tu negocio</p>

                <div className="flex items-center justify-center gap-4 mb-8">
                    <span className={`text-lg ${interval === 'month' ? 'font-bold text-indigo-600' : 'text-gray-500'}`}>Mensual</span>
                    <Switcher
                        defaultChecked={interval === 'year'}
                        onChange={(checked) => setInterval(checked ? 'year' : 'month')}
                    />
                    <span className={`text-lg ${interval === 'year' ? 'font-bold text-indigo-600' : 'text-gray-500'}`}>Anual (Ahorra 20%)</span>
                </div>

                <div className="max-w-md mx-auto mb-12 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cantidad de Usuarios (Seats): <span className="text-indigo-600 font-bold text-lg">{seats}</span>
                    </label>
                    <Input
                        type="range"
                        min="1"
                        max="50"
                        value={seats}
                        onChange={(e) => setSeats(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>1 usuario</span>
                        <span>50 usuarios</span>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Spinner size={40} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan) => {
                        const total = calculateTotal(plan)
                        return (
                            <Card
                                key={plan.id}
                                className={`relative flex flex-col h-full ${plan.name === 'Pro' ? 'border-2 border-indigo-500 shadow-xl scale-105 z-10' : 'hover:shadow-lg transition-shadow'}`}
                            >
                                {plan.name === 'Pro' && (
                                    <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                        RECOMENDADO
                                    </div>
                                )}
                                <div className="p-6 flex-grow">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                    <div className="mb-6">
                                        <span className="text-4xl font-extrabold text-gray-900">Q{total}</span>
                                        <span className="text-gray-500">/{interval === 'month' ? 'mes' : 'año'}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-6">
                                        Incluye {plan.seats_included} usuarios.
                                        {seats > plan.seats_included && (
                                            <span className="block text-xs mt-1 text-indigo-600 font-semibold">
                                                + Q{(seats - plan.seats_included) * (interval === 'month' ? plan.seat_price_month : plan.seat_price_year)} por {seats - plan.seats_included} usuarios extra
                                            </span>
                                        )}
                                    </p>
                                    <ul className="space-y-4 mb-8">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="flex items-start">
                                                <HiCheck className="flex-shrink-0 h-5 w-5 text-green-500 mr-2" />
                                                <span className="text-gray-600 text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="p-6 bg-gray-50 rounded-b-lg mt-auto">
                                    <Button
                                        block
                                        variant={plan.name === 'Pro' ? 'solid' : 'outline'}
                                        color="indigo-600"
                                        loading={processing === plan.id}
                                        onClick={() => handleSubscribe(plan.id)}
                                    >
                                        Suscribirme
                                    </Button>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default Plans
