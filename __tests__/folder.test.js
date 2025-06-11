import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FolderPage from '../src/pages/folder'; 
import { getNotesByFolder, deleteNote } from '../src/lib/noteService';
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
    deleteNote.mockResolvedValue();
    Swal.fire.mockResolvedValue({ isConfirmed: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    // Render dengan loading state
    getFolderById.mockImplementation(() => new Promise(() => {}));
    render(<FolderPage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display folder name and notes', async () => {
    render(<FolderPage />);

    expect(await screen.findByText('📁 Test Folder')).toBeInTheDocument();
    expect(screen.getByText('Note 1')).toBeInTheDocument();
    expect(screen.getByText('Note 2')).toBeInTheDocument();
  });

  it('should show message if there are no notes', async () => {
    getNotesByFolder.mockResolvedValueOnce([]);

    render(<FolderPage />);

    expect(await screen.findByText('Belum ada catatan di folder ini.')).toBeInTheDocument();
  });

  it('should call handleDeleteNote and delete the note when confirmed', async () => {
    render(<FolderPage />);
    await screen.findByText('Note 1');
    const deleteButton = screen.getAllByText('Hapus')[0];
    fireEvent.click(deleteButton);

    await waitFor(() =>
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Yakin hapus catatan?',
          icon: 'warning',
        })
      )
    );

    await waitFor(() => expect(deleteNote).toHaveBeenCalledWith('1'));
    // Cek dialog sukses
    await waitFor(() =>
      expect(Swal.fire).toHaveBeenCalledWith(
        "Catatan berhasil dihapus!", "", "success"
      )
    );
  });

  it('should not call deleteNote if user cancels deletion', async () => {
    Swal.fire.mockResolvedValueOnce({ isConfirmed: false }); // cancel
    render(<FolderPage />);
    await screen.findByText('Note 1');
    const deleteButton = screen.getAllByText('Hapus')[0];
    fireEvent.click(deleteButton);

    await waitFor(() =>
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Yakin hapus catatan?' })
      )
    );

    expect(deleteNote).not.toHaveBeenCalled();
  });

  it('should have edit link for each note', async () => {
    render(<FolderPage />);
    await screen.findByText('Note 1');
    const editLinks = screen.getAllByText('Edit');
    expect(editLinks[0].closest('a')).toHaveAttribute('href', '/note-detail?id=1');
    expect(editLinks[1].closest('a')).toHaveAttribute('href', '/note-detail?id=2');
  });

  it('should display "Folder Tidak Ditemukan" if folder is null', async () => {
    getFolderById.mockResolvedValueOnce(null);
    render(<FolderPage />);
    expect(await screen.findByText('Folder Tidak Ditemukan')).toBeInTheDocument();
  });

  it('should have a link to home', async () => {
    render(<FolderPage />);
    const backLink = screen.getByText('← Kembali ke Home');
    expect(backLink.closest('a')).toHaveAttribute('href', '/home');
  });
});
