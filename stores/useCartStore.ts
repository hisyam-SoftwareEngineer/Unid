import { create } from 'zustand';
import { CartItem, Product } from '../types/pos';

interface CartState {
    items: CartItem[];
    totalPrice: number;
    totalItems: number;
    searchQuery: string; // State baru buat fitur search
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    clearCart: () => void;
    setSearchQuery: (query: string) => void; // Fungsi update search
}

export const useCartStore = create<CartState>((set) => ({
    items: [],
    totalPrice: 0,
    totalItems: 0,
    searchQuery: '',

    setSearchQuery: (query) => set({ searchQuery: query }),

    addItem: (product) => set((state) => {
        const existingItem = state.items.find((item) => item.id === product.id);
        if (existingItem && existingItem.quantity >= product.stock) {
            return state;
        }
        let newItems;
        if (existingItem) {
            newItems = state.items.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
        } else {
            newItems = [...state.items, { ...product, quantity: 1 }];
        }
        return {
            items: newItems,
            totalPrice: state.totalPrice + product.price,
            totalItems: state.totalItems + 1,
        };
    }),

    removeItem: (productId) => set((state) => {
        const existingItem = state.items.find((item) => item.id === productId);
        if (!existingItem) return state;
        let newItems;
        if (existingItem.quantity > 1) {
            newItems = state.items.map((item) =>
                item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
            );
        } else {
            newItems = state.items.filter((item) => item.id !== productId);
        }
        return {
            items: newItems,
            totalPrice: state.totalPrice - existingItem.price,
            totalItems: state.totalItems - 1,
        };
    }),

    clearCart: () => set({ items: [], totalPrice: 0, totalItems: 0 }),
}));