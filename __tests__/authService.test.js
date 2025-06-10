import { registerUser, loginUser, resetPassword } from '../src/lib/authService';
import { getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';

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
  updateDoc: jest.fn(), 
  doc: jest.fn(), 
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

      await expect(registerUser('existinguser', 'password')).rejects.toThrow('Username sudah digunakan');

      expect(addDoc).not.toHaveBeenCalled();
    });
  });

  describe('loginUser', () => {
    it('should login user if credentials match', async () => {
      const mockData = { username: 'testuser', password: 'password123' };
      const mockDoc = { data: () => mockData };
      getDocs.mockResolvedValueOnce({ empty: false, docs: [mockDoc] });

      const result = await loginUser('testuser', 'password123');
      expect(result).toEqual(mockData);
    });

    it('should throw error if credentials do not match', async () => {
      getDocs.mockResolvedValueOnce({ empty: true });

      await expect(loginUser('wronguser', 'wrongpass')).rejects.toThrow('Username atau password salah');
    });
  });

  describe('resetPassword', () => {
    it('should reset password if email is registered', async () => {
      const mockUserDoc = { id: 'user123', data: () => ({ username: 'test@example.com', password: 'oldpassword' }) };
      getDocs.mockResolvedValueOnce({ empty: false, docs: [mockUserDoc] });
      updateDoc.mockResolvedValueOnce(); //mock updateDoc agar tidak melakukan apa-apa dan berhasil

      const result = await resetPassword('test@example.com', 'newPassword123');
      expect(updateDoc).toHaveBeenCalledWith(doc(), { password: 'newPassword123' }); // periksa updateDoc
      expect(result).toBe(true);
    });

    it('should throw error if email is not registered', async () => {
      getDocs.mockResolvedValueOnce({ empty: true });

      await expect(resetPassword('nonexistent@example.com', 'newPassword')).rejects.toThrow('Email tidak terdaftar.');
      expect(updateDoc).not.toHaveBeenCalled(); // Pastikan updateDoc tidak dipanggil
    });
  });
});