import toast from 'react-hot-toast'

export const toastError = (err, fallback = 'Ocurrió un error') => {
    const message = err?.response?.data?.message || err?.message || fallback
    toast.error(message)
}

export const toastSuccess = (message) => {
    toast.success(message)
}

export default toast
