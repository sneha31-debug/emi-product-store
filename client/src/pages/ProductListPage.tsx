import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../api';
import type { Product } from '../types';
import { ArrowRight } from 'lucide-react';

const ProductListPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts()
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 font-medium">Loading Products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-12">
            <header className="max-w-7xl mx-auto mb-12">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    Smartphones on EMI
                </h1>
                <p className="mt-2 text-slate-600 text-lg">
                    Backed by premium Mutual Funds. Zero interest plans available.
                </p>
            </header>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map(product => (
                    <Link
                        key={product.id}
                        to={`/products/${product.id}`}
                        className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col"
                    >
                        <div className="relative aspect-square overflow-hidden bg-slate-200">
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-indigo-700 uppercase tracking-wider border border-white/50">
                                {product.variant}
                            </div>
                        </div>

                        <div className="p-6 flex flex-col flex-grow">
                            <h2 className="text-xl font-bold group-hover:text-indigo-600 transition-colors">
                                {product.name}
                            </h2>
                            <p className="text-slate-500 text-sm mt-1 mb-4 flex items-center">
                                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: product.color.toLowerCase().split(' ').pop() }}></span>
                                {product.color}
                            </p>

                            <div className="mt-auto flex items-end justify-between">
                                <div>
                                    <p className="text-slate-400 line-through text-sm">₹{product.mrp.toLocaleString()}</p>
                                    <p className="text-2xl font-black text-slate-900">₹{product.price.toLocaleString()}</p>
                                </div>
                                <div className="bg-indigo-50 text-indigo-600 p-3 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                    <ArrowRight size={20} />
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center text-xs font-semibold text-emerald-600 uppercase tracking-widest">
                                EMI starting from ₹{Math.min(...product.emiPlans.map(p => p.monthlyAmount)).toLocaleString()}/mo
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ProductListPage;
