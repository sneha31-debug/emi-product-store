import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../api';
import type { Product } from '../types';
import { Star, Package } from 'lucide-react';

function groupProductsByName(products: Product[]): Product[] {
    const seen = new Set<string>();
    return products.filter(p => {
        if (seen.has(p.name)) return false;
        seen.add(p.name);
        return true;
    });
}



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

    const grouped = useMemo(() => groupProductsByName(products), [products]);

    const variantCounts = useMemo(() => {
        const map: Record<string, number> = {};
        products.forEach(p => { map[p.name] = (map[p.name] || 0) + 1; });
        return map;
    }, [products]);

    if (loading) {
        return (
            <div className="max-w-[1248px] mx-auto px-4 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl h-[420px] animate-pulse border border-gray-100 shadow-sm" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f1f3f6] pb-16">
            <div className="bg-gradient-to-r from-[#171b1f] to-[#2c3e50] text-white py-16 mb-8">
                <div className="max-w-[1248px] mx-auto px-4">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
                            Premium <span className="text-[#ffe500]">Smartphones</span>
                        </h1>
                        <p className="text-gray-300 text-lg md:text-xl font-medium leading-relaxed">
                            Discover the latest flagship devices with exclusive <span className="text-white font-bold">MF-Collateral EMI plans</span>.
                            Your next upgrade is just a tap away.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-[1248px] mx-auto px-4">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 leading-none">Featured Collections</h2>
                        <p className="text-sm text-gray-500 mt-1 font-medium">Curated high-end tech for your lifestyle</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                        <Package size={16} className="text-[#2874f0]" />
                        <span className="text-sm font-bold text-gray-700">{grouped.length} Unique Models</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
                    {grouped.map((product) => {
                        const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
                        const minEmi = product.emiPlans.length > 0
                            ? Math.min(...product.emiPlans.map(p => p.monthlyAmount))
                            : null;
                        const count = variantCounts[product.name] || 1;

                        return (
                            <Link
                                key={product.id}
                                to={`/${product.name.toLowerCase().replace(/ /g, '-')}-${product.brand.toLowerCase()}/${product.slug}`}
                                className="flex flex-col group bg-white rounded-2xl overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 border border-transparent hover:border-gray-100 relative group"
                            >
                                {discount > 0 && (
                                    <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-lg transform group-hover:scale-110 transition-transform">
                                        {discount}% OFF
                                    </div>
                                )}

                                <div className="h-64 w-full bg-[#f8f9fa] flex items-center justify-center p-8 overflow-hidden relative">
                                    <img
                                        src={product.imageUrls[0]}
                                        alt={product.name}
                                        className="h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                    />
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {count > 1 && (
                                        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-[#2874f0] text-[10px] font-bold px-3 py-1 rounded-full border border-blue-50 shadow-sm">
                                            {count} Options
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="mb-2">
                                        <p className="text-[10px] text-[#2874f0] font-black uppercase tracking-widest mb-1">{product.brand}</p>
                                        <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-[#2874f0] transition-colors line-clamp-1">
                                            {product.name}
                                        </h3>
                                    </div>

                                    <div className="flex items-center gap-1.5 mb-4">
                                        <div className="flex items-center gap-0.5 bg-[#388e3c] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm">
                                            <span>4.8</span>
                                            <Star size={10} className="fill-white" />
                                        </div>                  
                                    </div>

                                    <div className="mt-auto">
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className="font-black text-xl text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
                                            <span className="text-sm text-gray-400 line-through font-medium">₹{product.mrp.toLocaleString('en-IN')}</span>
                                        </div>

                                        {minEmi && (
                                            <div className="bg-blue-50 rounded-lg px-3 py-2 border border-blue-100/50">
                                                <div className="text-[11px] text-gray-500 font-bold uppercase tracking-tighter">
                                                    Lowest EMI
                                                </div>
                                                <div className="text-sm font-black text-[#2874f0]">
                                                    ₹{minEmi.toLocaleString('en-IN')}<span className="text-[11px] font-bold text-gray-400">/mo*</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 flex items-center justify-center border-2 border-[#2874f0] text-[#2874f0] font-black text-xs py-3 rounded-xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 uppercase tracking-widest bg-white">
                                        Explore Device
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {grouped.length === 0 && (
                    <div className="py-32 text-center bg-white rounded-3xl shadow-sm border border-gray-100">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package size={40} className="text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Device Library Empty</h3>
                        <p className="text-gray-500 font-medium">We're updating our collection. Please check back soon.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductListPage;
