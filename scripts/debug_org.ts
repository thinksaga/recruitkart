
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Fetching organizations...');
    const orgs = await prisma.organization.findMany({
        include: {
            users: {
                select: {
                    email: true,
                    role: true
                }
            }
        }
    });
    console.log('Organizations found:', orgs.length);
    console.log(JSON.stringify(orgs, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
