import React, { useState } from 'react'
import { Input, Button, Checkbox, toast, Notification } from 'components/ui'
import { apiSaveWhatsappProfile } from 'services/WhatsappService'
import { HiOutlineChatAlt2, HiCheckCircle } from 'react-icons/hi'
import { useDispatch } from 'react-redux'
import { setUser } from 'store/auth/userSlice'

const WhatsappConfig = ({ user }) => {
    const dispatch = useDispatch()

    const [phone, setPhone] = useState(user?.whatsapp_phone_e164 || '')
    const [optIn, setOptIn] = useState(!!user?.whatsapp_opt_in_at)
    const [loading, setLoading] = useState(false)

    // Ocultar si la empresa no lo tiene activo
    const isCompanyEnabled = user?.company?.whatsapp_reminders_enabled ||
        user?.whatsapp_reminders_enabled ||
        true // Mostramos por defecto si no hay variable en frontend

    if (!isCompanyEnabled) return null

    const handleSave = async () => {
        if (!phone || phone.length < 8) {
            toast.push(
                <Notification title="Campo requerido" type="danger">
                    Ingrese un número de teléfono válido.
                </Notification>,
                { placement: 'top-center' }
            )
            return
        }

        if (!optIn) {
            toast.push(
                <Notification title="Consentimiento requerido" type="danger">
                    Debe aceptar recibir mensajes.
                </Notification>,
                { placement: 'top-center' }
            )
            return
        }

        setLoading(true)
        try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
            const { data } = await apiSaveWhatsappProfile({
                phone,
                optIn,
                timezone: tz
            })

            dispatch(setUser({
                ...user,
                whatsapp_phone_e164: data?.phone || phone,
                whatsapp_opt_in_at: new Date().toISOString(),
                timezone: tz
            }))

            toast.push(
                <Notification title="¡Excelente!" type="success">
                    Tu número de WhatsApp ha sido enlazado.
                </Notification>,
                { placement: 'top-center' }
            )
        } catch (error) {
            toast.push(
                <Notification title="Error de enlace" type="danger">
                    {error?.response?.data?.message || 'Hubo un error al guardar.'}
                </Notification>,
                { placement: 'top-center' }
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
                <HiOutlineChatAlt2 className="text-9xl text-emerald-600" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                    <span className="bg-emerald-100 text-emerald-600 p-1.5 rounded-lg">
                        <HiOutlineChatAlt2 className="text-lg" />
                    </span>
                    <h4 className="font-bold text-slate-800 text-base">Alertas WhatsApp</h4>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                    Recibe recordatorios directamente a tu teléfono móvil.
                </p>
            </div>

            <div className="relative z-10 flex flex-col gap-3">
                <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">Número Celular</label>
                    <Input
                        placeholder="Ej. +50230001122"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="bg-white border-slate-200 shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>

                <div className="flex items-start gap-2 mt-1">
                    <Checkbox
                        className="mt-0.5 text-emerald-500 focus:ring-emerald-500"
                        checked={optIn}
                        onChange={(val) => setOptIn(val)}
                    />
                    <span className="text-[11px] text-slate-500 leading-tight">
                        Acepto recibir mensajes automatizados de recordatorios de mis clientes.
                    </span>
                </div>

                <Button
                    size="sm"
                    variant="solid"
                    className="mt-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-md shadow-emerald-200/50 rounded-xl"
                    loading={loading}
                    onClick={handleSave}
                >
                    Guardar WhatsApp
                </Button>

                {user?.whatsapp_opt_in_at && (
                    <div className="mt-1 flex items-center justify-center gap-1.5 text-xs text-emerald-600 font-semibold bg-white py-1.5 px-3 rounded-lg border border-emerald-100 shadow-sm">
                        <HiCheckCircle className="text-base" />
                        Verificado como: {user.whatsapp_phone_e164}
                    </div>
                )}
            </div>
        </div>
    )
}

export default WhatsappConfig
