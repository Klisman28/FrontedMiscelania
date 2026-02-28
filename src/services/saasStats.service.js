import { getSaasCompanies } from './saasCompanies.service'
import { searchSaasUsers } from './saasUsers.service'
import { getCompanyMembers } from './saasCompanies.service'

export async function fetchSaasStatsOverview() {
    try {
        // Obtenemos un límite amplio para cálculos (esto debería idealmente ser un endpoint de agregación backend)
        const [companiesRes, usersRes] = await Promise.all([
            getSaasCompanies({ limit: 1000 }),
            searchSaasUsers({ limit: 1000 })
        ])

        const companies = companiesRes?.items || companiesRes || []
        const users = usersRes?.data?.data?.users || (Array.isArray(usersRes?.data?.data) ? usersRes?.data?.data : []) || []

        // Intentar deducir asientos en uso (en un caso real se pediría el detalle o vendría pre-agregado)
        // Para este mockup robusto, sumaremos memberships de usuarios a modo aproximado.
        let totalSeatsUsed = 0;
        let planBreakdown = {};
        let seatsByPlan = {};
        let activeCompanies = 0;
        let suspendedCompanies = 0;
        let totalSeats = 0;

        let dateCounts = {};

        const now = new Date()
        const next30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

        const expiringSoon = []

        for (const company of companies) {
            // Basic Status
            if (company.status === 'active') activeCompanies++;
            else if (company.status === 'suspended') suspendedCompanies++;

            // Plan Breakdown
            const plan = company.plan?.name || company.plan || 'basic';
            planBreakdown[plan] = (planBreakdown[plan] || 0) + 1;

            // Seats
            const seats = typeof company.seats === 'number' ? company.seats : 0;
            totalSeats += seats;

            if (!seatsByPlan[plan]) {
                seatsByPlan[plan] = { total: 0, used: 0 }
            }
            seatsByPlan[plan].total += seats;

            // Date processing for line chart
            const rawDate = company.createdAt || company.created_at;
            let dateStr = 'Unknown';
            if (rawDate) {
                const d = new Date(rawDate);
                if (!isNaN(d)) {
                    dateStr = d.toISOString().split('T')[0];
                }
            }
            dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;

            // Expiring soon
            const expireDateRaw = company.subscriptionEnd || company.subscription_end || company.validUntil;
            let willExpire = false;
            let expireDateObj = null;
            if (expireDateRaw) {
                expireDateObj = new Date(expireDateRaw);
                if (expireDateObj > now && expireDateObj <= next30Days) {
                    willExpire = true;
                }
            }
            if (willExpire) {
                expiringSoon.push({
                    ...company,
                    expireDateObj,
                    planName: plan
                });
            }
        }

        // Estimar Seats Used (Contar usuarios con memberships activas o roles tenant)
        // Para más precisión requeriría hacer polling a members de cada compañía, lo cual es inviable aquí en O(N).
        // Haremos una aproximación leyendo las memberships desde Users si están embebidas.
        users.forEach(user => {
            const memberships = user.companies || user.companyUsers || user.company_users || user.memberships || [];
            memberships.forEach(m => {
                const mStatus = m.status || m.pivot?.status;
                const role = m.role || m.pivot?.role;
                if (mStatus !== 'suspended' && role !== 'owner') {
                    totalSeatsUsed++;
                    // No tenemos acceso instantáneo al plan del tenant desde el user en el fallback, 
                    // lo añadimos proporcionalmente o lo omitimos para la gráfica refinada.
                }
            })
        });

        // Top Compañías por asientos
        const topCompaniesBySeats = [...companies].sort((a, b) => (b.seats || 0) - (a.seats || 0)).slice(0, 5);

        // Sorting expiring soon
        expiringSoon.sort((a, b) => a.expireDateObj - b.expireDateObj);

        // Formating Line Chart Data
        const sortedDates = Object.keys(dateCounts).filter(k => k !== 'Unknown').sort();
        const trendCategories = [];
        const trendData = [];
        sortedDates.forEach(d => {
            trendCategories.push(d);
            trendData.push(dateCounts[d]);
        });

        return {
            totalCompanies: companies.length,
            activeCompanies,
            suspendedCompanies,
            totalUsers: users.length,
            totalSeats,
            totalSeatsUsed,
            planBreakdown: Object.keys(planBreakdown).map(k => ({ name: k, value: planBreakdown[k] })),
            seatsByPlan,
            trendChart: {
                categories: trendCategories.slice(-30), // UStimos 30 dias para evitar saturacion
                data: trendData.slice(-30)
            },
            expiringSoon: expiringSoon.slice(0, 10),
            topCompaniesBySeats
        }

    } catch (error) {
        console.error("Error fetching SaaS stats overview", error);
        throw error;
    }
}
