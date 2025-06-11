import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FolderPage from '../src/pages/folder'; 
import { getNotesByFolder } from '../src/lib/noteService';
import { getFolderById } from '../src/lib/folderService';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';

jest.mock('../src/lib/noteService');
jest.mock('../src/lib/folderService');
jest.mock('sweetalert2');
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('FolderPage', () => {
  const mockFolder = {
    id: '1',
    name: 'Test Folder',
  };

  const mockNotes = [
    { id: '1', title: 'Note 1', content: 'Content of Note 1' },
    { id: '2', title: 'Note 2', content: 'Content of Note 2' },
  ];

  beforeEach(() => {
    useRouter.mockReturnValue({
      query: { id: '1' },
    });

    getFolderById.mockResolvedValue(mockFolder);
    getNotesByFolder.mockResolvedValue(mockNotes);
    Swal.fire.mockResolvedValue({ isConfirmed: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    getFolderById.mockResolvedValueOnce(null); 
    getNotesByFolder.mockResolvedValueOnce([]);

    render(<FolderPage />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display folder name and notes', async () => {
    render(<FolderPage />);

    await waitFor(() => expect(getFolderById).toHaveBeenCalledWith('1'));
    await waitFor(() => expect(getNotesByFolder).toHaveBeenCalledWith('1'));

    expect(screen.getByText('📁 Test Folder')).toBeInTheDocument();
    expect(screen.getByText('Note 1')).toBeInTheDocument();
    expect(screen.getByText('Note 2')).toBeInTheDocument();
  });

  it('should show message if there are no notes', async () => {
    getNotesByFolder.mockResolvedValueOnce([]);

    render(<FolderPage />);

    await waitFor(() => expect(getNotesByFolder).toHaveBeenCalledWith('1'));

    expect(screen.getByText('Belum ada catatan di folder ini.')).toBeInTheDocument();
  });

  it('should call handleDeleteNote and delete the note when confirmed', async () => {
    render(<FolderPage />);

    const deleteButton = screen.getAllByText('Hapus')[0];
    fireEvent.click(deleteButton);

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Yakin hapus catatan?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, hapus',
        cancelButtonText: 'Batal',
      })
    );

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Catatan berhasil dihapus!',
          icon: 'success',
        })
      );
    });

    expect(getNotesByFolder).toHaveBeenCalledTimes(2); 
  });

  it('should handle back navigation', () => {
    render(<FolderPage />);

    const backButton = screen.getByText('← Kembali ke Folder');
    fireEvent.click(backButton);

    expect(window.location.pathname).toBe('/home');
  });
});
