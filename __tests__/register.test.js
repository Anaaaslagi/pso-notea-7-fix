import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from '../src/pages/register';
import * as authService from '../src/lib/authService';
import { useRouter } from 'next/router';

//  mock registerUser dan useRouter
jest.mock('../src/lib/authService', () => ({
  registerUser: jest.fn(),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('RegisterPage', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: pushMock });
  });

  it('should render form inputs and button', () => {
    render(<RegisterPage />);

    // pastikan input email, password, dan tombol "Daftar" muncul
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /daftar/i })).toBeInTheDocument();
  });

  it('should call registerUser and redirect on success', async () => {
    // pendaftaran berhasil
    authService.registerUser.mockResolvedValueOnce();

    render(<RegisterPage />);

    // isi form
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'securepass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /daftar/i }));

    // tunggu selesai dan tunggu router.push tereksekusi
    await waitFor(() => {
      expect(authService.registerUser).toHaveBeenCalledWith('test@example.com', 'securepass');
      expect(pushMock).toHaveBeenCalledWith('/');
    });
  });

  it('should show alert if register fails', async () => {
    //  error saat register
    authService.registerUser.mockRejectedValueOnce(new Error('Email sudah terdaftar'));
    window.alert = jest.fn();

    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'duplicate@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'pass123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /daftar/i }));

    // tunggu dan cek alert muncul
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Gagal daftar: Email sudah terdaftar');
      expect(pushMock).not.toHaveBeenCalled();
    });
  });
});
