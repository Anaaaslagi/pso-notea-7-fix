jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),  
  collection: jest.fn(() => ({})),  
  query: jest.fn(() => ({})),  
  where: jest.fn(() => ({})), 
  getDocs: jest.fn(),  
  addDoc: jest.fn(),  
  deleteDoc: jest.fn(),  
  updateDoc: jest.fn(),  
  doc: jest.fn(() => ({})),  
}));

jest.mock('../src/lib/firebase', () => ({
  db: {},  // Mock db
  auth: {}, // Mock auth
  getFirestore: jest.fn(() => ({})),  // Mock getFirestore
  getApps: jest.fn(() => []),  // Mock getApps
  getApp: jest.fn(() => ({})),  // Mock getApp
}));

import * as noteService from '../src/lib/noteService';
import { getDocs, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';  // import Firestore methods untuk memverifikasi mock

describe('noteService', () => {
  afterEach(() => {
    jest.clearAllMocks();  // reset mocks setelah setiap test
  });

  describe('getAllNotes', () => {
    it('should return notes for the logged-in user', async () => {
      global.localStorage.setItem('username', 'testuser'); 

      const mockDocs = [
        { id: '1', data: () => ({ title: 'Note 1', content: 'Content 1', username: 'testuser' }) },
        { id: '2', data: () => ({ title: 'Note 2', content: 'Content 2', username: 'testuser' }) },
      ];

      // getDocs untuk return dokumen 
      getDocs.mockResolvedValueOnce({ docs: mockDocs });

      const notes = await noteService.getAllNotes();

      // getDocs dipanggil dengan benar
      expect(getDocs).toHaveBeenCalledWith(expect.any(Object));  
      expect(notes).toEqual([
        { id: '1', title: 'Note 1', content: 'Content 1', username: 'testuser' },
        { id: '2', title: 'Note 2', content: 'Content 2', username: 'testuser' },
      ]);
    });

    it('should return empty array if no username is in localStorage', async () => {
      global.localStorage.removeItem('username');  // case no uname

      const notes = await noteService.getAllNotes();

      // case return kosong
      expect(notes).toEqual([]);
    });
  });

  describe('addNote', () => {
    it('should add a new note for the logged-in user', async () => {
      global.localStorage.setItem('username', 'testuser');
      addDoc.mockResolvedValueOnce({ id: '123' });

      const result = await noteService.addNote('Test Title', 'Test Content');

      // pastikan addDoc dipanggil dengan benar
      expect(addDoc).toHaveBeenCalledWith(expect.any(Object), { title: 'Test Title', content: 'Test Content', username: 'testuser' });
      expect(result).toEqual({ id: '123' });
    });

    it('should throw error if user is not logged in', async () => {
      global.localStorage.removeItem('username'); // case tidak ada username

      await expect(noteService.addNote('Test Title', 'Test Content')).rejects.toThrow('User belum login, tidak bisa menambahkan catatan');
    });
  });

  describe('deleteNote', () => {
    it('should delete a note by id', async () => {
      const mockId = '123';
      const mockDoc = {};  // mock object untuk doc()
      deleteDoc.mockResolvedValueOnce();

      // memastikan deleteDoc dipanggil dengan benar, pastikan `doc` dipanggil dengan id yang benar
      await noteService.deleteNote(mockId);

      // pastikan deleteDoc dipanggil dengan objek yang benar
      expect(deleteDoc).toHaveBeenCalledWith(mockDoc);  
    });
  });

  describe('updateNote', () => {
    it('should update an existing note', async () => {
      const mockId = '123';
      const mockData = { title: 'Updated Title', content: 'Updated Content' };
      const mockDoc = {};  
      updateDoc.mockResolvedValueOnce();


      await noteService.updateNote(mockId, mockData);

      expect(updateDoc).toHaveBeenCalledWith(mockDoc, mockData);  
    });
  });
});
