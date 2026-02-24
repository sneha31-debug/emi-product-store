import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './db';

dotenv.config();

const app = express();
const port = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

app.get('/api/products', async (req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany({
            include: { emiPlans: true },
            orderBy: { id: 'asc' },
        });
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/products/slug/:slug', async (req: Request, res: Response) => {
    const { slug } = req.params;
    try {
        const product = await prisma.product.findUnique({
            where: { slug },
            include: { emiPlans: { orderBy: { tenure: 'asc' } } },
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        const variants = await prisma.product.findMany({
            where: { name: product.name },
            select: { id: true, slug: true, variant: true, color: true, price: true, imageUrl: true },
            orderBy: { id: 'asc' },
        });

        res.json({ ...product, variants });
    } catch (error) {
        console.error('Error fetching product by slug:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/products/name/:name', async (req: Request, res: Response) => {
    const { name } = req.params;
    try {
        const products = await prisma.product.findMany({
            where: { name: { equals: decodeURIComponent(name), mode: 'insensitive' } },
            include: { emiPlans: { orderBy: { tenure: 'asc' } } },
            orderBy: { id: 'asc' },
        });

        if (!products.length) {
            return res.status(404).json({ error: 'No products found with that name' });
        }

        res.json(products);
    } catch (error) {
        console.error('Error fetching products by name:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/products/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!/^\d+$/.test(id)) {
        return res.status(404).json({ error: 'Product not found' });
    }

    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
            include: { emiPlans: { orderBy: { tenure: 'asc' } } },
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const variants = await prisma.product.findMany({
            where: { name: product.name },
            select: { id: true, slug: true, variant: true, color: true, price: true, imageUrl: true },
            orderBy: { id: 'asc' },
        });

        res.json({ ...product, variants });
    } catch (error) {
        console.error('Error fetching product by id:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
