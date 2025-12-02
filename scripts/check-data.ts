import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking database data...');

    const user = await prisma.user.findFirst({
        where: { email: 'john@doe.com' }
    });

    if (!user) {
        console.log('❌ User john@doe.com not found');
        return;
    }
    console.log('✅ User found:', user.id);

    const candidate = await prisma.candidate.findUnique({
        where: { user_id: user.id },
        include: {
            experience: true,
            education: true
        }
    });

    if (!candidate) {
        console.log('❌ Candidate profile not found for user');
    } else {
        console.log('✅ Candidate profile found:', candidate.id);
        console.log('Experience count:', candidate.experience.length);
        console.log('Education count:', candidate.education.length);
    }

    const applications = await prisma.submission.findMany({
        where: { candidate_id: candidate?.id }
    });
    console.log('Applications count:', applications.length);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
