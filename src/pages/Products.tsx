import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Package, Plus, RefreshCw } from 'lucide-react';

export default function Products() {
  const { products, addProduct, restockProduct } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [restockItem, setRestockItem] = useState<string | null>(null);
  const [restockQty, setRestockQty] = useState('');

  const [formData, setFormData] = useState({
    barcode: '',
    name: '',
    costPrice: '',
    price: '',
    stock: '',
    category: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.stock || !formData.category || !formData.costPrice || !formData.barcode) return;

    addProduct({
      barcode: formData.barcode,
      name: formData.name,
      costPrice: Number(formData.costPrice),
      price: Number(formData.price),
      stock: Number(formData.stock),
      category: formData.category
    });

    setIsAdding(false);
    setFormData({ barcode: '', name: '', costPrice: '', price: '', stock: '', category: '' });
  };

  const handleRestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (restockItem && restockQty) {
      restockProduct(restockItem, Number(restockQty));
      setRestockItem(null);
      setRestockQty('');
      alert('Restok berhasil! Pengeluaran telah dicatat di Keuangan.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Produk & Inventaris</h2>
          <p className="text-gray-500">Kelola daftar produk, barcode, dan stok barang Anda.</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)}>
          <Plus className="w-4 h-4 mr-2" /> Tambah Produk
        </Button>
      </div>

      {isAdding && (
        <Card className="border-blue-100 shadow-md">
          <CardHeader>
            <CardTitle>Tambah Produk Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Barcode / ID Produk</label>
                  <Input 
                    placeholder="Contoh: 899123..." 
                    value={formData.barcode}
                    onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nama Produk</label>
                  <Input 
                    placeholder="Contoh: Kopi Hitam" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Kategori</label>
                  <Input 
                    placeholder="Contoh: Minuman" 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Harga Modal (Rp)</label>
                  <Input 
                    type="number" 
                    placeholder="Contoh: 10000" 
                    value={formData.costPrice}
                    onChange={(e) => setFormData({...formData, costPrice: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Harga Jual (Rp)</label>
                  <Input 
                    type="number" 
                    placeholder="Contoh: 15000" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Stok Awal</label>
                  <Input 
                    type="number" 
                    placeholder="Contoh: 50" 
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>Batal</Button>
                <Button type="submit">Simpan Produk</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-medium">Barcode/ID</th>
                  <th className="px-6 py-4 font-medium">Nama Produk</th>
                  <th className="px-6 py-4 font-medium">Kategori</th>
                  <th className="px-6 py-4 font-medium">Harga Modal</th>
                  <th className="px-6 py-4 font-medium">Harga Jual</th>
                  <th className="px-6 py-4 font-medium text-center">Stok</th>
                  <th className="px-6 py-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      {p.barcode}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Package className="w-4 h-4 text-gray-500" />
                        </div>
                        {p.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded-md text-xs">{p.category}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      Rp {p.costPrice.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      Rp {p.price.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        p.stock > 10 ? 'bg-green-100 text-green-700' : 
                        p.stock > 0 ? 'bg-orange-100 text-orange-700' : 
                        'bg-red-100 text-red-700'
                      }`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="outline" size="sm" onClick={() => setRestockItem(p.id)}>
                        <RefreshCw className="w-3 h-3 mr-1" /> Restok
                      </Button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      Belum ada produk.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Restock Modal */}
      {restockItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-[400px] overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Restok Produk</h3>
              <p className="text-gray-500 text-sm mt-1">
                {products.find(p => p.id === restockItem)?.name}
              </p>
            </div>
            <form onSubmit={handleRestock}>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Jumlah Tambahan Stok</label>
                  <Input 
                    type="number" 
                    placeholder="Contoh: 20" 
                    value={restockQty}
                    onChange={(e) => setRestockQty(e.target.value)}
                    required
                    min="1"
                  />
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                  Total biaya restok (Stok x Harga Modal) akan otomatis dicatat sebagai <strong>Pengeluaran</strong> di menu Keuangan.
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                <Button type="button" variant="outline" onClick={() => { setRestockItem(null); setRestockQty(''); }}>Batal</Button>
                <Button type="submit">Konfirmasi Restok</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
