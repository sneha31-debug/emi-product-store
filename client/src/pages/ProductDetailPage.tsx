import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchProductById } from '../api';
import type { Product, EMIPlan } from '../types';
import { ArrowLeft, ShieldCheck, Zap, Info, Share2, Heart, CheckCircle2 } from 'lucide-react';
import SelectionSummaryModal from '../components/SelectionSummaryModal';
import VariantSelection from '../components/VariantSelection';

const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<EMIPlan | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            setLoading(true);
            fetchProductById(id)
                .then(data => {
                    setProduct(data);
                    if (data.emiPlans.length > 0) {
                        setSelectedPlan(data.emiPlans[0]);
                    }
                    setLoading(false);
                    // Scroll to top on navigation
                    window.scrollTo(0, 0);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center"
                >
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </motion.div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
                <h2 className="text-2xl font-bold text-slate-900">Product Not Found</h2>
                <button
                    onClick={() => navigate('/')}
                    className="mt-4 px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold shadow-lg shadow-slate-200"
                >
                    Go Back Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100 pb-20">
            {/* Navigation */}
            <nav className="p-6 max-w-7xl mx-auto flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-30 border-b border-slate-50">
                <Link to="/" className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors font-bold group">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 group-hover:bg-indigo-50 transition-colors mr-3">
                        <ArrowLeft size={20} />
                    </div>
                    Back to Catalog
                </Link>
                <div className="flex items-center space-x-2">
                    <button className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all">
                        <Heart size={20} />
                    </button>
                    <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all">
                        <Share2 size={20} />
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Left: Image Container */}
                <div className="lg:col-span-7">
                    <div className="sticky top-28 space-y-6">
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-slate-50 rounded-[64px] overflow-hidden aspect-square flex items-center justify-center p-16 border border-slate-100 group shadow-inner"
                        >
                            <motion.img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 hover:scale-105"
                            />
                        </motion.div>

                        <div className="flex gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex-1 aspect-square bg-slate-50 rounded-3xl border border-slate-100 p-4 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-pointer">
                                    <img src={product.imageUrl} className="w-full h-full object-contain mix-blend-multiply" alt="Gallery" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Product Details & Options */}
                <div className="lg:col-span-5 flex flex-col">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex items-center space-x-2 mb-6">
                            <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                                Exclusive
                            </span>
                            <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-100 flex items-center">
                                <ShieldCheck size={12} className="mr-1.5" />
                                Authored by 1Fi
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.9] mb-8">{product.name}</h1>

                        {/* Variant Selection (Storage & Color) */}
                        {product.variants && (
                            <VariantSelection
                                currentProductId={product.id}
                                variants={product.variants}
                            />
                        )}

                        <div className="flex items-end space-x-4 mb-12">
                            <span className="text-5xl font-black text-slate-900 tracking-tighter leading-none">₹{product.price.toLocaleString()}</span>
                            <div className="flex flex-col mb-1">
                                <span className="text-lg text-slate-300 line-through font-bold leading-none mb-1">₹{product.mrp.toLocaleString()}</span>
                                <span className="text-emerald-500 font-black text-xs uppercase tracking-wider">
                                    You Save ₹{(product.mrp - product.price).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* EMI Strategy Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-10"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black tracking-tight flex items-center">
                                EMI Strategy
                                <Info size={18} className="ml-2 text-slate-300 hover:text-indigo-400 cursor-help transition-colors" />
                            </h3>
                            <div className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl uppercase tracking-widest border border-indigo-100">
                                Mutual Fund Backed
                            </div>
                        </div>

                        <div className="space-y-4">
                            {product.emiPlans.map((plan, index) => (
                                <button
                                    key={plan.id}
                                    onClick={() => setSelectedPlan(plan)}
                                    className={`w-full text-left p-6 rounded-[32px] border-2 transition-all relative overflow-hidden group ${selectedPlan?.id === plan.id
                                            ? 'border-indigo-600 bg-indigo-50/30 ring-[6px] ring-indigo-50 shadow-md'
                                            : 'border-slate-100 bg-white hover:border-slate-300'
                                        }`}
                                >
                                    <div className="flex justify-between items-center relative z-10">
                                        <div>
                                            <div className="flex items-baseline mb-2">
                                                <span className="text-3xl font-black pr-2 tracking-tighter">₹{plan.monthlyAmount.toLocaleString()}</span>
                                                <span className="text-slate-400 font-bold text-sm tracking-tight">/ month</span>
                                            </div>
                                            <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest">
                                                <span className="text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/50">
                                                    {plan.tenure} Months
                                                </span>
                                                <span className={`${plan.interestRate === 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                    {plan.interestRate === 0 ? 'Zero Cost' : `${plan.interestRate}% Interest`}
                                                </span>
                                            </div>
                                        </div>

                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${selectedPlan?.id === plan.id
                                                ? 'bg-indigo-600 text-white scale-110 shadow-lg shadow-indigo-100'
                                                : 'bg-slate-50 text-slate-200 opacity-0 group-hover:opacity-100'
                                            }`}>
                                            <CheckCircle2 size={24} />
                                        </div>
                                    </div>

                                    {plan.cashback > 0 && (
                                        <div className="mt-5 pt-5 border-t border-indigo-100/50 flex items-center text-[10px] font-black text-indigo-700 uppercase tracking-widest relative z-10">
                                            <Zap size={14} className="mr-2 fill-indigo-700" />
                                            ₹{plan.cashback.toLocaleString()} Instant Cashback Applied
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-auto space-y-6"
                    >
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full py-6 bg-slate-900 text-white rounded-[32px] font-black text-xl hover:bg-black transition-all shadow-2xl shadow-slate-200 active:scale-[0.98] flex items-center justify-center group overflow-hidden relative"
                        >
                            <span className="relative z-10 flex items-center">
                                Configure Yours
                                <ArrowLeft size={24} className="ml-3 rotate-180 group-hover:translate-x-2 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </button>
                        <div className="flex items-center justify-center space-x-6">
                            <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                <ShieldCheck size={14} className="mr-2" /> 256-bit Secure
                            </div>
                            <div className="w-1.5 h-1.5 bg-slate-100 rounded-full"></div>
                            <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                <Zap size={14} className="mr-2" /> Instant Approval
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Success Modal */}
            {selectedPlan && (
                <SelectionSummaryModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    product={product}
                    plan={selectedPlan}
                />
            )}
        </div>
    );
};

export default ProductDetailPage;
