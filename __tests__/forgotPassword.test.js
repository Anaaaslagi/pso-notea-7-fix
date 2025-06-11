import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ForgotPasswordPage from '../src/pages/forgotPassword'; // Ubah jika path berbeda
import * as authService from '../src/lib/authService';
import { useRouter } from 'next/router';

// --- MOCK global.alert SEKALI DI AWAL
beforeAll(() => {
  global.alert = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

// --- MOCK resetPassword ---
jest.mock('../src/lib/authService', () => ({
  resetPassword: jest.fn(),
}));

// --- MOCK useRouter dari next/router ---
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('ForgotPasswordPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: mockPush });
  });

  it('should render the forgot password page correctly', () => {
    render(<ForgotPasswordPage />);
    expect(screen.getByText('Lupa Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password Baru')).toBeInTheDocument();
    expect(screen.getByLabelText('Konfirmasi Password Baru')).toBeInTheDocument();
    expect(screen.getByText('Kembali ke Login')).toBeInTheDocument();
  });

  // it('should show an alert if any field is empty', async () => {
  //   render(<ForgotPasswordPage />);
  //   fireEvent.click(screen.getByText('Reset Password'));
  //   await waitFor(() =>
  //     expect(global.alert).toHaveBeenCalledWith('Semua field harus diisi!')
  //   );
  // });

  it('should show an alert if passwords do not match', async () => {
    render(<ForgotPasswordPage />);
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password Baru'), { target: { value: 'newpassword123' } });
    fireEvent.change(screen.getByLabelText('Konfirmasi Password Baru'), { target: { value: 'beda' } });
    fireEvent.click(screen.getByText('Reset Password'));
    await waitFor(() =>
      expect(global.alert).toHaveBeenCalledWith('Konfirmasi password baru tidak sesuai.')
    );
  });

  it('should call resetPassword and redirect to login on success', async () => {
    authService.resetPassword.mockResolvedValueOnce();
    render(<ForgotPasswordPage />);
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password Baru'), { target: { value: 'newpassword123' } });
    fireEvent.change(screen.getByLabelText('Konfirmasi Password Baru'), { target: { value: 'newpassword123' } });
    fireEvent.click(screen.getByText('Reset Password'));

    await waitFor(() =>
      expect(authService.resetPassword).toHaveBeenCalledWith('test@example.com', 'newpassword123')
    );
    // Success alert & redirect
    await waitFor(() =>
      expect(global.alert).toHaveBeenCalledWith('Password berhasil direset! Silakan login dengan password baru Anda.')
    );
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('should show an alert if resetPassword fails', async () => {
    const errorMessage = 'Error resetting password';
    authService.resetPassword.mockRejectedValueOnce(new Error(errorMessage));
    render(<ForgotPasswordPage />);
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password Baru'), { target: { value: 'newpassword123' } });
    fireEvent.change(screen.getByLabelText('Konfirmasi Password Baru'), { target: { value: 'newpassword123' } });
    fireEvent.click(screen.getByText('Reset Password'));
    await waitFor(() =>
      expect(global.alert).toHaveBeenCalledWith('Reset password gagal: ' + errorMessage)
    );
  });
});
