import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchProducts } from '../api';
import type { Product } from '../types';
import { ArrowRight, Sparkles } from 'lucide-react';

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
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"
                    />
                    <p className="mt-4 font-bold text-slate-400 uppercase tracking-widest text-xs">Loading Store...</p>
                </div>
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-12 selection:bg-indigo-100">
            <header className="max-w-7xl mx-auto mb-16 relative">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative z-10"
                >
                    <div className="flex items-center space-x-2 mb-4">
                        <span className="bg-indigo-600 text-white p-1 rounded-md">
                            <Sparkles size={16} />
                        </span>
                        <span className="text-indigo-600 font-black uppercase tracking-tighter text-sm">New Collection 2026</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
                        The Future <br />
                        <span className="text-indigo-600">On Installments.</span>
                    </h1>
                    <p className="mt-6 text-slate-500 text-lg max-w-md font-medium leading-relaxed">
                        Premium smartphones backed by secure Mutual Fund EMI plans. Zero down payment on select models.
                    </p>
                </motion.div>

                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-indigo-200/30 blur-3xl rounded-full"></div>
                <div className="absolute top-40 -left-10 w-48 h-48 bg-purple-200/20 blur-3xl rounded-full"></div>
            </header>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
                {products.map(product => (
                    <motion.div key={product.id} variants={itemVariants}>
                        <Link
                            to={`/products/${product.id}`}
                            className="group bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100 flex flex-col h-full"
                        >
                            <div className="relative aspect-[4/5] overflow-hidden bg-slate-100 m-4 rounded-[32px]">
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                                    <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-indigo-700 uppercase tracking-widest border border-white/50 shadow-sm w-fit">
                                        {product.variant}
                                    </span>
                                </div>
                            </div>

                            <div className="px-8 pb-8 pt-2 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <h2 className="text-2xl font-black tracking-tight leading-none group-hover:text-indigo-600 transition-colors">
                                        {product.name}
                                    </h2>
                                </div>

                                <p className="text-slate-400 text-sm font-bold flex items-center mb-6 uppercase tracking-tighter">
                                    <span className="w-2 h-2 rounded-full mr-2 ring-4 ring-slate-100" style={{ backgroundColor: product.color.toLowerCase().split(' ').pop() }}></span>
                                    {product.color}
                                </p>

                                <div className="mt-auto flex items-end justify-between">
                                    <div>
                                        <p className="text-slate-300 line-through text-xs font-bold mb-1 ml-1">₹{product.mrp.toLocaleString()}</p>
                                        <p className="text-3xl font-black text-slate-900 leading-none tracking-tighter">₹{product.price.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-slate-900 text-white w-12 h-12 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-slate-200">
                                        <ArrowRight size={20} />
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-50 flex items-center">
                                    <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                        ₹{Math.min(...product.emiPlans.map(p => p.monthlyAmount)).toLocaleString()}/mo
                                    </div>
                                    <span className="ml-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Starting Price</span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default ProductListPage;
