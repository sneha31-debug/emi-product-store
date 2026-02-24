import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X, Wallet, Calendar, Percent, Gift } from 'lucide-react';
import type { Product, EMIPlan } from '../types';

interface SelectionSummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
    plan: EMIPlan;
}

const SelectionSummaryModal: React.FC<SelectionSummaryModalProps> = ({ isOpen, onClose, product, plan }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-8 text-center pt-12">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring', damping: 12, stiffness: 200 }}
                                className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
                            >
                                <CheckCircle2 size={40} />
                            </motion.div>

                            <h2 className="text-3xl font-black text-slate-900 mb-2">Configuration Saved!</h2>
                            <p className="text-slate-500 font-medium mb-8">Your premium installment plan is ready.</p>

                            <div className="bg-slate-50 rounded-3xl p-6 text-left space-y-4 mb-8">
                                <div className="flex items-center space-x-4 pb-4 border-b border-slate-200">
                                    <div className="w-16 h-16 bg-white rounded-2xl p-2 border border-slate-100 shrink-0">
                                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">{product.name}</h3>
                                        <p className="text-sm font-medium text-slate-500">{product.variant} • {product.color}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                            <Wallet size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Installment</p>
                                            <p className="font-bold text-slate-900">₹{plan.monthlyAmount.toLocaleString()}/mo</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                            <Calendar size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Tenure</p>
                                            <p className="font-bold text-slate-900">{plan.tenure} Months</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                                            <Percent size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Interest</p>
                                            <p className="font-bold text-slate-900">{plan.interestRate}% P.A.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                                            <Gift size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Cashback</p>
                                            <p className="font-bold text-slate-900">₹{plan.cashback.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98]"
                            >
                                Proceed to Checkout
                            </button>
                        </div>

                        <div className="bg-indigo-600 h-2 w-full"></div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SelectionSummaryModal;
