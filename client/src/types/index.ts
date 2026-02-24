export interface EMIPlan {
    id: number;
    monthlyAmount: number;
    tenure: number;
    interestRate: number;
    cashback: number;
    productId: number;
}

export interface ProductVariant {
    id: number;
    slug: string;
    variant: string;
    color: string;
    price: number;
    imageUrls: string[];
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    brand: string;
    variant: string;
    color: string;
    mrp: number;
    price: number;
    imageUrls: string[];
    description: string;
    highlights: string[];
    emiPlans: EMIPlan[];
    variants?: ProductVariant[];
}
