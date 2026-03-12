import ApiService from './ApiService'

export async function apiSaveWhatsappProfile(data) {
    return ApiService.fetchData({
        url: '/profile/whatsapp',
        method: 'post',
        data
    });
}

export async function apiScheduleWhatsappReminder(noteId, schedule_at) {
    return ApiService.fetchData({
        url: `/notes/${noteId}/reminders/whatsapp`,
        method: 'post',
        data: { schedule_at }
    });
}
