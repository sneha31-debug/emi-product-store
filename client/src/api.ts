import axios from 'axios';
import type { Product } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const fetchProducts = async (): Promise<Product[]> => {
    const response = await axios.get(`${API_BASE_URL}/products`);
    return response.data;
};

export const fetchProductById = async (id: string | number): Promise<Product> => {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data;
};

export const fetchProductBySlug = async (slug: string): Promise<Product> => {
    const response = await axios.get(`${API_BASE_URL}/products/slug/${slug}`);
    return response.data;
};

export const fetchProductsByName = async (name: string): Promise<Product[]> => {
    const response = await axios.get(`${API_BASE_URL}/products/name/${encodeURIComponent(name)}`);
    return response.data;
};
