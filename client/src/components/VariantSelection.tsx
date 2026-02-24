import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { ProductVariant } from '../types';

interface VariantSelectionProps {
    currentProductId: number;
    currentSlug: string;
    variants: ProductVariant[];
    productFamily: string;
    brand: string;
}

const VariantSelection: React.FC<VariantSelectionProps> = ({
    currentProductId,
    currentSlug,
    variants,
    productFamily,
    brand
}) => {
    const navigate = useNavigate();

    const currentProduct = variants.find(v => v.id === currentProductId)
        ?? variants.find(v => v.slug === currentSlug)
        ?? variants[0];

    const colors = Array.from(new Set(variants.map(v => v.color)));
    const storages = Array.from(new Set(variants.map(v => v.variant)));

    const handleColorChange = (color: string) => {
        const match =
            variants.find(v => v.color === color && v.variant === currentProduct?.variant) ||
            variants.find(v => v.color === color);
        if (match) {
            const familySlug = productFamily.toLowerCase().replace(/ /g, '-');
            navigate(`/${familySlug}-${brand.toLowerCase()}/${match.slug}`);
        }
    };

    const handleStorageChange = (storage: string) => {
        const match =
            variants.find(v => v.variant === storage && v.color === currentProduct?.color) ||
            variants.find(v => v.variant === storage);
        if (match) {
            const familySlug = productFamily.toLowerCase().replace(/ /g, '-');
            navigate(`/${familySlug}-${brand.toLowerCase()}/${match.slug}`);
        }
    };

    return (
        <div className="space-y-6">
            {/* Color Selection */}
            <div>
                <h4 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Color:</h4>
                <div className="flex flex-wrap gap-3">
                    {colors.map(color => {
                        const isActive = currentProduct?.color === color;
                        return (
                            <button
                                key={color}
                                onClick={() => handleColorChange(color)}
                                className={`px-4 py-2 rounded-sm text-sm font-medium border transition-all ${isActive
                                    ? 'border-[#2874f0] text-[#2874f0] bg-blue-50 font-bold'
                                    : 'border-gray-200 text-gray-700 hover:border-gray-400'
                                    }`}
                            >
                                {color}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Storage Selection */}
            {storages.length > 1 && (
                <div>
                    <h4 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Storage:</h4>
                    <div className="flex flex-wrap gap-3">
                        {storages.map(storage => {
                            const isActive = currentProduct?.variant === storage;
                            return (
                                <button
                                    key={storage}
                                    onClick={() => handleStorageChange(storage)}
                                    className={`px-4 py-2 rounded-sm text-sm font-medium border transition-all ${isActive
                                        ? 'border-[#2874f0] text-[#2874f0] bg-blue-50 font-bold'
                                        : 'border-gray-200 text-gray-700 hover:border-gray-400'
                                        }`}
                                >
                                    {storage}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VariantSelection;
