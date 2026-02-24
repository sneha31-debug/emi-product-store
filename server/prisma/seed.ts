import { PrismaClient } from '@prisma/client';
import pkg from 'pg';
const { Pool } = pkg;
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    // Clear existing data
    await prisma.eMIPlan.deleteMany();
    await prisma.product.deleteMany();

    const products = [
        {
            name: 'Apple iPhone 17 Pro',
            variant: '256GB',
            color: 'Titanium Silver',
            mrp: 139900,
            price: 129900,
            imageUrl: 'https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?q=80&w=1000&auto=format&fit=crop',
        },
        {
            name: 'Apple iPhone 17 Pro',
            variant: '512GB',
            color: 'Titanium Black',
            mrp: 159900,
            price: 149900,
            imageUrl: 'https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?q=80&w=1000&auto=format&fit=crop',
        },
        {
            name: 'Samsung Galaxy S24 Ultra',
            variant: '256GB',
            color: 'Titanium Gray',
            mrp: 129900,
            price: 119900,
            imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=1000&auto=format&fit=crop',
        },
        {
            name: 'Samsung Galaxy S24 Ultra',
            variant: '512GB',
            color: 'Titanium Black',
            mrp: 139900,
            price: 129900,
            imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=1000&auto=format&fit=crop',
        },
        {
            name: 'Google Pixel 9 Pro',
            variant: '128GB',
            color: 'Porcelain',
            mrp: 109900,
            price: 99900,
            imageUrl: 'https://images.unsplash.com/photo-1596742578443-7682ef5251cd?q=80&w=1000&auto=format&fit=crop',
        },
        {
            name: 'Google Pixel 9 Pro',
            variant: '256GB',
            color: 'Obsidian',
            mrp: 119900,
            price: 109900,
            imageUrl: 'https://images.unsplash.com/photo-1596742578443-7682ef5251cd?q=80&w=1000&auto=format&fit=crop',
        },
    ];

    for (const p of products) {
        const product = await prisma.product.create({
            data: {
                ...p,
                emiPlans: {
                    create: [
                        {
                            tenure: 3,
                            interestRate: 0,
                            monthlyAmount: Math.round(p.price / 3),
                            cashback: 2000,
                        },
                        {
                            tenure: 6,
                            interestRate: 0,
                            monthlyAmount: Math.round(p.price / 6),
                            cashback: 1000,
                        },
                        {
                            tenure: 12,
                            interestRate: 10.5,
                            monthlyAmount: Math.round((p.price * 1.105) / 12),
                            cashback: 0,
                        },
                        {
                            tenure: 24,
                            interestRate: 12.5,
                            monthlyAmount: Math.round((p.price * 1.125) / 24),
                            cashback: 0,
                        },
                    ],
                },
            },
        });
        console.log(`Created product with id: ${product.id}`);
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
