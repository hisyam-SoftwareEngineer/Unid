'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    totalPrice: number;
    onConfirm: (method: string) => void;
}

export default function CheckoutModal({ isOpen, onClose, totalPrice, onConfirm }: CheckoutModalProps) {
    const [selectedMethod, setSelectedMethod] = useState<string>('Cash');

    if (!isOpen) return null;

    const formattedTotal = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(totalPrice);

    const methods = ['Cash', 'QRIS', 'Transfer Bank'];

    return (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-end sm:items-center justify-center">
            <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-4 animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-800">Pilih Pembayaran</h2>
                    <button onClick={onClose} className="text-gray-500 p-1 rounded-full bg-gray-100 hover:bg-gray-200">
                        <X size={20} />
                    </button>
                </div>

                <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-1">Total Tagihan</p>
                    <p className="text-2xl font-bold text-green-600">{formattedTotal}</p>
                </div>

                <div className="space-y-3 mb-6">
                    {methods.map((method) => (
                        <label key={method} className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors ${selectedMethod === method ? 'border-green-600 bg-green-50' : 'border-gray-200'}`}>
                            <span className="font-medium text-gray-800">{method}</span>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value={method}
                                checked={selectedMethod === method}
                                onChange={(e) => setSelectedMethod(e.target.value)}
                                className="w-5 h-5 text-green-600 focus:ring-green-500"
                            />
                        </label>
                    ))}
                </div>

                <button
                    onClick={() => onConfirm(selectedMethod)}
                    className="w-full bg-green-600 active:bg-green-700 text-white font-bold py-3.5 rounded-xl transition-colors"
                >
                    Konfirmasi & Bayar
                </button>
            </div>
        </div>
    );
}