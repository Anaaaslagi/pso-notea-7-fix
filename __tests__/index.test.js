import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../src/pages/index';
import * as authService from '../src/lib/authService';
import { useRouter } from 'next/router';

// mock authService dan useRouter
jest.mock('../src/lib/authService', () => ({
  loginUser: jest.fn(),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('LoginPage', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: pushMock });
  });

  it('should render form inputs and button', () => {
    render(<LoginPage />);

    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should call loginUser and redirect on success', async () => {
    authService.loginUser.mockResolvedValueOnce();

    render(<LoginPage />);

    // isi form login
    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'testpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // verifikasi login dan redirect
    await waitFor(() => {
      expect(authService.loginUser).toHaveBeenCalledWith('testuser', 'testpass');
      expect(pushMock).toHaveBeenCalledWith('/home');
    });

    // cek apakah username disimpan di localStorage
    expect(localStorage.getItem('username')).toBe('testuser');
  });

  it('should show alert and not redirect if login fails', async () => {
    // login gagal
    authService.loginUser.mockRejectedValueOnce(new Error('Invalid credentials'));
    window.alert = jest.fn();

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'wronguser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(authService.loginUser).toHaveBeenCalledWith('wronguser', 'wrongpass');
      expect(window.alert).toHaveBeenCalledWith('Login gagal: Invalid credentials');
      expect(pushMock).not.toHaveBeenCalled();
    });
  });
});
