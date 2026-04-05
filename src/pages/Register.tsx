import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, Role } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('CASHIER');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (name && email && password) {
      const res = register(name, email, password, role, token);
      if (res.success) {
        navigate('/app');
      } else {
        setError(res.message || 'Registrasi gagal');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-15 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">DGT</span>
          </div>
          <CardTitle className="text-2xl font-bold">Daftar DGT</CardTitle>
          <p className="text-gray-500 text-sm mt-2">Buat akun baru untuk bisnis Anda</p>
        </CardHeader>
        <CardContent>
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Lengkap</label>
              <Input 
                type="text" 
                placeholder="Budi Santoso" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input 
                type="email" 
                placeholder="nama@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Daftar Sebagai</label>
              <select 
                className="flex h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600"
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
              >
                <option value="CASHIER">Kasir (Karyawan)</option>
                <option value="OWNER">Pemilik (Owner)</option>
              </select>
            </div>
            
            {role === 'OWNER' && (
              <div className="space-y-2 p-3 bg-blue-50 rounded-md border border-blue-100">
                <label className="text-sm font-medium text-blue-900">Token Registrasi Owner</label>
                <Input 
                  type="text" 
                  placeholder="Masukkan token rahasia..." 
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                  className="bg-white"
                />
                <p className="text-xs text-blue-700 mt-1">Gunakan token: <strong>JURAGAN2026</strong> untuk demo.</p>
              </div>
            )}
            
            <Button type="submit" className="w-full h-10 mt-4">Daftar</Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500">
            Sudah punya akun? <Link to="/login" className="text-blue-600 hover:underline font-medium">Masuk di sini</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
