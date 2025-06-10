import {
  getAllNotes,
  addNote,
  deleteNote,
  updateNote
} from '@/lib/noteService';

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
  deleteDoc: jest.fn(),
  updateDoc: jest.fn(),
  doc: jest.fn()
}));

jest.mock('@/lib/firebase', () => ({
  db: {}
}));

describe('🔥 noteService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    collection.mockReturnValue('mock-collection-ref');
  });

  it('getAllNotes() mengembalikan data yang dimapping dari snapshot', async () => {
    const fakeDocs = [
      { id: '1', data: () => ({ title: 'A', content: 'C1' }) },
      { id: '2', data: () => ({ title: 'B', content: 'C2' }) }
    ];

    getDocs.mockResolvedValue({ docs: fakeDocs });

    const notes = await getAllNotes();

    expect(getDocs).toHaveBeenCalledWith('mock-collection-ref');
    expect(notes).toEqual([
      { id: '1', title: 'A', content: 'C1' },
      { id: '2', title: 'B', content: 'C2' }
    ]);
  });

  it('addNote() memanggil addDoc dengan data yang sesuai', async () => {
    addDoc.mockResolvedValue({ id: 'abc123' });

    const result = await addNote('Test Title', 'Test Content');

    expect(addDoc).toHaveBeenCalledWith('mock-collection-ref', {
      title: 'Test Title',
      content: 'Test Content'
    });

    expect(result).toEqual({ id: 'abc123' });
  });

  it('deleteNote() memanggil deleteDoc dengan ID yang benar', async () => {
    const mockDocRef = {};
    doc.mockReturnValue(mockDocRef);
    deleteDoc.mockResolvedValue();

    await deleteNote('note-id-123');

    expect(doc).toHaveBeenCalledWith(db, 'notes', 'note-id-123');
    expect(deleteDoc).toHaveBeenCalledWith(mockDocRef);
  });

  it('updateNote() memanggil updateDoc dengan data yang benar', async () => {
    const mockDocRef = {};
    doc.mockReturnValue(mockDocRef);
    updateDoc.mockResolvedValue();

    await updateNote('note-id-456', { title: 'Updated', content: 'New content' });

    expect(doc).toHaveBeenCalledWith(db, 'notes', 'note-id-456');
    expect(updateDoc).toHaveBeenCalledWith(mockDocRef, {
      title: 'Updated',
      content: 'New content'
    });
  });
});
