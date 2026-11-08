'use client';

import { useState } from 'react';
import { useCartStore } from '../../stores/useCartStore';
import { ShoppingCart } from 'lucide-react';
import CheckoutModal from './CheckoutModal';
import ReceiptModal from './ReceiptModal';

export default function CartBottomBar() {
    const { items, totalItems, totalPrice, clearCart } = useCartStore();

    // State untuk mengontrol pop-up
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);

    // State untuk menyimpan data struk sementara
    const [receiptData, setReceiptData] = useState({ items: [], paymentMethod: '' });

    if (totalItems === 0) return null;

    const formattedTotal = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(totalPrice);

    const handleConfirmPayment = (method: string) => {
        // 1. Simpan data belanjaan buat ditampilin di struk
        setReceiptData({ items: [...items] as any, paymentMethod: method });
        // 2. Tutup modal checkout
        setIsCheckoutOpen(false);
        // 3. Buka modal struk
        setIsReceiptOpen(true);

        // Note: Nanti di sini lu nambahin fungsi buat nembak API backend (POST /api/transactions)
    };

    const handleCloseReceipt = () => {
        // 1. Tutup modal struk
        setIsReceiptOpen(false);
        // 2. Kosongkan keranjang belanja
        clearCart();
    };

    return (
        <>
            {/* Bar Bawah */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] p-4 z-50">
                <div className="flex items-center justify-between max-w-md mx-auto">
                    <div>
                        <p className="text-xs text-gray-500">Total Pembayaran</p>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-lg text-gray-900">{formattedTotal}</span>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                {totalItems} item
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsCheckoutOpen(true)}
                        className="bg-green-600 active:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-sm transition-colors"
                    >
                        <ShoppingCart size={18} />
                        Bayar
                    </button>
                </div>
            </div>

            {/* Pop-up Modals */}
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                totalPrice={totalPrice}
                onConfirm={handleConfirmPayment}
            />

            <ReceiptModal
                isOpen={isReceiptOpen}
                onClose={handleCloseReceipt}
                items={receiptData.items}
                totalPrice={totalPrice}
                paymentMethod={receiptData.paymentMethod}
            />
        </>
    );
}