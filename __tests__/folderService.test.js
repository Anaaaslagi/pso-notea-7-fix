import {
  getAllFolders,
  addFolder,
  updateFolder,
  deleteFolder,
  getFolderById
} from '../src/lib/folderService';

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  getDoc
} from 'firebase/firestore';

// Mock db (Firebase instance)
jest.mock('../src/lib/firebase', () => ({
  db: {},
}));

// Firestore function mock
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(() => ({ __type: 'collection', name: 'folders' })),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn((...args) => ({ __type: 'query', args })),
  where: jest.fn((field, op, value) => ({ __type: 'where', field, op, value })),
  doc: jest.fn((db, collectionName, id) =>
    ({ __type: 'doc', db, collectionName, id })
  ),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  getDoc: jest.fn(),
}));

describe('folderService', () => {
  const db = require('../src/lib/firebase').db;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllFolders', () => {
    it('should return all folders for a given userId', async () => {
      // mock getDocs to return 2 folders
      getDocs.mockResolvedValueOnce({
        docs: [
          { id: 'f1', data: () => ({ userId: 'u1', name: 'Folder 1' }) },
          { id: 'f2', data: () => ({ userId: 'u1', name: 'Folder 2' }) },
        ]
      });

      const result = await getAllFolders('u1');

      // Expect query built with correct args
      expect(collection).toHaveBeenCalledWith(db, "folders");
      expect(where).toHaveBeenCalledWith("userId", "==", "u1");
      expect(query).toHaveBeenCalledWith(
        { __type: 'collection', name: 'folders' },
        { __type: 'where', field: 'userId', op: '==', value: 'u1' }
      );
      expect(getDocs).toHaveBeenCalled();

      expect(result).toEqual([
        { id: 'f1', userId: 'u1', name: 'Folder 1' },
        { id: 'f2', userId: 'u1', name: 'Folder 2' },
      ]);
    });

    it('should return empty array if no folders found', async () => {
      getDocs.mockResolvedValueOnce({ docs: [] });
      const result = await getAllFolders('none');
      expect(result).toEqual([]);
    });
  });

  describe('addFolder', () => {
    it('should add a new folder and return its ID', async () => {
      addDoc.mockResolvedValueOnce({ id: 'newfolderid' });

      const result = await addFolder('u1', 'My Folder');
      expect(collection).toHaveBeenCalledWith(db, "folders");
      expect(addDoc).toHaveBeenCalledWith(
        { __type: 'collection', name: 'folders' },
        { userId: 'u1', name: 'My Folder', createdAt: expect.any(Date) }
      );
      expect(result).toBe('newfolderid');
    });
  });

  describe('updateFolder', () => {
    it('should update the folder name with newName', async () => {
      updateDoc.mockResolvedValueOnce(undefined);
      await updateFolder('f3', 'Updated Name');
      expect(doc).toHaveBeenCalledWith(db, "folders", "f3");
      expect(updateDoc).toHaveBeenCalledWith(
        { __type: 'doc', db, collectionName: 'folders', id: 'f3' },
        { name: 'Updated Name', updatedAt: expect.any(Date) }
      );
    });
  });

  describe('deleteFolder', () => {
    it('should delete folder by id', async () => {
      deleteDoc.mockResolvedValueOnce(undefined);
      await deleteFolder('f4');
      expect(doc).toHaveBeenCalledWith(db, "folders", "f4");
      expect(deleteDoc).toHaveBeenCalledWith(
        { __type: 'doc', db, collectionName: 'folders', id: 'f4' }
      );
    });
  });

  describe('getFolderById', () => {
    it('should return folder data if exists', async () => {
      getDoc.mockResolvedValueOnce({
        exists: () => true,
        id: 'f5',
        data: () => ({ userId: 'u2', name: 'Special Folder' }),
      });
      const result = await getFolderById('f5');
      expect(doc).toHaveBeenCalledWith(db, "folders", "f5");
      expect(getDoc).toHaveBeenCalledWith(
        { __type: 'doc', db, collectionName: 'folders', id: 'f5' }
      );
      expect(result).toEqual({ id: 'f5', userId: 'u2', name: 'Special Folder' });
    });

    it('should return null if folder does not exist', async () => {
      getDoc.mockResolvedValueOnce({ exists: () => false });
      const result = await getFolderById('notfound');
      expect(doc).toHaveBeenCalledWith(db, "folders", "notfound");
      expect(result).toBeNull();
    });

    it('should return null if id is falsy', async () => {
      const result = await getFolderById('');
      expect(result).toBeNull();
    });
  });
});
