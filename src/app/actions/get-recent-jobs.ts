'use server';

import prisma from '@/lib/prisma';

export async function getRecentJobs() {
    try {
        const jobs = await prisma.job.findMany({
            where: {
                status: 'OPEN'
            },
            take: 5,
            orderBy: {
                created_at: 'desc'
            },
            include: {
                organization: {
                    select: {
                        name: true,
                        address: true // To get location (city) if available
                    }
                }
            }
        });

        return jobs.map(job => {
            // Safely extract city from address JSON if possible, or use job location
            let location = job.location || 'Remote';
            if (job.organization.address && typeof job.organization.address === 'object') {
                const addr = job.organization.address as any;
                if (addr.city) location = addr.city;
            }

            return {
                id: job.id,
                title: job.title,
                company: job.organization.name,
                location: location,
                salary: job.salary_max ? `₹${(job.salary_max / 100000).toFixed(1)} LPA` : 'Salary Negotiable'
            };
        });
    } catch (error) {
        console.error('Error fetching recent jobs:', error);
        return [];
    }
}
