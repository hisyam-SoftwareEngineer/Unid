import { ReactNode } from 'react';

export const metadata = {
    title: 'Kasir POS - WarungKu',
    description: 'Sistem Point of Sale Mobile WarungKu',
};

export default function POSLayout({ children }: { children: ReactNode }) {
    return (
        <section className="bg-gray-50 min-h-screen font-sans antialiased">
            {/* 
        children ini akan otomatis merender isi dari page.tsx
        yang udah lu buat sebelumnya 
      */}
            {children}
        </section>
    );
}