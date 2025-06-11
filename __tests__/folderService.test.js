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

jest.mock('../src/lib/firebase', () => ({
  db: {}, 
}));

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApp: jest.fn(() => ({})),
  getApps: jest.fn(() => []),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  doc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  getDoc: jest.fn(),
}));

// Karena error juga menyebutkan 'firebase/auth', meskipun tidak digunakan langsung di folderService.js,
// keberadaannya di firebase.js mungkin memicu masalah. Tetap pertahankan mock ini.
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
}));

describe('Folder Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllFolders', () => {
    it('should return all folders for a given user ID', async () => {
      const mockDocs = [{
        id: 'folder1',
        data: () => ({
          userId: 'user123',
          name: 'My Folder 1'
        })
      }, {
        id: 'folder2',
        data: () => ({
          userId: 'user123',
          name: 'My Folder 2'
        })
      }];
      getDocs.mockResolvedValueOnce({
        docs: mockDocs
      });

      const result = await getAllFolders('user123');
      expect(query).toHaveBeenCalledWith(collection(), where('userId', '==', 'user123'));
      expect(getDocs).toHaveBeenCalled();
      expect(result).toEqual([{
        id: 'folder1',
        userId: 'user123',
        name: 'My Folder 1'
      }, {
        id: 'folder2',
        userId: 'user123',
        name: 'My Folder 2'
      }]);
    });

    it('should return an empty array if no folders are found', async () => {
      getDocs.mockResolvedValueOnce({
        docs: []
      });

      const result = await getAllFolders('nonexistentUser');
      expect(query).toHaveBeenCalledWith(collection(), where('userId', '==', 'nonexistentUser'));
      expect(getDocs).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('addFolder', () => {
    it('should add a new folder and return its ID', async () => {
      const mockDocRef = {
        id: 'newFolder123'
      };
      addDoc.mockResolvedValueOnce(mockDocRef);

      const result = await addFolder('user456', 'New Project Folder');
      expect(addDoc).toHaveBeenCalledWith(collection(), {
        userId: 'user456',
        name: 'New Project Folder',
        createdAt: expect.any(Date)
      });
      expect(result).toBe('newFolder123');
    });
  });

  describe('updateFolder', () => {
    it('should update the name of an existing folder', async () => {
      updateDoc.mockResolvedValueOnce();

      await updateFolder('folderToUpdate', 'Renamed Folder');
      expect(updateDoc).toHaveBeenCalledWith(doc(), {
        name: 'Renamed Folder',
        updatedAt: expect.any(Date)
      });
    });
  });

  describe('deleteFolder', () => {
    it('should delete a folder by its ID', async () => {
      deleteDoc.mockResolvedValueOnce();

      await deleteFolder('folderToDelete');
      expect(deleteDoc).toHaveBeenCalledWith(doc());
    });
  });

  describe('getFolderById', () => {
    it('should return folder data for a given folder ID', async () => {
      const mockSnap = {
        id: 'folder1',
        data: () => ({
          userId: 'user123',
          name: 'My Folder 1'
        }),
        exists: () => true
      };
      getDoc.mockResolvedValueOnce(mockSnap);

      const result = await getFolderById('folder1');
      expect(getDoc).toHaveBeenCalledWith(doc(), 'folder1');
      expect(result).toEqual({
        id: 'folder1',
        userId: 'user123',
        name: 'My Folder 1'
      });
    });

    it('should return null if folder is not found', async () => {
      getDoc.mockResolvedValueOnce({
        exists: () => false
      });

      const result = await getFolderById('nonExistentFolder');
      expect(getDoc).toHaveBeenCalledWith(doc(), 'nonExistentFolder');
      expect(result).toBeNull();
    });
  });
});
