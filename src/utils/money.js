export const formatGTQ = (value) => {
    if (value === null || value === undefined) return '';
    return new Intl.NumberFormat('es-GT', {
        style: 'currency',
        currency: 'GTQ',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};
