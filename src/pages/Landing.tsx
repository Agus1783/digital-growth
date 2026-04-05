import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, ShoppingCart, Wallet } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-11 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">DGT</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Digital Growth Team</span>
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="#fitur" className="text-sm font-medium text-gray-600 hover:text-gray-900">Fitur</a>
            <a href="#harga" className="text-sm font-medium text-gray-600 hover:text-gray-900">Harga</a>
            <a href="#testimoni" className="text-sm font-medium text-gray-600 hover:text-gray-900">Testimoni</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Masuk</Button>
            </Link>
            <Link to="/register">
              <Button>Daftar Gratis</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight max-w-4xl mx-auto leading-tight">
          Kelola Bisnis UMKM Lebih <span className="text-blue-600">Mudah</span> dan <span className="text-blue-600">Menguntungkan</span>
        </h1>
        <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto">
          Satu aplikasi untuk kasir (POS), pencatatan keuangan, dan manajemen stok. Tinggalkan cara manual, beralih ke JuraganKas sekarang.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link to="/register">
            <Button size="lg" className="h-12 px-8 text-base">
              Mulai Sekarang <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="h-12 px-8 text-base">
            Pelajari Lebih Lanjut
          </Button>
        </div>
        
        <div className="mt-20 relative max-w-5xl mx-auto">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070" 
              alt="Dashboard Preview" 
              className="w-full h-auto object-cover opacity-90"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Fitur Lengkap untuk UMKM</h2>
            <p className="mt-4 text-lg text-gray-600">Semua yang Anda butuhkan untuk mengembangkan bisnis ada di sini.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Kasir (POS) Pintar</h3>
              <p className="text-gray-600">Catat transaksi penjualan dengan cepat. Mendukung berbagai metode pembayaran dan cetak struk.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Manajemen Keuangan</h3>
              <p className="text-gray-600">Pantau pemasukan dan pengeluaran bisnis Anda. Ketahui laba bersih secara real-time.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Laporan Otomatis</h3>
              <p className="text-gray-600">Dapatkan insight bisnis dari laporan penjualan dan keuangan yang dibuat secara otomatis.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
