'use client';

import { Search, X, Store, User } from 'lucide-react';
import { useCartStore } from '../../stores/useCartStore';

export default function POSHeader() {
    const { searchQuery, setSearchQuery } = useCartStore();

    return (
        <header className="sticky top-0 z-40 flex flex-col shadow-sm">
            {/* 1. Navbar Utama (Lapis Atas) */}
            <div className="flex items-center justify-between bg-white px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                    <div className="bg-green-100 p-1.5 rounded-lg">
                        <Store className="text-green-600 w-5 h-5" />
                    </div>
                    <h1 className="font-bold text-xl text-gray-800 tracking-tight">WarungKu</h1>
                </div>

                {/* Ikon Profil Kasir */}
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                    <User className="text-gray-500 w-4 h-4" />
                </div>
            </div>

            {/* 2. Search Bar Area (Lapis Bawah) */}
            <div className="bg-white/80 backdrop-blur-md px-4 py-3 border-b border-gray-100">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl leading-5 bg-gray-50 hover:bg-gray-100/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/30 focus:border-green-500 sm:text-sm transition-all shadow-inner"
                        placeholder="Cari nama barang atau barcode..."
                    />

                    {/* Tombol Hapus Pencarian */}
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            <X className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors" />
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}