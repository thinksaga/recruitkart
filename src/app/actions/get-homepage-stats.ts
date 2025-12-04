'use server';

import prisma from '@/lib/prisma';

export async function getHomepageStats() {
    try {
        const [
            recruitersCount,
            companiesCount,
            jobsCount,
            escrowAggregate
        ] = await Promise.all([
            prisma.tASProfile.count(),
            prisma.organization.count(),
            prisma.job.count(),
            prisma.escrowLedger.aggregate({
                _sum: {
                    amount: true
                }
            })
        ]);

        const totalValueLocked = escrowAggregate._sum.amount || 0;

        // Format currency (e.g., 4.2 Cr)
        const formatCurrency = (amount: number) => {
            if (amount >= 10000000) {
                return `₹${(amount / 10000000).toFixed(1)} Cr`;
            } else if (amount >= 100000) {
                return `₹${(amount / 100000).toFixed(1)} L`;
            }
            return `₹${amount.toLocaleString('en-IN')}`;
        };

        return {
            recruiters: recruitersCount.toLocaleString('en-IN'),
            companies: companiesCount.toLocaleString('en-IN'),
            jobs: jobsCount.toLocaleString('en-IN'),
            tvl: formatCurrency(totalValueLocked)
        };
    } catch (error) {
        console.error('Error fetching homepage stats:', error);
        // Fallback to 0 if DB fails, but strictly NO mock data
        return {
            recruiters: '0',
            companies: '0',
            jobs: '0',
            tvl: '₹0'
        };
    }
}
