import POSHeader from '@/components/pos/POSHeader';
import ProductGrid from '@/components/pos/ProductGrid';
import CartBottomBar from '@/components/pos/CartBottomBar';

export default function POSPage() {
    return (
        <div className="min-h-screen bg-gray-50 relative max-w-md mx-auto sm:border-x sm:border-gray-200">
            {/* max-w-md mx-auto dibikin biar pas dites di laptop, tampilannya tetep seukuran HP (Mobile First) */}
            <POSHeader />
            <ProductGrid />
            <CartBottomBar />
        </div>
    );
}