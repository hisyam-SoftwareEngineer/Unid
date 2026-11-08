'use client';

import ProductCard from './ProductCard';
import { Product } from '../../types/pos';
import { useCartStore } from '../../stores/useCartStore';
import { PackageX } from 'lucide-react';

// Data sementara dengan tambahan link gambar
const DUMMY_PRODUCTS: Product[] = [
    {
        id: '1', name: 'Indomie Goreng Special', price: 3500, stock: 50, category: 'Makanan',
        image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&q=80&w=200&h=200'
    },
    {
        id: '2', name: 'Beras Ramos 5kg', price: 65000, stock: 12, category: 'Sembako',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&q=80&w=200&h=200'
    },
    {
        id: '3', name: 'Aqua Botol 600ml', price: 3000, stock: 24, category: 'Minuman',
        image: 'https://images.unsplash.com/photo-1605810730850-c0f45cb716af?auto=format&fit=crop&q=80&w=200&h=200'
    },
    {
        id: '4', name: 'Telur Ayam 1kg', price: 28000, stock: 5, category: 'Sembako',
        image: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&q=80&w=200&h=200'
    },
    {
        id: '5', name: 'Minyak Goreng Bimoli 1L', price: 18000, stock: 0, category: 'Sembako',
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=200&h=200'
    },
    {
        id: '6', name: 'Sabun Mandi Lifebuoy', price: 4000, stock: 30, category: 'Keperluan Mandi',
        image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&q=80&w=200&h=200'
    },
];

export default function ProductGrid() {
    const searchQuery = useCartStore((state) => state.searchQuery);

    // Filter produk berdasarkan nama (case-insensitive) real-time
    const filteredProducts = DUMMY_PRODUCTS.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // UI Jika barang tidak ditemukan setelah di-search
    if (filteredProducts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 mt-10 animate-in fade-in zoom-in duration-300">
                <div className="bg-gray-100 p-4 rounded-full mb-3 shadow-inner">
                    <PackageX className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">Barang "{searchQuery}" tidak ditemukan.</p>
                <p className="text-gray-400 text-sm mt-1">Coba kata kunci lain.</p>
            </div>
        );
    }

    return (
        <div className="p-4 grid grid-cols-2 gap-4 pb-32">
            {filteredProducts.map((product) => (
                <div key={product.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <ProductCard product={product} />
                </div>
            ))}
        </div>
    );
}