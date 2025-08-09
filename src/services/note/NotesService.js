import ApiService from '../ApiService';

// ===================================
// Obtener todas las notas
// ===================================
export async function apiGetNotes(queryParams = {}) {
  // queryParams podría ser { limit, offset, search, sortColumn, sortDirection }
  // para construir la query string, ApiService.fetchData() debería soportar "params"
  return await ApiService.fetchData({
    url: '/notes', 
    method: 'GET',
    // Si tu ApiService soporta "params" para query string, lo pasas aquí
    params: queryParams,
  });
}

// ===================================
// Crear una nueva nota
// ===================================
export async function apiCreateNote(data) {
  // data = { text: 'Contenido de la nota' }
  return await ApiService.fetchData({
    url: '/notes',
    method: 'POST',
    data,
  });
}

// ===================================
// Actualizar una nota existente
// ===================================
export async function apiUpdateNote(id, changes) {
  // changes = { text: 'Nuevo contenido' }
  return await ApiService.fetchData({
    url: `/notes/${id}`,
    method: 'PUT',
    data: changes,
  });
}

// ===================================
// Eliminar una nota
// ===================================
export async function apiDeleteNote(id) {
  return await ApiService.fetchData({
    url: `/notes/${id}`,
    method: 'DELETE',
  });
}
