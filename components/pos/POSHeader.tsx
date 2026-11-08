'use client';

import { Search, X } from 'lucide-react';
import { useCartStore } from '../../stores/useCartStore';

export default function POSHeader() {
    const { searchQuery, setSearchQuery } = useCartStore();

    return (
        <div className="bg-green-600 p-4 sticky top-0 z-40 shadow-md transition-all">
            <h1 className="text-white font-bold text-xl mb-4">Kasir WarungKu</h1>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border-transparent rounded-xl leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-green-400/50 sm:text-sm transition-all shadow-sm"
                    placeholder="Cari nama barang..."
                />
                {/* Tombol Clear Search */}
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                        <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    </button>
                )}
            </div>
        </div>
    );
}