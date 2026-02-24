export interface EMIPlan {
    id: number;
    monthlyAmount: number;
    tenure: number;
    interestRate: number;
    cashback: number;
    productId: number;
}

export interface Product {
    id: number;
    name: string;
    variant: string;
    color: string;
    mrp: number;
    price: number;
    imageUrl: string;
    emiPlans: EMIPlan[];
    variants?: {
        id: number;
        variant: string;
        color: string;
        price: number;
        imageUrl: string;
    }[];
}
