import { registerUser, loginUser } from '../src/lib/authService';
import { getDocs, addDoc } from 'firebase/firestore';

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApp: jest.fn(() => ({})),
  getApps: jest.fn(() => []),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
}));

describe('authService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register a user if username is not taken', async () => {
      getDocs.mockResolvedValueOnce({ empty: true });
      addDoc.mockResolvedValueOnce({ id: '123' });

      const result = await registerUser('testuser', 'password123');
      expect(addDoc).toHaveBeenCalled();
      expect(result).toEqual({ id: '123' });
    });

    it('should throw error if username already exists', async () => {
      getDocs.mockResolvedValueOnce({ empty: false });

      // jalankan fungsi register dan pastikan error diperlihatkan
      await expect(registerUser('existinguser', 'password')).rejects.toThrow('Username sudah digunakan');

      // pastikan addDoc tidak dijalankan karena gagal
      expect(addDoc).not.toHaveBeenCalled();
    });
  });

  describe('loginUser', () => {
    it('should login user if credentials match', async () => {
      // case hasil getDocs ada user dengan username dan password cocok
      const mockData = { username: 'testuser', password: 'password123' };
      const mockDoc = { data: () => mockData };
      getDocs.mockResolvedValueOnce({ empty: false, docs: [mockDoc] });

      // jalankan fungsi login dan cek hasilnya
      const result = await loginUser('testuser', 'password123');
      expect(result).toEqual(mockData);
    });

    it('should throw error if credentials do not match', async () => {
      // case hasil getDocs tidak ada user yang cocok
      getDocs.mockResolvedValueOnce({ empty: true });

      // show error
      await expect(loginUser('wronguser', 'wrongpass')).rejects.toThrow('Username atau password salah');
    });
  });
});
