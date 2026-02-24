import React from 'react';
import { X, Wallet, Calendar, Percent, Gift, ShieldCheck } from 'lucide-react';
import type { Product, EMIPlan } from '../types';

interface SelectionSummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
    plan: EMIPlan;
}

const SelectionSummaryModal: React.FC<SelectionSummaryModalProps> = ({ isOpen, onClose, product, plan }) => {
    const totalPayable = plan.monthlyAmount * plan.tenure;
    const netAfterCashback = totalPayable - plan.cashback;
    const savings = product.mrp - product.price + plan.cashback;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-white rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800">Order Summary</h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Product Brief */}
                    <div className="flex gap-4 border-b border-gray-50 pb-6">
                        <div className="w-16 h-16 border border-gray-100 rounded-sm p-2 flex items-center justify-center shrink-0">
                            <img src={product.imageUrls[0]} alt={product.name} className="h-full object-contain" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-800 text-sm leading-tight mb-1">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.variant} | {product.color}</p>
                            <div className="mt-2 font-bold text-[#2874f0]">₹{product.price.toLocaleString('en-IN')}</div>
                        </div>
                    </div>

                    {/* EMI Plan Segment */}
                    <div className="space-y-4">
                        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Plan Highlights</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-sm border border-gray-100">
                                <div className="text-[10px] font-bold text-gray-500 uppercase mb-1">Monthly EMI</div>
                                <div className="text-lg font-bold text-[#2874f0]">₹{plan.monthlyAmount.toLocaleString('en-IN')}</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-sm border border-gray-100">
                                <div className="text-[10px] font-bold text-gray-500 uppercase mb-1">Tenure</div>
                                <div className="text-lg font-bold text-gray-800">{plan.tenure} Months</div>
                            </div>
                        </div>

                        <div className="p-4 bg-emerald-50 rounded-sm border border-emerald-100 flex items-center gap-3">
                            <Gift size={18} className="text-[#388e3c]" />
                            <div>
                                <div className="text-sm font-bold text-[#388e3c]">Bonus Reward Applied</div>
                                <div className="text-xs text-[#388e3c]/70">Instant cashback of ₹{plan.cashback.toLocaleString('en-IN')} on completion</div>
                            </div>
                        </div>
                    </div>

                    {/* Final Billing */}
                    <div className="space-y-3 bg-gray-50 p-6 rounded-sm border border-gray-200">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Regular Price (Total)</span>
                            <span className="text-gray-800 font-medium">₹{totalPayable.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Cashback Reward</span>
                            <span className="text-[#388e3c] font-bold">- ₹{plan.cashback.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
                            <span className="font-bold text-gray-800">Effective Amount</span>
                            <span className="text-xl font-bold text-gray-900">₹{netAfterCashback.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="bg-blue-600 -mx-6 -mb-6 px-6 py-3 mt-4 flex justify-between items-center text-white">
                            <span className="text-xs font-medium opacity-90">Total Savings on this Deal</span>
                            <span className="font-bold">₹{savings.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-6 border-t border-gray-100 bg-white">
                    <button
                        onClick={onClose}
                        className="w-full bg-[#fb641b] text-white py-4 font-bold rounded-sm shadow-md hover:bg-[#f4511e] transition-colors flex items-center justify-center gap-3"
                    >
                        <ShieldCheck size={20} /> CONFIRM ACQUISITION
                    </button>
                    <p className="mt-4 text-center text-[10px] text-gray-400 font-medium uppercase tracking-[0.1em]">
                        Transaction secured with 256-bit encryption
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SelectionSummaryModal;
