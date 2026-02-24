import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchProductById } from '../api';
import type { Product, EMIPlan } from '../types';
import { ArrowLeft, CheckCircle2, ShieldCheck, Zap, Info } from 'lucide-react';

const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<EMIPlan | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchProductById(id)
                .then(data => {
                    setProduct(data);
                    // Auto-select the first plan
                    if (data.emiPlans.length > 0) {
                        setSelectedPlan(data.emiPlans[0]);
                    }
                    setLoading(false);
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
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
                <h2 className="text-2xl font-bold text-slate-900">Product not found</h2>
                <button
                    onClick={() => navigate('/')}
                    className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full font-semibold"
                >
                    Go Back Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-slate-900">
            {/* Navigation */}
            <nav className="p-6 max-w-7xl mx-auto flex items-center justify-between">
                <Link to="/" className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors font-medium">
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Catalog
                </Link>
                <div className="text-sm font-bold bg-slate-100 px-4 py-2 rounded-full flex items-center">
                    <ShieldCheck size={16} className="text-slate-600 mr-2" />
                    1Fi Secure Checkout
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left: Image */}
                <div className="lg:col-span-7">
                    <div className="sticky top-8 bg-slate-50 rounded-[40px] overflow-hidden aspect-square flex items-center justify-center p-12 border border-slate-100">
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-contain mix-blend-multiply"
                        />
                    </div>
                </div>

                {/* Right: Info & Plans */}
                <div className="lg:col-span-5 flex flex-col">
                    <div className="mb-8">
                        <div className="flex items-center space-x-2 mb-4">
                            <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100">
                                Premium Choice
                            </span>
                            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100">
                                In Stock
                            </span>
                        </div>

                        <h1 className="text-4xl font-black tracking-tight mb-2">{product.name}</h1>
                        <div className="flex items-center space-x-4 text-slate-500 font-medium text-lg mb-6">
                            <span>{product.variant}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span className="flex items-center">
                                <span className="w-4 h-4 rounded-full mr-2 border border-slate-200" style={{ backgroundColor: product.color.toLowerCase().split(' ').pop() }}></span>
                                {product.color}
                            </span>
                        </div>

                        <div className="flex items-baseline space-x-3 mb-8">
                            <span className="text-4xl font-black text-indigo-600">₹{product.price.toLocaleString()}</span>
                            <span className="text-xl text-slate-400 line-through font-medium">₹{product.mrp.toLocaleString()}</span>
                            <span className="text-emerald-500 font-bold bg-emerald-50 px-2 py-0.5 rounded text-sm">
                                Save ₹{(product.mrp - product.price).toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold flex items-center">
                                Select EMI Plan
                                <Info size={16} className="ml-2 text-slate-400 cursor-help" />
                            </h3>
                            <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
                                Mutual Fund Backed
                            </span>
                        </div>

                        <div className="space-y-4">
                            {product.emiPlans.map((plan) => (
                                <button
                                    key={plan.id}
                                    onClick={() => setSelectedPlan(plan)}
                                    className={`w-full text-left p-5 rounded-3xl border-2 transition-all relative overflow-hidden ${selectedPlan?.id === plan.id
                                        ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-4 ring-indigo-50'
                                        : 'border-slate-100 bg-white hover:border-slate-300'
                                        }`}
                                >
                                    <div className="flex justify-between items-center relative z-10">
                                        <div>
                                            <div className="flex items-center mb-1">
                                                <span className="text-2xl font-black pr-2">₹{plan.monthlyAmount.toLocaleString()}</span>
                                                <span className="text-slate-500 font-bold">/ month</span>
                                            </div>
                                            <div className="flex items-center space-x-3 text-sm font-bold">
                                                <span className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-tighter">
                                                    {plan.tenure} Months Tenure
                                                </span>
                                                <span className={`${plan.interestRate === 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
                                                    {plan.interestRate}% Interest
                                                </span>
                                            </div>
                                        </div>
                                        {selectedPlan?.id === plan.id && (
                                            <CheckCircle2 className="text-indigo-600" size={28} />
                                        )}
                                    </div>

                                    {plan.cashback > 0 && (
                                        <div className="mt-4 pt-4 border-t border-indigo-100 flex items-center text-xs font-black text-indigo-700 uppercase tracking-widest relative z-10">
                                            <Zap size={14} className="mr-1 fill-indigo-700" />
                                            Extra ₹{plan.cashback.toLocaleString()} Cashback Applied
                                        </div>
                                    )}

                                    {/* Decorative background blur for selected */}
                                    {selectedPlan?.id === plan.id && (
                                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-600 opacity-5 blur-2xl rounded-full"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto space-y-4">
                        <button
                            onClick={() => {
                                alert(`Proceeding with ${product.name} - ${selectedPlan?.tenure} Months Plan`);
                            }}
                            className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-xl hover:bg-black transition-all shadow-xl shadow-slate-200 active:scale-[0.98] flex items-center justify-center group"
                        >
                            Proceed with Selection
                            <ArrowLeft size={24} className="ml-3 rotate-180 group-hover:translate-x-2 transition-transform" />
                        </button>
                        <p className="text-center text-slate-400 text-xs font-medium">
                            By proceeding, you agree to our Terms of Use and Mutual Fund EMI Guidelines.
                        </p>
                    </div>
                </div>
            </main>

            {/* Trust Badges */}
            <footer className="bg-slate-50 py-12 px-6 mt-12 border-t border-slate-100">
                <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="flex items-center font-bold text-slate-400">AMFI REGISTERED</div>
                    <div className="flex items-center font-bold text-slate-400">SEBI REGULATED</div>
                    <div className="flex items-center font-bold text-slate-400">ZERO HIDDEN CHARGES</div>
                    <div className="flex items-center font-bold text-slate-400">100% SECURE</div>
                </div>
            </footer>
        </div>
    );
};

export default ProductDetailPage;
