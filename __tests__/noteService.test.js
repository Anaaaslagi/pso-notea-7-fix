import {
  getAllNotes,
  addNote,
  deleteNote,
  updateNote
} from '../src/lib/noteService';

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

// 🔧 Mock Firestore functions
jest.mock('firebase/firestore', () => {
  const originalModule = jest.requireActual('firebase/firestore');
  return {
    ...originalModule,
    getDocs: jest.fn(),
    addDoc: jest.fn(),
    deleteDoc: jest.fn(),
    updateDoc: jest.fn(),
    collection: jest.fn(() => 'mock-collection-ref'),
    doc: jest.fn(() => 'mock-doc-ref'),
    query: jest.fn(() => 'mock-query'),
    where: jest.fn(),
  };
});

// 🔧 Mock localStorage
beforeEach(() => {
  global.localStorage = {
    getItem: jest.fn(() => 'testuser'),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  };

  jest.spyOn(console, 'warn').mockImplementation(() => {}); // Supress warning in test
});

describe('🔥 noteService', () => {
  it('getAllNotes() mengembalikan data yang dimapping dari snapshot', async () => {
    const mockDocs = [
      { id: '1', data: () => ({ title: 'A', content: 'C1' }) },
      { id: '2', data: () => ({ title: 'B', content: 'C2' }) },
    ];
    getDocs.mockResolvedValueOnce({ docs: mockDocs });

    const notes = await getAllNotes();

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
