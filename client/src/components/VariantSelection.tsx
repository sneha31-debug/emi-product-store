import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface VariantOption {
    id: number;
    variant: string;
    color: string;
    price: number;
    imageUrl: string;
}

interface VariantSelectionProps {
    currentProductId: number;
    variants: VariantOption[];
}

const VariantSelection: React.FC<VariantSelectionProps> = ({ currentProductId, variants }) => {
    const navigate = useNavigate();

    // Unique colors and variants
    const colors = Array.from(new Set(variants.map(v => v.color)));
    const storages = Array.from(new Set(variants.map(v => v.variant)));

    const currentProduct = variants.find(v => v.id === currentProductId);

    const handleColorChange = (color: string) => {
        // Find a product with the new color and the same storage
        const match = variants.find(v => v.color === color && v.variant === currentProduct?.variant)
            || variants.find(v => v.color === color);
        if (match) navigate(`/products/${match.id}`);
    };

    const handleStorageChange = (storage: string) => {
        // Find a product with the same color and new storage
        const match = variants.find(v => v.variant === storage && v.color === currentProduct?.color)
            || variants.find(v => v.variant === storage);
        if (match) navigate(`/products/${match.id}`);
    };

    return (
        <div className="space-y-8 mb-10">
            {/* Color Selection */}
            <div>
                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Choose Color</h4>
                <div className="flex flex-wrap gap-4">
                    {colors.map((color) => {
                        const variantWithColor = variants.find(v => v.color === color);
                        const isActive = currentProduct?.color === color;

                        return (
                            <button
                                key={color}
                                onClick={() => handleColorChange(color)}
                                className={`relative p-1 rounded-full border-2 transition-all ${isActive ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-slate-100 hover:border-slate-300'
                                    }`}
                                title={color}
                            >
                                <div
                                    className="w-10 h-10 rounded-full border border-slate-200"
                                    style={{ backgroundColor: color.toLowerCase().split(' ').pop() }}
                                />
                                {isActive && (
                                    <motion.div
                                        layoutId="color-active"
                                        className="absolute -inset-1 rounded-full border-2 border-indigo-600"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Storage Selection */}
            <div>
                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Select Storage</h4>
                <div className="flex flex-wrap gap-3">
                    {storages.map((storage) => {
                        const isActive = currentProduct?.variant === storage;
                        return (
                            <button
                                key={storage}
                                onClick={() => handleStorageChange(storage)}
                                className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all border-2 ${isActive
                                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                                        : 'border-slate-100 text-slate-600 hover:border-slate-300 bg-white'
                                    }`}
                            >
                                {storage}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default VariantSelection;
