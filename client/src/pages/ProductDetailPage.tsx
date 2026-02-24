import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Star, Zap, Package,
    ChevronRight, Info, ChevronLeft
} from 'lucide-react';
import SelectionSummaryModal from '../components/SelectionSummaryModal';
import VariantSelection from '../components/VariantSelection';
import { fetchProductBySlug } from '../api';
import type { Product, EMIPlan } from '../types';

const ProductDetailPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'plans' | 'overview' | 'specs'>('plans');
    const [selectedPlan, setSelectedPlan] = useState<EMIPlan | null>(null);
    const [showSummary, setShowSummary] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        if (!slug) return;

        // Only show the full page spinner on initial load or brand change
        // If the product family (name) stays same, we do a "soft" load
        const isBrandNewProduct = !product || (product.slug !== slug && product.name.split(' ')[0] !== slug.split('-')[0]);

        if (isBrandNewProduct) {
            setLoading(true);
        }

        fetchProductBySlug(slug)
            .then(data => {
                // If it's a variant of the SAME color, preserve the active image index
                // Note: We check if the image sets are effectively the same
                setProduct(prev => {
                    if (prev && prev.color === data.color) {
                        // Keep current active index if it's within bounds of new product images
                        // This ensures that if I'm on image 2, I stay on image 2 when storage changes
                        return data;
                    }
                    // Reset index for different color/product
                    setActiveImageIndex(0);
                    return data;
                });

                setLoading(false);
                if (data.emiPlans.length > 0) {
                    setSelectedPlan(data.emiPlans[0]);
                }
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [slug]);

    if (loading && !product) {
        return (
            <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#f1f3f6] flex flex-col items-center justify-center p-4">
                <Package size={64} className="text-gray-200 mb-4" />
                <h1 className="text-xl font-bold text-gray-800 mb-2">Product Not Found</h1>
                <button
                    onClick={() => navigate('/')}
                    className="mt-4 px-6 py-2 bg-[#2874f0] text-white font-bold rounded-sm"
                >
                    Go Back Home
                </button>
            </div>
        );
    }

    const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

    return (
        <div className="bg-white min-h-screen pb-20">
            <div className="max-w-[1248px] mx-auto px-4 py-4">

                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
                    <button onClick={() => navigate('/')} className="hover:text-[#2874f0]">Home</button>
                    <ChevronRight size={12} />
                    <span>{product.brand}</span>
                    <ChevronRight size={12} />
                    <span className="text-gray-900 font-medium">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left: Image Container */}
                    <div className="lg:col-span-5">
                        <div className="bg-white border border-gray-100 rounded-sm p-4 sticky top-24">
                            <div className="relative aspect-square flex items-center justify-center mb-4 group">
                                <img
                                    src={product.imageUrls[activeImageIndex]}
                                    alt={product.name}
                                    className="h-full object-contain transition-all duration-300"
                                />

                                {product.imageUrls.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setActiveImageIndex((prev) => (prev === 0 ? product.imageUrls.length - 1 : prev - 1))}
                                            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 shadow-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button
                                            onClick={() => setActiveImageIndex((prev) => (prev === product.imageUrls.length - 1 ? 0 : prev + 1))}
                                            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 shadow-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Image Indicators / Thumbnails */}
                            <div className="flex justify-center gap-2 mb-8">
                                {product.imageUrls.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={`w-2.5 h-2.5 rounded-full border transition-all ${activeImageIndex === idx ? 'bg-[#2874f0] border-[#2874f0] w-6' : 'bg-gray-200 border-gray-300'}`}
                                    />
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowSummary(true)}
                                    className="flex-1 bg-[#fb641b] text-white py-4 font-bold rounded-sm shadow-sm hover:bg-[#f4511e] transition-colors flex items-center justify-center gap-2 uppercase tracking-wide"
                                >
                                    <Zap size={18} /> Buy Now on EMI
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="lg:col-span-7">
                        <section className="mb-6">
                            <h1 className="text-xl font-medium text-gray-900 mb-2">{product.name} ({product.variant}, {product.color})</h1>

                            <div className="flex items-center gap-2 mb-3">
                                <div className="flex items-center gap-1 bg-[#388e3c] text-white text-[12px] font-bold px-1.5 py-0.5 rounded-sm">
                                    <span>4.8</span>
                                    <Star size={12} className="fill-white" />
                                </div>
                                <span className="text-sm font-medium text-gray-500">12,450 Ratings & 1,562 Reviews</span>
                            </div>

                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl font-bold text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
                                {product.mrp > product.price && (
                                    <>
                                        <span className="text-base text-gray-500 line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
                                        <span className="text-sm font-bold text-[#388e3c]">{discount}% off</span>
                                    </>
                                )}
                            </div>

                            <p className="text-sm font-bold text-[#2874f0] mb-6">Inclusive of all taxes</p>
                        </section>

                        {/* Variant Picker */}
                        <section className="mb-8 p-4 border border-gray-100 rounded-sm bg-gray-50/50">
                            <VariantSelection
                                currentProductId={product.id}
                                currentSlug={product.slug}
                                variants={product.variants || []}
                                productFamily={product.name}
                                brand={product.brand}
                            />
                        </section>

                        {/* Tabs content */}
                        <div className="border border-gray-100 rounded-sm overflow-hidden">
                            <div className="flex bg-gray-50 border-b border-gray-100">
                                {(['plans', 'overview', 'specs'] as const).map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-8 py-4 text-sm font-bold transition-colors ${activeTab === tab
                                            ? 'text-[#2874f0] bg-white border-b-2 border-[#2874f0]'
                                            : 'text-gray-500 hover:text-[#2874f0]'
                                            }`}
                                    >
                                        {tab === 'plans' ? 'EMI Plans' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>

                            <div className="p-6">
                                {activeTab === 'plans' && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 gap-3">
                                            {product.emiPlans.map(plan => (
                                                <button
                                                    key={plan.id}
                                                    onClick={() => setSelectedPlan(plan)}
                                                    className={`p-4 border rounded-sm text-left transition-all flex items-center justify-between ${selectedPlan?.id === plan.id
                                                        ? 'bg-blue-50 border-[#2874f0] ring-1 ring-[#2874f0]'
                                                        : 'bg-white border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div>
                                                        <div className="text-[10px] font-bold text-[#2874f0] uppercase mb-1">{plan.tenure} Months Plan</div>
                                                        <div className="text-lg font-bold text-gray-900">₹{plan.monthlyAmount.toLocaleString('en-IN')}/mo</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-xs font-medium text-gray-500">Interest: {plan.interestRate}% pa</div>
                                                        {plan.cashback > 0 && <div className="text-xs font-bold text-[#388e3c]">₹{plan.cashback} Cashback</div>}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                        <div className="text-[11px] text-gray-400 mt-4 p-3 bg-gray-50 rounded-sm italic border border-gray-100 uppercase tracking-tighter">
                                            *Plans are calculated against your mutual fund collateral. Terms & conditions apply.
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'overview' && (
                                    <div className="space-y-6">
                                        <div className="bg-blue-50/50 p-4 border-l-4 border-[#2874f0] rounded-r-sm">
                                            <p className="text-sm text-gray-700 italic leading-relaxed">
                                                {product.description}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                                <Info size={16} className="text-[#2874f0]" /> Key Highlights
                                            </h3>
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
                                                {product.highlights.map((h, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-2 shrink-0"></span>
                                                        {h}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'specs' && (
                                    <div className="border border-gray-100 rounded-sm">
                                        {[
                                            { label: 'Brand', value: product.brand },
                                            { label: 'Model Name', value: product.name },
                                            { label: 'Variant', value: product.variant },
                                            { label: 'Color', value: product.color },
                                            { label: 'Warranty', value: '1 Year Manufacturer' },
                                            { label: 'Stock Status', value: 'In Stock' }
                                        ].map((spec, i) => (
                                            <div key={i} className="grid grid-cols-4 py-4 px-6 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                                <span className="text-sm text-gray-500 font-medium">{spec.label}</span>
                                                <span className="text-sm text-gray-800 font-bold col-span-3">{spec.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {selectedPlan && (
                <SelectionSummaryModal
                    isOpen={showSummary}
                    onClose={() => setShowSummary(false)}
                    product={product}
                    plan={selectedPlan}
                />
            )}
        </div>
    );
};

export default ProductDetailPage;
