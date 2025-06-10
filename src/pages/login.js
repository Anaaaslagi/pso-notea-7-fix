import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { loginUser } from '../lib/authService';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginUser(username, password); // pakai Firebase Auth
      localStorage.setItem('username', username);
      console.log('✅ Login berhasil!');
      router.push('/'); // redirect ke halaman catatan
    } catch (err) {
      console.error('❌ Login gagal:', err.message);
      alert('Login gagal: ' + err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Login ke Notea</h2>
      <form onSubmit={handleLogin} className="mx-auto" style={{ maxWidth: '400px' }}>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
        <button type="submit" className="btn btn-primary w-100">Login</button>

        <p className="mt-3 text-center">
          Belum punya akun? <a href="/register">Daftar</a>
        </p>
      </form>
    </div>
  );
}
