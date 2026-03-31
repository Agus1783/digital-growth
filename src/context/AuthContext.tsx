import React, { createContext, useContext, useState } from 'react';

export type Role = 'OWNER' | 'CASHIER';
export type User = { id: string; name: string; email: string; role: Role; password?: string };

type AuthContextType = {
  user: User | null;
  login: (email: string, password?: string) => { success: boolean; message?: string };
  register: (name: string, email: string, password?: string, role?: Role, token?: string) => { success: boolean; message?: string };
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultUsers: User[] = [
  { id: 'u1', name: 'Budi (Owner)', email: 'owner@juragankas.com', role: 'OWNER', password: 'password123' },
  { id: 'u2', name: 'Siti (Kasir)', email: 'kasir@juragankas.com', role: 'CASHIER', password: 'password123' }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(defaultUsers);

  const login = (email: string, password?: string) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      return { success: true };
    }
    return { success: false, message: 'Email atau password salah!' };
  };

  const register = (name: string, email: string, password?: string, role: Role = 'CASHIER', token?: string) => {
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Email sudah terdaftar!' };
    }

    if (role === 'OWNER' && token !== 'JURAGAN2026') {
      return { success: false, message: 'Token Owner tidak valid! (Gunakan: JURAGAN2026)' };
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password,
      role
    };

    setUsers([...users, newUser]);
    setUser(newUser);
    return { success: true };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
