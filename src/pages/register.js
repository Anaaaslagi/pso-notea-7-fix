import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { registerUser } from '../lib/authService';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(email, password);
      router.push('/login');
    } catch (err) {
      alert('Gagal daftar: ' + err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Daftar Akun Notea</h2>
      <form onSubmit={handleRegister} className="mx-auto" style={{ maxWidth: '400px' }}>
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-success w-100">Daftar</button>
        <p className="mt-3 text-center">
            Sudah punya akun? <Link href="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
