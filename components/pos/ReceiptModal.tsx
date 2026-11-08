'use client';

import { CheckCircle2 } from 'lucide-react';
import { CartItem } from '../../types/pos';

interface ReceiptModalProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    totalPrice: number;
    paymentMethod: string;
}

export default function ReceiptModal({ isOpen, onClose, items, totalPrice, paymentMethod }: ReceiptModalProps) {
    if (!isOpen) return null;

    const formattedTotal = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(totalPrice);

    const date = new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });

    return (
        <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-2xl p-6 flex flex-col items-center animate-in zoom-in-95">
                <CheckCircle2 className="text-green-500 w-16 h-16 mb-4" />
                <h2 className="text-xl font-bold text-gray-800 mb-1">Transaksi Berhasil!</h2>
                <p className="text-sm text-gray-500 mb-6">{date}</p>

                <div className="w-full border-t border-dashed border-gray-300 py-4 mb-4">
                    <p className="text-xs text-gray-400 mb-2">RINCIAN PESANAN</p>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                        {items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-gray-700 truncate pr-2">
                                    {item.quantity}x {item.name}
                                </span>
                                <span className="text-gray-800 font-medium">
                                    Rp{(item.price * item.quantity).toLocaleString('id-ID')}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full bg-gray-50 p-4 rounded-xl mb-6">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">Metode Bayar</span>
                        <span className="font-semibold text-gray-800">{paymentMethod}</span>
                    </div>
                    <div className="flex justify-between text-base mt-2">
                        <span className="font-bold text-gray-800">Total</span>
                        <span className="font-bold text-green-600">{formattedTotal}</span>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-xl transition-colors"
                >
                    Selesai & Tutup
                </button>
            </div>
        </div>
    );
}