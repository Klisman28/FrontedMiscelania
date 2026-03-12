import React, { useState } from 'react';
import { DatePicker, Button } from 'components/ui';
import { apiScheduleWhatsappReminder } from 'services/WhatsappService';
import toast from 'react-hot-toast';

const WhatsappReminderScheduler = ({ noteId, currentCompany, userHasWhatsapp, onClose }) => {
    const [date, setDate] = useState(new Date());
    const [loading, setLoading] = useState(false);

    // Validación multiempresa y perfil en la UI
    if (!currentCompany?.whatsappRemindersEnabled && !currentCompany?.whatsapp_reminders_enabled) {
        return (
            <div className="p-4 text-center text-slate-500">
                El módulo de WhatsApp no está activado para su empresa.
            </div>
        );
    }

    if (!userHasWhatsapp) {
        return (
            <div className="p-4 text-center text-slate-500 text-sm">
                Configura tu número de WhatsApp en <b>Mi Perfil</b> para usar recordatorios.
            </div>
        );
    }

    const scheduleReminder = async () => {
        if (!date) {
            toast.error("Seleccione una fecha y hora");
            return;
        }

        setLoading(true);
        try {
            await apiScheduleWhatsappReminder(noteId, date.toISOString());
            toast.success('Recordatorio programado en WhatsApp');
            onClose();
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error programando recordatorio');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-5 flex flex-col gap-5 bg-white rounded-xl">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="text-emerald-500 text-xl font-bold">W</span>
                <h3 className="font-bold text-slate-800 text-lg">Programar Recordatorio</h3>
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Fecha y Hora exacta
                </label>
                <DatePicker.DateTimepicker
                    value={date}
                    onChange={setDate}
                    locale="es"
                    clearable={false}
                    className="w-full"
                />
            </div>

            <div className="flex justify-end gap-3 mt-4">
                <Button size="sm" onClick={onClose} disabled={loading} variant="plain">
                    Cancelar
                </Button>
                <Button
                    size="sm"
                    variant="solid"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-sm"
                    onClick={scheduleReminder}
                    loading={loading}
                >
                    Programar
                </Button>
            </div>
        </div>
    );
};

export default WhatsappReminderScheduler;
