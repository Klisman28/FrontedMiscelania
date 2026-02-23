
import BaseService from './BaseService';

class SaasService extends BaseService {
    async signup(data) {
        return this.post('/saas/signup', data);
    }

    async getPlans() {
        return this.get('/saas/plans');
    }

    async createCheckoutSession(data) {
        return this.post('/saas/checkout', data);
    }

    async createPortalSession() {
        return this.post('/saas/portal');
    }

    async getBilling() {
        return this.get('/saas/billing');
    }

    async checkSlug(slug) {
        return this.get(`/saas/check-slug/${slug}`);
    }

    // Admin Endpoints
    async getCompanies(params) {
        return this.get('/saas/companies', params);
    }

    async updateCompanyStatus(id, data) {
        return this.patch(`/saas/companies/${id}/status`, data);
    }

    async getSaasStats() {
        return this.get('/saas/stats');
    }
}

const saasService = new SaasService();

export default saasService;
