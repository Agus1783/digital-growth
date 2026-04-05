import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (email && password) {
      const res = login(email, password);
      if (res.success) {
        navigate('/app');
      } else {
        setError(res.message || 'Login gagal');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-15 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">DGT</span>
          </div>
          <CardTitle className="text-2xl font-bold">Masuk ke DGT</CardTitle>
          <p className="text-gray-500 text-sm mt-2">Silakan masuk untuk mengelola bisnis Anda</p>
        </CardHeader>
        <CardContent>
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input 
                type="email" 
                placeholder="owner@juragankas.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input 
                type="password" 
                placeholder="password123" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full h-10 mt-4">Masuk</Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500">
            Belum punya akun? <Link to="/register" className="text-blue-600 hover:underline font-medium">Daftar sekarang</Link>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-xs text-blue-800 text-left space-y-1">
            <p className="font-semibold">Akun Demo:</p>
            <p>Owner: owner@juragankas.com / password123</p>
            <p>Kasir: kasir@juragankas.com / password123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
