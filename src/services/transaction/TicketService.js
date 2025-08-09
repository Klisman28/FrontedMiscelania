// src/services/ticket.api.js
import ApiService from '../ApiService';

export async function apiGetNextTicket() {
  return ApiService.fetchData({
    url: '/tickets/next',
    method: 'get',
  });
}

/**
 * Crea un nuevo ticket en el backend.
 * @param {{ tipo: string, fecha: string, … }} data
 */
export async function apiCreateTicket(data) {
  return ApiService.fetchData({
    url: '/tickets',
    method: 'post',
    data
  });
}
