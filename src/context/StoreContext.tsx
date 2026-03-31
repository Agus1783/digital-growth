import React, { createContext, useContext, useState } from 'react';

export type Product = {
  id: string;
  barcode: string;
  name: string;
  costPrice: number;
  price: number;
  stock: number;
  category: string;
};

export type TransactionType = 'INCOME' | 'EXPENSE';
export type PaymentMethod = 'CASH' | 'QRIS' | 'TRANSFER' | '-';

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  description: string;
  category: string;
  paymentMethod: PaymentMethod;
  items?: { productId: string; name: string; quantity: number; price: number }[];
};

type StoreContextType = {
  products: Product[];
  transactions: Transaction[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateStock: (id: string, quantity: number) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  restockProduct: (id: string, quantity: number) => void;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const initialProducts: Product[] = [
  { id: '1', barcode: '8991234567890', name: 'Kopi Susu Gula Aren', costPrice: 10000, price: 18000, stock: 50, category: 'Minuman' },
  { id: '2', barcode: '8990987654321', name: 'Nasi Goreng Spesial', costPrice: 15000, price: 25000, stock: 30, category: 'Makanan' },
  { id: '3', barcode: '8991122334455', name: 'Roti Bakar Coklat', costPrice: 8000, price: 15000, stock: 20, category: 'Cemilan' },
];

const initialTransactions: Transaction[] = [
  { id: 't1', type: 'INCOME', amount: 150000, date: new Date(Date.now() - 86400000 * 2).toISOString(), description: 'Penjualan Harian', category: 'Penjualan', paymentMethod: 'CASH' },
  { id: 't2', type: 'EXPENSE', amount: 50000, date: new Date(Date.now() - 86400000 * 1).toISOString(), description: 'Beli Bahan Baku', category: 'Bahan Baku', paymentMethod: '-' },
  { id: 't3', type: 'INCOME', amount: 250000, date: new Date().toISOString(), description: 'Penjualan Harian', category: 'Penjualan', paymentMethod: 'QRIS' },
];

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const addProduct = (product: Omit<Product, 'id'>) => {
    setProducts([...products, { ...product, id: Math.random().toString(36).substr(2, 9) }]);
  };

  const updateStock = (id: string, quantity: number) => {
    setProducts(products.map(p => p.id === id ? { ...p, stock: p.stock + quantity } : p));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    setTransactions([{ ...transaction, id: Math.random().toString(36).substr(2, 9), date: new Date().toISOString() }, ...transactions]);
  };

  const restockProduct = (id: string, quantity: number) => {
    const product = products.find(p => p.id === id);
    if (product) {
      updateStock(id, quantity);
      addTransaction({
        type: 'EXPENSE',
        amount: product.costPrice * quantity,
        description: `Restok ${product.name} (${quantity} unit)`,
        category: 'Restok Barang',
        paymentMethod: 'CASH'
      });
    }
  };

  return (
    <StoreContext.Provider value={{ products, transactions, addProduct, updateStock, addTransaction, restockProduct }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
