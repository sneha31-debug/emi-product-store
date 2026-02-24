import { PrismaClient } from '@prisma/client';
import pkg from 'pg';
const { Pool } = pkg;
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function generateEMIPlans(price: number) {
    return [
        {
            tenure: 3,
            interestRate: 0,
            monthlyAmount: Math.round(price / 3),
            cashback: 2000,
        },
        {
            tenure: 6,
            interestRate: 0,
            monthlyAmount: Math.round(price / 6),
            cashback: 1500,
        },
        {
            tenure: 9,
            interestRate: 0,
            monthlyAmount: Math.round(price / 9),
            cashback: 1000,
        },
        {
            tenure: 12,
            interestRate: 10.5,
            monthlyAmount: Math.round((price * 1.105) / 12),
            cashback: 500,
        },
        {
            tenure: 24,
            interestRate: 12.5,
            monthlyAmount: Math.round((price * 1.125) / 24),
            cashback: 0,
        },
    ];
}

async function main() {
    // Clear existing data
    await prisma.eMIPlan.deleteMany();
    await prisma.product.deleteMany();

    const iphoneImages = {
        'Natural Titanium': [
            'https://www.myimaginestore.com/media/catalog/product/cache/4a48ac28cbb6e9c41470e5be5a6d3043/i/p/iphone_17_pro_cosmic_orange_pdp_image_position_1__en-in_1.jpg',
            'https://www.myimaginestore.com/media/catalog/product/cache/4a48ac28cbb6e9c41470e5be5a6d3043/i/p/iphone_17_pro_cosmic_orange_pdp_image_position_2__en-in_1.jpg'
        ],
        'Blue Titanium': [
            'https://www.myimaginestore.com/media/catalog/product/cache/4a48ac28cbb6e9c41470e5be5a6d3043/i/p/iphone_17_pro_deep_blue_pdp_image_position_1__en-in_1.jpg',
            'https://www.myimaginestore.com/media/catalog/product/cache/4a48ac28cbb6e9c41470e5be5a6d3043/i/p/iphone_17_pro_silver_pdp_image_position_2__en-in_3.jpg'
        ]
    };

    const samsungImages = {
        'Titanium Gray': [
            'https://images.samsung.com/is/image/samsung/assets/in/smartphones/galaxy-s24/buy/1600x864_Trade_in_and_save.jpg?imbypass=true',
            'https://images.samsung.com/is/image/samsung/assets/in/smartphones/galaxy-s24/buy/4d.jpg?imbypass=true'
        ],
        'Titanium Violet': [
            'https://images.samsung.com/is/image/samsung/p6pim/in/2401/gallery/in-galaxy-s24-492654-sm-s921bzycins-539572839?imbypass=true',
            'https://images.samsung.com/is/image/samsung/p6pim/in/2401/gallery/in-galaxy-s24-492654-sm-s921bzycins-539572822?imbypass=true'
        ],
        'Titanium Black': [
            'https://images.samsung.com/is/image/samsung/p6pim/in/2401/gallery/in-galaxy-s24-492654-sm-s921bzkcins-539572763?imbypass=true',
            'https://images.samsung.com/is/image/samsung/p6pim/in/2401/gallery/in-galaxy-s24-492654-sm-s921bzkcins-539572750?$LazyLoad_Home_JPG$'
        ]
    };

    const pixelImages = {
        'Porcelain': [
            'https://vsprod.vijaysales.com/media/catalog/product/p/1/p10_pro_moonstone.jpg?optimize=medium&fit=bounds&height=500&width=500',
            'https://vsprod.vijaysales.com/media/catalog/product/g/o/google_pixel_10_pro_5g_16gb_ram256gb_moonstone_9_.jpg?optimize=medium&fit=bounds&height=500&width=500'
        ],
        'Obsidian': [
            'https://vsprod.vijaysales.com/media/catalog/product/p/1/p10_pro_obsidian.jpg?optimize=medium&fit=bounds&height=500&width=500',
            'https://vsprod.vijaysales.com/media/catalog/product/g/o/google_pixel_10_pro_5g_16gb_ram256gb_obsidian_4_.jpg?optimize=medium&fit=bounds&height=500&width=500'
        ],
        'Hazel': [
            'https://vsprod.vijaysales.com/media/catalog/product/p/1/p10_pro_jade.jpg?optimize=medium&fit=bounds&height=500&width=500',
            'https://vsprod.vijaysales.com/media/catalog/product/g/o/google_pixel_10_pro_5g_16gb_ram256gb_jade_6_.jpg?optimize=medium&fit=bounds&height=500&width=500'
        ]
    };

    const oneplusImages = {
        'Flowy Emerald': [
            'https://image01-in.oneplus.net/media/202407/04/41900be750fcc2707894c7eb516d1ce8.png?x-amz-process=image/format,webp/quality,Q_80',
            'https://image01-in.oneplus.net/media/202407/04/e2105b4aa295084af72e174c70a1636c.png?x-amz-process=image/format,webp/quality,Q_80'
        ],
        'Silky Black': [
            'https://image01-in.oneplus.net/media/202407/04/ab90ed53736b391f7ce5b78c9b0ac456.png?x-amz-process=image/format,webp/quality,Q_80',
            'https://image01-in.oneplus.net/media/202407/04/e283b783b1a36fe44030e1cc75b72f4c.png?x-amz-process=image/format,webp/quality,Q_80'
        ]
    };

    const productDefinitions = [
        {
            name: 'Apple iPhone 17 Pro',
            brand: 'Apple',
            colors: ['Natural Titanium', 'Blue Titanium'],
            storages: [
                { variant: '256 GB', mrp: 134900, price: 129900 },
                { variant: '512 GB', mrp: 159900, price: 149900 }
            ],
            imageMap: iphoneImages,
            description: 'iPhone 17 Pro. Forged in titanium and featuring the groundbreaking A19 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.',
            highlights: [
                '6.3-inch Super Retina XDR display with ProMotion (120Hz)',
                'A19 Pro chip with 6-core GPU for console-level gaming',
                '48MP Main + 48MP Ultra Wide + 12MP 5x Telephoto camera system',
                'Titanium design — lighter and more durable',
                'USB-C with USB 3 speeds up to 10 Gb/s',
                'Up to 29 hours of video playback',
                'Action Button for quick access to features',
                'Ceramic Shield front, surgical-grade stainless steel',
            ]
        },
        {
            name: 'Samsung Galaxy S24 Ultra',
            brand: 'Samsung',
            colors: ['Titanium Gray', 'Titanium Violet', 'Titanium Black'],
            storages: [
                { variant: '256 GB', mrp: 129999, price: 119999 },
                { variant: '512 GB', mrp: 144999, price: 134999 }
            ],
            imageMap: samsungImages,
            description: 'Galaxy S24 Ultra redefines mobile AI. Galaxy AI is here, with a premium titanium frame, embedded S Pen, and a 200MP camera system.',
            highlights: [
                '6.8-inch Dynamic AMOLED 2X, QHD+ (3120x1440), 120Hz',
                'Snapdragon 8 Gen 3 for Galaxy — fastest mobile processor',
                '200MP Main + 12MP UW + 10MP 3x + 50MP 5x camera',
                'Built-in S Pen with Air Actions',
                'Titanium frame — strongest Galaxy ever',
                '5000mAh battery with 45W Super Fast Charging',
                'Galaxy AI: Live Translate, Circle to Search, Note Assist',
                'IP68 water and dust resistance',
            ]
        },
        {
            name: 'Google Pixel 9 Pro',
            brand: 'Google',
            colors: ['Porcelain', 'Obsidian', 'Hazel'],
            storages: [
                { variant: '128 GB', mrp: 109900, price: 99900 },
                { variant: '256 GB', mrp: 119900, price: 109900 }
            ],
            imageMap: pixelImages,
            description: 'Pixel 9 Pro with Google Tensor G4 chip, the best Pixel camera yet, and 7 years of OS and security updates.',
            highlights: [
                '6.3-inch Super Actua LTPO OLED display, 120Hz',
                'Google Tensor G4 chip with Titan M2 security',
                '50MP Main + 48MP Ultrawide + 48MP 5x Telephoto',
                'Magic Eraser, Photo Unblur, Best Take',
                '7 years of OS, Security, and Feature Drop updates',
                '27-hour battery life, fast wireless charging',
                'Gemini built-in — AI assistant directly on device',
                'IP68 dust and water resistance',
            ]
        },
        {
            name: 'OnePlus 12',
            brand: 'OnePlus',
            colors: ['Flowy Emerald', 'Silky Black'],
            storages: [
                { variant: '256 GB', mrp: 69999, price: 64999 },
                { variant: '512 GB', mrp: 79999, price: 74999 }
            ],
            imageMap: oneplusImages,
            description: 'OnePlus 12 with Snapdragon 8 Gen 3, Hasselblad 4th Gen camera, and 100W SUPERVOOC charging.',
            highlights: [
                '6.82-inch 2K ProXDR LTPO AMOLED, 120Hz, 4500 nits peak',
                'Snapdragon 8 Gen 3 mobile Platform',
                '50MP Main + 64MP UW + 48MP 3x Periscope Telephoto',
                '4th Gen Hasselblad Camera for Mobile',
                '5400mAh battery with 100W SUPERVOOC fast charging',
                'LPDDR5X RAM + UFS 4.0 storage',
                'Aqua Touch — use in rain or with wet fingers',
                'OxygenOS based on Android 14',
            ]
        }
    ];

    const finalProducts = [];

    for (const def of productDefinitions) {
        for (const storage of def.storages) {
            for (const color of def.colors) {
                const slug = `${def.name.toLowerCase().replace(/ /g, '-')}-${storage.variant.toLowerCase().replace(/ /g, '')}-${color.toLowerCase().replace(/ /g, '-')}`;
                finalProducts.push({
                    name: def.name,
                    slug: slug,
                    brand: def.brand,
                    variant: storage.variant,
                    color: color,
                    mrp: storage.mrp,
                    price: storage.price,
                    imageUrls: (def.imageMap as any)[color] || [],
                    description: def.description,
                    highlights: def.highlights
                });
            }
        }
    }

    for (const p of finalProducts) {
        const product = await prisma.product.create({
            data: {
                name: p.name,
                slug: p.slug,
                brand: p.brand,
                variant: p.variant,
                color: p.color,
                mrp: p.mrp,
                price: p.price,
                imageUrls: p.imageUrls,
                description: p.description,
                highlights: p.highlights,
                emiPlans: {
                    create: generateEMIPlans(p.price),
                },
            },
        });
        console.log(`Created product: ${product.name} (${product.variant}, ${product.color}) with id: ${product.id}`);
    }


    console.log(`\n Seeding complete! Created ${finalProducts.length} product variants across ${productDefinitions.length} brands.`);
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
