jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  deleteDoc: jest.fn(),
  updateDoc: jest.fn(),
  doc: jest.fn(),
}));

jest.mock('../src/lib/firebase', () => ({
  db: {}, // Mock db
  auth: {}, // Mock auth
}));

import * as noteService from '../src/lib/noteService';
import {
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  collection,
  doc
} from 'firebase/firestore';

describe('noteService', () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: jest.fn(key => store[key] || null),
      setItem: jest.fn((key, value) => (store[key] = value.toString())),
      removeItem: jest.fn(key => delete store[key]),
      clear: jest.fn(() => (store = {})),
    };
  })();
  Object.defineProperty(global, 'localStorage', {
    value: localStorageMock
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  describe('getAllNotes', () => {
    it('should return notes for the logged-in user', async () => {
      localStorage.setItem('username', 'testuser');
      const mockDocs = [{ id: '1', data: () => ({ title: 'Note 1', content: 'Content 1', username: 'testuser', folderId: null }) }];
      getDocs.mockResolvedValueOnce({ docs: mockDocs });
      collection.mockReturnValueOnce('mockedCollection');
      query.mockReturnValueOnce('mockedQuery');

      const notes = await noteService.getAllNotes();

      expect(localStorage.getItem).toHaveBeenCalledWith('username');
      expect(query).toHaveBeenCalledWith('mockedCollection', expect.any(Object));
      expect(getDocs).toHaveBeenCalledWith('mockedQuery');
      expect(notes).toEqual([{ id: '1', title: 'Note 1', content: 'Content 1', username: 'testuser', folderId: null }]);
    });

    it('should return empty array if no username in localStorage', async () => {
      localStorage.removeItem('username');
      const notes = await noteService.getAllNotes();
      expect(notes).toEqual([]);
      expect(getDocs).not.toHaveBeenCalled();
    });
  });

  describe('addNote', () => {
    it('should add a new note for the logged-in user with a folderId', async () => {
      localStorage.setItem('username', 'testuser');
      addDoc.mockResolvedValueOnce({ id: '123' });

      const result = await noteService.addNote('Test Title', 'Test Content', 'folderABC');

      expect(addDoc).toHaveBeenCalledWith(expect.any(Object), { title: 'Test Title', content: 'Test Content', username: 'testuser', folderId: 'folderABC' });
      expect(result).toEqual({ id: '123' });
    });

    it('should throw error if user is not logged in', async () => {
      localStorage.removeItem('username');
      await expect(noteService.addNote('Test Title', 'Test Content')).rejects.toThrow('User belum login, tidak bisa menambahkan catatan');
      expect(addDoc).not.toHaveBeenCalled();
    });
  });

  describe('deleteNote', () => {
    it('should delete a note by id', async () => {
      doc.mockReturnValueOnce('mockedDocRef');
      deleteDoc.mockResolvedValueOnce();

      await noteService.deleteNote('123');

      expect(doc).toHaveBeenCalledWith({}, "notes", '123');
      expect(deleteDoc).toHaveBeenCalledWith('mockedDocRef');
    });
  });

  describe('updateNote', () => {
    it('should update an existing note', async () => {
      doc.mockReturnValueOnce('mockedDocRef');
      updateDoc.mockResolvedValueOnce();
      const mockData = { title: 'Updated Title' };

      await noteService.updateNote('123', mockData);

      expect(doc).toHaveBeenCalledWith({}, "notes", '123');
      expect(updateDoc).toHaveBeenCalledWith('mockedDocRef', mockData);
    });
  });

  describe('getNotesByFolder', () => {
    beforeEach(() => {
      localStorage.setItem('username', 'testuser');
    });

    it('should return notes for a specific folderId', async () => {
      const mockDocs = [{ id: 'n1', data: () => ({ title: 'Folder Note 1', folderId: 'folder123', username: 'testuser' }) }];
      getDocs.mockResolvedValueOnce({ docs: mockDocs });
      collection.mockReturnValueOnce('mockedCollection');
      query.mockReturnValueOnce('mockedQuery');

      const notes = await noteService.getNotesByFolder('folder123');

      expect(query).toHaveBeenCalledWith('mockedCollection', expect.any(Object), expect.any(Object));
      expect(getDocs).toHaveBeenCalledWith('mockedQuery');
      expect(notes).toEqual([{ id: 'n1', title: 'Folder Note 1', folderId: 'folder123', username: 'testuser' }]);
    });

    it('should return notes with null folderId if folderId is not provided', async () => {
      const mockDocs = [{ id: 'n3', data: () => ({ title: 'Uncategorized Note 1', folderId: null, username: 'testuser' }) }];
      getDocs.mockResolvedValueOnce({ docs: mockDocs });
      collection.mockReturnValueOnce('mockedCollection');
      query.mockReturnValueOnce('mockedQuery');

      const notes = await noteService.getNotesByFolder(null);

      expect(query).toHaveBeenCalledWith('mockedCollection', expect.any(Object), expect.any(Object));
      expect(getDocs).toHaveBeenCalledWith('mockedQuery');
      expect(notes).toEqual([{ id: 'n3', title: 'Uncategorized Note 1', folderId: null, username: 'testuser' }]);
    });

    it('should return an empty array if no username in localStorage', async () => {
      localStorage.removeItem('username');
      const notes = await noteService.getNotesByFolder('anyFolderId');
      expect(notes).toEqual([]);
      expect(getDocs).not.toHaveBeenCalled();
    });
  });
});