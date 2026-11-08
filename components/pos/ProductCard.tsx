'use client';

import { Product } from '../../types/pos';
import { useCartStore } from '../../stores/useCartStore';
import { Plus } from 'lucide-react';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { items, addItem } = useCartStore();

    // Hitung stok secara real-time berdasarkan isi keranjang
    const itemInCart = items.find((item) => item.id === product.id);
    const qtyInCart = itemInCart ? itemInCart.quantity : 0;
    const remainingStock = product.stock - qtyInCart;

    const formattedPrice = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(product.price);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out">

            {/* Bagian Gambar dengan Efek Hover & Grayscale */}
            <div className="h-32 w-full relative overflow-hidden bg-gray-100">
                <img
                    src={product.image || 'https://placehold.co/200x200/e2e8f0/64748b?text=No+Image'}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${remainingStock <= 0 ? 'grayscale opacity-60' : ''}`}
                />

                {/* Label visual KOSONG atau SISA STOK */}
                {remainingStock === 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300">
                        <span className="text-white font-bold text-sm px-3 py-1 bg-red-600 rounded-full shadow-md">KOSONG</span>
                    </div>
                )}
                {remainingStock > 0 && remainingStock <= 5 && (
                    <span className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse shadow-sm z-10">
                        Sisa {remainingStock}
                    </span>
                )}
            </div>

            {/* Detail Produk */}
            <div className="p-3 flex flex-col flex-grow">
                <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-green-600 transition-colors">
                    {product.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">Stok: <span className={remainingStock === 0 ? 'text-red-500 font-bold' : ''}>{remainingStock}</span></p>
                <p className="text-sm font-bold text-green-600 mt-1">{formattedPrice}</p>

                {/* Tombol Tambah */}
                <button
                    onClick={() => addItem(product)}
                    disabled={remainingStock <= 0}
                    className="mt-auto pt-3 outline-none"
                >
                    <div className={`w-full py-2 rounded-lg flex items-center justify-center gap-1 text-sm font-medium text-white transition-all duration-200 
            ${remainingStock > 0
                            ? 'bg-green-600 hover:bg-green-500 active:scale-95 shadow-md hover:shadow-green-500/30'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        <Plus size={16} className={remainingStock > 0 ? "group-hover:rotate-90 transition-transform duration-300" : ""} />
                        {remainingStock > 0 ? 'Tambah' : 'Habis'}
                    </div>
                </button>
            </div>
        </div>
    );
}