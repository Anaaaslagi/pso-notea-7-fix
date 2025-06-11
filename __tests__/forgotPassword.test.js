import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ForgotPasswordPage from '../src/pages/forgotPassword'; // Sesuaikan dengan path halaman Anda
import * as authService from '../src/lib/authService';
import { useRouter } from 'next/router';

// Mocking resetPassword dari authService
jest.mock('../src/lib/authService', () => ({
  resetPassword: jest.fn(),
}));

// Mocking useRouter dari Next.js
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('ForgotPasswordPage', () => {
  const mockPush = jest.fn();
  beforeEach(() => {
    // Reset mocks sebelum setiap test
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: mockPush });
  });

  it('should render the forgot password page correctly', () => {
    render(<ForgotPasswordPage />);

    // Memeriksa elemen-elemen pada halaman
    expect(screen.getByText('Lupa Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password Baru')).toBeInTheDocument();
    expect(screen.getByLabelText('Konfirmasi Password Baru')).toBeInTheDocument();
    expect(screen.getByText('Kembali ke Login')).toBeInTheDocument();
  });

  it('should show an alert if any field is empty', async () => {
    render(<ForgotPasswordPage />);

    // Simulasi klik tombol submit tanpa mengisi form
    fireEvent.click(screen.getByText('Reset Password'));

    // Memeriksa bahwa alert muncul
    await waitFor(() => expect(global.alert).toHaveBeenCalledWith('Semua field harus diisi!'));
  });

  it('should show an alert if passwords do not match', async () => {
    render(<ForgotPasswordPage />);

    // Isi form dengan password yang tidak cocok
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password Baru'), { target: { value: 'newpassword123' } });
    fireEvent.change(screen.getByLabelText('Konfirmasi Password Baru'), { target: { value: 'mismatchpassword123' } });

    // Simulasi klik tombol submit
    fireEvent.click(screen.getByText('Reset Password'));

    // Memeriksa bahwa alert muncul
    await waitFor(() => expect(global.alert).toHaveBeenCalledWith('Konfirmasi password baru tidak sesuai.'));
  });

  it('should call resetPassword and redirect to login on success', async () => {
    authService.resetPassword.mockResolvedValueOnce(); // Mock success

    render(<ForgotPasswordPage />);

    // Isi form dengan data yang valid
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password Baru'), { target: { value: 'newpassword123' } });
    fireEvent.change(screen.getByLabelText('Konfirmasi Password Baru'), { target: { value: 'newpassword123' } });

    // Simulasi klik tombol submit
    fireEvent.click(screen.getByText('Reset Password'));

    // Memeriksa bahwa resetPassword dipanggil dengan benar
    await waitFor(() => expect(authService.resetPassword).toHaveBeenCalledWith('test@example.com', 'newpassword123'));

    // Memeriksa bahwa pengguna diarahkan ke halaman login
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/'));
  });

  it('should show an alert if resetPassword fails', async () => {
    const errorMessage = 'Error resetting password';
    authService.resetPassword.mockRejectedValueOnce(new Error(errorMessage)); // Mock error

    render(<ForgotPasswordPage />);

    // Isi form dengan data valid
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password Baru'), { target: { value: 'newpassword123' } });
    fireEvent.change(screen.getByLabelText('Konfirmasi Password Baru'), { target: { value: 'newpassword123' } });

    // Simulasi klik tombol submit
    fireEvent.click(screen.getByText('Reset Password'));

    // Memeriksa bahwa alert error muncul
    await waitFor(() => expect(global.alert).toHaveBeenCalledWith('Reset password gagal: ' + errorMessage));
  });
});
