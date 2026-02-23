import React, { useEffect, useState } from 'react';
import { Card, Button, Tag, Progress } from 'components/ui';
import SaasService from 'services/SaasService';
import { HiOutlineCreditCard } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const BillingStats = ({ onLimitReached }) => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBilling = async () => {
            try {
                const resp = await SaasService.getBilling();
                if (resp.data) {
                    setStats(resp.data);
                    // Notificar al padre si se alcanzó el límite
                    if (onLimitReached && resp.data.seats_used >= resp.data.seats_purchased) {
                        onLimitReached(true);
                    }
                }
            } catch (error) {
                console.error('Error fetching billing info', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBilling();
    }, [onLimitReached]);

    if (loading || !stats) return null;

    const percent = Math.round((stats.seats_used / stats.seats_purchased) * 100);
    const isLimitReached = stats.seats_used >= stats.seats_purchased;

    return (
        <Card className="mb-4 bg-gray-50 border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-full shadow-sm">
                        <HiOutlineCreditCard className="text-2xl text-indigo-600" />
                    </div>
                    <div>
                        <h6 className="font-bold text-gray-700">Plan: {stats.plan?.name?.toUpperCase() || stats.plan?.toUpperCase()}</h6>
                        <div className="flex items-center gap-2 mt-1">
                            <Tag className={isLimitReached ? "bg-red-100 text-red-600 border-red-200" : "bg-green-100 text-green-600 border-green-200"}>
                                {stats.status?.toUpperCase()}
                            </Tag>
                            <span className="text-xs text-gray-500">
                                {stats.period_end ? `Vence: ${new Date(stats.period_end).toLocaleDateString()}` : 'Sin vencimiento'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 w-full md:w-auto md:px-8">
                    <div className="flex justify-between mb-1">
                        <span className="text-sm font-semibold text-gray-600">Usuarios Activos</span>
                        <span className={`text-sm font-bold ${isLimitReached ? 'text-red-600' : 'text-gray-600'}`}>
                            {stats.seats_used} / {stats.seats_purchased}
                        </span>
                    </div>
                    <Progress percent={percent} status={isLimitReached ? 'fail' : 'success'} />
                    {isLimitReached && (
                        <p className="text-xs text-red-500 mt-1 font-semibold">
                            ⚠️ Límite de usuarios alcanzado. Actualiza tu plan.
                        </p>
                    )}
                </div>

                <div>
                    <Button size="sm" variant="solid" disabled={!isLimitReached} onClick={() => navigate('/saas/planes')}>
                        Actualizar Plan
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default BillingStats;
