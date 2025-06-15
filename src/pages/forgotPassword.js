// // pages/forgot-password.js
// import React, { useState } from 'react';
// import { useRouter } from 'next/router';
// import { resetPassword } from '../lib/authService';
// import Link from 'next/link';

// export default function ForgotPasswordPage() {
//   const [email, setEmail] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmNewPassword, setConfirmNewPassword] = useState('');
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validasi field kosong
//     if (!email || !newPassword || !confirmNewPassword) {
//       alert('Semua field harus diisi!');
//       return;
//     }

//     // Validasi konfirmasi password
//     if (newPassword !== confirmNewPassword) {
//       alert('Konfirmasi password baru tidak sesuai.');
//       return;
//     }

//     try {
//       await resetPassword(email, newPassword);
//       alert('Password berhasil direset! Silakan login dengan password baru Anda.');
//       router.push('/');
//     } catch (err) {
//       console.error('❌ Reset password gagal:', err.message);
//       alert('Reset password gagal: ' + err.message);
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h2 className="text-center mb-4">Lupa Password</h2>
//       <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '400px' }}>
//         <div className="mb-3">
//           <label htmlFor="emailInput" className="form-label">Email</label>
//           <input
//             type="email"
//             className="form-control"
//             id="emailInput"
//             placeholder="Masukkan email Anda"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label htmlFor="newPasswordInput" className="form-label">Password Baru</label>
//           <input
//             type="password"
//             className="form-control"
//             id="newPasswordInput"
//             placeholder="Masukkan password baru"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label htmlFor="confirmNewPasswordInput" className="form-label">Konfirmasi Password Baru</label>
//           <input
//             type="password"
//             className="form-control"
//             id="confirmNewPasswordInput"
//             placeholder="Konfirmasi password baru"
//             value={confirmNewPassword}
//             onChange={(e) => setConfirmNewPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit" className="btn btn-primary w-100">Reset Password</button>
//         <p className="mt-3 text-center">
//           <Link href="/">Kembali ke Login</Link>
//         </p>
//       </form>
//     </div>
//   );
// }