import React from 'react';
import { useStore } from '@/context/StoreContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDownRight, ArrowUpRight, Receipt, CreditCard, QrCode, Banknote } from 'lucide-react';

export default function Transactions() {
  const { transactions } = useStore();

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'CASH': return <Banknote className="w-4 h-4" />;
      case 'QRIS': return <QrCode className="w-4 h-4" />;
      case 'TRANSFER': return <CreditCard className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Riwayat Transaksi</h2>
        <p className="text-gray-500">Daftar lengkap semua transaksi yang telah dilakukan.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-blue-600" />
            Semua Transaksi
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-medium">Tanggal & Waktu</th>
                  <th className="px-6 py-4 font-medium">Keterangan</th>
                  <th className="px-6 py-4 font-medium">Kategori</th>
                  <th className="px-6 py-4 font-medium">Metode</th>
                  <th className="px-6 py-4 font-medium text-right">Nominal</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-medium text-gray-900">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          t.type === 'INCOME' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {t.type === 'INCOME' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        </div>
                        {t.description}
                      </div>
                      {t.items && t.items.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1 ml-8">
                          Item: {t.items.map(item => `${item.name} (${item.quantity}x)`).join(', ')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded-md text-xs">{t.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      {t.paymentMethod !== '-' ? (
                        <div className="flex items-center gap-1.5 text-gray-600 bg-gray-50 px-2 py-1 rounded-md w-fit text-xs font-medium">
                          {getPaymentIcon(t.paymentMethod)}
                          {t.paymentMethod}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className={`px-6 py-4 text-right font-medium ${t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === 'INCOME' ? '+' : '-'}Rp {t.amount.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Belum ada transaksi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
