import React, { useState } from 'react';
import { useStore, Product, PaymentMethod } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, ShoppingCart, Trash2, Plus, Minus, ScanBarcode, QrCode, CreditCard, Banknote } from 'lucide-react';

type CartItem = Product & { quantity: number };

export default function POS() {
  const { products, addTransaction, updateStock } = useStore();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.barcode.includes(searchQuery)
  );

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.quantity < product.stock) {
        setCart(cart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      }
    } else {
      if (product.stock > 0) {
        setCart([...cart, { ...product, quantity: 1 }]);
      }
    }
  };

  const handleBarcodeSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const product = products.find(p => p.barcode === barcodeInput);
      if (product && product.stock > 0) {
        addToCart(product);
      } else if (product && product.stock === 0) {
        alert('Stok produk habis!');
      } else {
        alert('Produk tidak ditemukan!');
      }
      setBarcodeInput('');
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        if (newQuantity > 0 && newQuantity <= item.stock) {
          return { ...item, quantity: newQuantity };
        }
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    // Record transaction
    addTransaction({
      type: 'INCOME',
      amount: total,
      description: `Penjualan Kasir`,
      category: 'Penjualan',
      paymentMethod: paymentMethod,
      items: cart.map(c => ({
        productId: c.id,
        name: c.name,
        quantity: c.quantity,
        price: c.price
      }))
    });

    // Update stock
    cart.forEach(item => {
      updateStock(item.id, -item.quantity);
    });

    // Clear cart
    setCart([]);
    setShowPaymentModal(false);
    setPaymentMethod('CASH');
    alert('Transaksi Berhasil!');
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Product List */}
      <div className="flex-1 flex flex-col space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Kasir (POS)</h2>
          <p className="text-gray-500">Pilih produk atau scan barcode untuk ditambahkan ke keranjang.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Cari nama produk..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative w-64">
            <ScanBarcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Scan Barcode / ID..." 
              className="pl-9 border-blue-300 focus-visible:ring-blue-500"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              onKeyDown={handleBarcodeSubmit}
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
            {filteredProducts.map(product => (
              <Card 
                key={product.id} 
                className={`cursor-pointer transition-all hover:border-blue-500 hover:shadow-md ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => product.stock > 0 && addToCart(product)}
              >
                <CardContent className="p-4 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-xs font-medium text-blue-600">{product.category}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{product.barcode}</div>
                    </div>
                    <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                  </div>
                  <div className="mt-4 flex items-end justify-between">
                    <span className="font-bold text-gray-900">Rp {product.price.toLocaleString('id-ID')}</span>
                    <span className="text-xs text-gray-500">Stok: {product.stock}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-96 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" /> Keranjang
          </h3>
          <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-full">
            {cart.reduce((sum, item) => sum + item.quantity, 0)} Item
          </span>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
              <ShoppingCart className="w-12 h-12 opacity-20" />
              <p>Keranjang masih kosong</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-gray-900 truncate">{item.name}</h4>
                  <p className="text-sm text-gray-500">Rp {item.price.toLocaleString('id-ID')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, -1)}>
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-4 text-center text-sm font-medium">{item.quantity}</span>
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, 1)}>
                    <Plus className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50 ml-1" onClick={() => removeFromCart(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Total Pembayaran</span>
            <span className="text-xl font-bold text-gray-900">Rp {total.toLocaleString('id-ID')}</span>
          </div>
          <Button 
            className="w-full h-12 text-lg" 
            disabled={cart.length === 0}
            onClick={() => setShowPaymentModal(true)}
          >
            Bayar Sekarang
          </Button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[400px] overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Pilih Metode Pembayaran</h3>
              <p className="text-gray-500 text-sm mt-1">Total: <span className="font-bold text-gray-900">Rp {total.toLocaleString('id-ID')}</span></p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <button 
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'CASH' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-200'}`}
                  onClick={() => setPaymentMethod('CASH')}
                >
                  <Banknote className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">Tunai</span>
                </button>
                <button 
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'QRIS' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-200'}`}
                  onClick={() => setPaymentMethod('QRIS')}
                >
                  <QrCode className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">QRIS</span>
                </button>
                <button 
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'TRANSFER' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-200'}`}
                  onClick={() => setPaymentMethod('TRANSFER')}
                >
                  <CreditCard className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">Transfer</span>
                </button>
              </div>

              {paymentMethod === 'QRIS' && (
                <div className="mt-6 flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=JURAGANKAS_PAY_${total}`} alt="QRIS Code" className="w-48 h-48 rounded-lg" />
                  <p className="text-sm text-gray-500 mt-4 text-center">Scan QR Code ini menggunakan aplikasi e-wallet atau m-banking pelanggan.</p>
                </div>
              )}

              {paymentMethod === 'TRANSFER' && (
                <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-sm font-medium text-gray-900 mb-2">Informasi Rekening:</p>
                  <p className="text-sm text-gray-600">BCA: 1234567890 a.n JuraganKas</p>
                  <p className="text-sm text-gray-600">Mandiri: 0987654321 a.n JuraganKas</p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <Button variant="outline" onClick={() => setShowPaymentModal(false)}>Batal</Button>
              <Button onClick={handleCheckout}>Konfirmasi Pembayaran</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
