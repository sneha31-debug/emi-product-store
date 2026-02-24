import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './db';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Endpoints

// Get all products
app.get('/api/products', async (req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany({
            include: {
                emiPlans: true,
            },
        });
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get product by ID (or slug/name logic if needed, but the requirement says /api/products/:id)
app.get('/api/products/:id', async (req: Request, res: Response) => {
    const id = req.params.id as string;
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
            include: {
                emiPlans: true,
            },
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
