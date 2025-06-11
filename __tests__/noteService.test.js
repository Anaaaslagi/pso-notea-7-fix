import * as noteService from '../src/lib/noteService';

jest.mock('../src/lib/firebase', () => {
  return {
    db: {},
  };
});

jest.mock('firebase/firestore', () => {
  return {
    // mock collection return object dummy
    collection: jest.fn(() => ({ __type: 'collection', name: 'notes' })),
    addDoc: jest.fn(),
    getDocs: jest.fn(),
    deleteDoc: jest.fn(),
    updateDoc: jest.fn(),
    // mock doc return object dummy
    doc: jest.fn((db, collectionName, id) => ({ __type: 'doc', collectionName, id })),
    query: jest.fn(),
    where: jest.fn(),
  };
});

const { addDoc, getDocs, deleteDoc, updateDoc, doc, query, where } = require('firebase/firestore');

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
    clear: jest.fn(() => { store = {}; }),
    removeItem: jest.fn((key) => { delete store[key]; }),
  };
})();
global.localStorage = localStorageMock;

describe('noteService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  describe('getAllNotes', () => {
    it('should return notes for the logged-in user', async () => {
      localStorage.setItem('username', 'user1');
      getDocs.mockResolvedValue({
        docs: [
          { id: '1', data: () => ({ title: 'a', content: 'b', username: 'user1' }) },
          { id: '2', data: () => ({ title: 'b', content: 'c', username: 'user1' }) },
        ],
      });
      const notes = await noteService.getAllNotes();
      expect(notes.length).toBe(2);
      expect(notes[0]).toHaveProperty('id');
      expect(notes[0]).toHaveProperty('title');
      expect(getDocs).toBeCalled();
    });

    it('should return empty array if no username in localStorage', async () => {
      localStorage.removeItem('username');
      const notes = await noteService.getAllNotes();
      expect(notes).toEqual([]);
      expect(getDocs).not.toBeCalled();
    });
  });

  describe('addNote', () => {
    it('should add a new note for the logged-in user with a folderId', async () => {
      localStorage.setItem('username', 'user1');
      addDoc.mockResolvedValue({ id: 'noteId123' });
      const expectedCollection = { __type: 'collection', name: 'notes' };
      const result = await noteService.addNote('Title', 'Content', 'folderId');
      expect(addDoc).toBeCalledWith(expectedCollection, {
        title: 'Title',
        content: 'Content',
        username: 'user1',
        folderId: 'folderId',
      });
      expect(result).toEqual({ id: 'noteId123' });
    });

    it('should throw error if user is not logged in', async () => {
      localStorage.removeItem('username');
      await expect(noteService.addNote('a', 'b')).rejects.toThrow("User belum login, tidak bisa menambahkan catatan");
      expect(addDoc).not.toBeCalled();
    });
  });

  describe('deleteNote', () => {
    it('should delete a note by id', async () => {
      deleteDoc.mockResolvedValue(true);
      const expectedDoc = { __type: 'doc', collectionName: 'notes', id: 'id123' };
      await noteService.deleteNote('id123');
      expect(deleteDoc).toBeCalledWith(expectedDoc);
    });
  });

  describe('updateNote', () => {
    it('should update an existing note', async () => {
      updateDoc.mockResolvedValue(true);
      const expectedDoc = { __type: 'doc', collectionName: 'notes', id: 'id321' };
      await noteService.updateNote('id321', { title: 'Updated' });
      expect(updateDoc).toBeCalledWith(expectedDoc, { title: 'Updated' });
    });
  });

  describe('getNotesByFolder', () => {
    it('should return notes for a specific folderId', async () => {
      localStorage.setItem('username', 'user2');
      getDocs.mockResolvedValue({
        docs: [
          { id: '11', data: () => ({ title: 'a', folderId: 'f1', username: 'user2' }) },
        ],
      });
      const notes = await noteService.getNotesByFolder('f1');
      expect(notes.length).toBe(1);
      expect(notes[0].folderId).toBe('f1');
      expect(getDocs).toBeCalled();
    });

    it('should return notes with null folderId if folderId is not provided', async () => {
      localStorage.setItem('username', 'user3');
      getDocs.mockResolvedValue({
        docs: [
          { id: '21', data: () => ({ title: 'x', folderId: null, username: 'user3' }) },
        ],
      });
      const notes = await noteService.getNotesByFolder();
      expect(notes[0].folderId).toBe(null);
      expect(getDocs).toBeCalled();
    });

    it('should return an empty array if no username in localStorage', async () => {
      localStorage.removeItem('username');
      const notes = await noteService.getNotesByFolder('any');
      expect(notes).toEqual([]);
      expect(getDocs).not.toBeCalled();
    });
  });
});
