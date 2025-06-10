let getAllNotes, addNote, deleteNote, updateNote;
import {
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  collection,
  doc,
  query,
  where
} from 'firebase/firestore';

// mock Firestore methodss
jest.mock('firebase/firestore', () => {
  const original = jest.requireActual('firebase/firestore');
  return {
    ...original,
    getDocs: jest.fn(),
    addDoc: jest.fn(),
    deleteDoc: jest.fn(),
    updateDoc: jest.fn(),
    collection: jest.fn(() => 'mock-collection-ref'),
    doc: jest.fn(() => 'mock-doc-ref'),
    query: jest.fn(() => 'mock-query'),
    where: jest.fn(() => 'mock-where'),
  };
});

// pindahkan mock localStorage sebelum require() modul yang menggunakan localStorage
beforeAll(() => {
  const mockLocalStorage = {
    getItem: jest.fn((key) => {
      if (key === 'username') return 'testuser';
      return null; 
    }),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  };

  Object.defineProperty(global, 'localStorage', {
    value: mockLocalStorage,
  });

  // require modul setelah mocking localStorage
  const noteService = require('../src/lib/noteService');
  getAllNotes = noteService.getAllNotes;
  addNote = noteService.addNote;
  deleteNote = noteService.deleteNote;
  updateNote = noteService.updateNote;
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('🔥 noteService', () => {
  it('getAllNotes() mengembalikan data yang dimapping dari snapshot', async () => {
    const mockDocs = [
      { id: '1', data: () => ({ title: 'A', content: 'C1' }) },
      { id: '2', data: () => ({ title: 'B', content: 'C2' }) },
    ];
    getDocs.mockResolvedValueOnce({ docs: mockDocs });

    const notes = await getAllNotes();

    expect(query).toHaveBeenCalled();
    expect(getDocs).toHaveBeenCalledWith('mock-query');
    expect(notes).toEqual([
      { id: '1', title: 'A', content: 'C1' },
      { id: '2', title: 'B', content: 'C2' },
    ]);
  });

  it('addNote() memanggil addDoc dengan data yang sesuai', async () => {
    await addNote('Judul Tes', 'Isi Tes');

    expect(addDoc).toHaveBeenCalledWith('mock-collection-ref', {
      title: 'Judul Tes',
      content: 'Isi Tes',
      username: 'testuser',
    });
  });

  it('deleteNote() memanggil deleteDoc dengan doc yang sesuai', async () => {
    await deleteNote('note-id');
    expect(deleteDoc).toHaveBeenCalledWith('mock-doc-ref');
  });

  it('updateNote() memanggil updateDoc dengan data yang benar', async () => {
    const newData = { title: 'Baru', content: 'Update konten' };
    await updateNote('note-id', newData);
    expect(updateDoc).toHaveBeenCalledWith('mock-doc-ref', newData);
  });
});
