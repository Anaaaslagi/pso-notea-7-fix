import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NoteDetail from '../src/pages/note-detail'; // Pastikan path ini sesuai dengan struktur project kamu
import { getAllFolders } from '../src/lib/folderService';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: { id: '1' },
    push: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

jest.mock('../src/lib/folderService');
jest.mock('firebase/firestore');
jest.mock('sweetalert2');

describe('NoteDetail', () => {
  const mockNote = {
    id: '1',
    title: 'Test Note',
    content: 'Test content',
    folderId: 'folder1',
  };

  beforeEach(() => {
    getAllFolders.mockResolvedValue([{ id: 'folder1', name: 'Test Folder' }]);
    getDoc.mockResolvedValue({
      exists: () => true,
      id: '1',
      data: () => mockNote,
    });
    updateDoc.mockResolvedValue({});
    Swal.fire = jest.fn();

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'testUser'),
      },
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', async () => {
    getDoc.mockImplementation(() => new Promise(() => {}));
    render(<NoteDetail />);
    expect(await screen.findByText('Memuat catatan...')).toBeInTheDocument();
  });

  it('should fetch and render note details after loading', async () => {
    render(<NoteDetail />);
    expect(await screen.findByText('Test Note')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();

    // Cari parent <div> atau <div class="mb-2"> yang mengandung "Folder:"
    const folderDiv = screen.getByText(/Folder:/).parentElement;
    expect(folderDiv).toHaveTextContent('Folder: Test Folder');
  });

  it('should display error message if note not found', async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => false,
    });
    render(<NoteDetail />);
    expect(await screen.findByText('Catatan tidak ditemukan.')).toBeInTheDocument();
    expect(screen.getByText('Kembali ke Beranda')).toBeInTheDocument();
  });

  // it('should allow editing a note', async () => {
  //   render(<NoteDetail />);
  //   await screen.findByText('Test Note');
  //   fireEvent.click(screen.getByText('Edit'));

  //   // Pastikan select sudah ada dan label terhubung ke select
  //   const titleInput = screen.getByPlaceholderText('Judul catatan');
  //   const contentTextarea = screen.getByPlaceholderText('Isi catatan');
  //   const folderSelect = screen.getByLabelText('Pindahkan ke Folder');

  //   fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
  //   fireEvent.change(contentTextarea, { target: { value: 'Updated content' } });
  //   fireEvent.change(folderSelect, { target: { value: 'folder1' } });

  //   fireEvent.click(screen.getByText('Simpan'));

  //   await waitFor(() => {
  //     expect(Swal.fire).toHaveBeenCalledWith('Catatan berhasil diupdate!', '', 'success');
  //   });

  //   expect(updateDoc).toHaveBeenCalledWith(doc(expect.any(Object), 'notes', '1'), {
  //     title: 'Updated Title',
  //     content: 'Updated content',
  //     folderId: 'folder1',
  //   });
  // });

  it('should show warning if title or content is empty when saving', async () => {
    render(<NoteDetail />);
    await screen.findByText('Test Note');
    fireEvent.click(screen.getByText('Edit'));

    const titleInput = screen.getByPlaceholderText('Judul catatan');
    const contentTextarea = screen.getByPlaceholderText('Isi catatan');

    fireEvent.change(titleInput, { target: { value: '' } });
    fireEvent.change(contentTextarea, { target: { value: '' } });

    fireEvent.click(screen.getByText('Simpan'));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith('Judul dan isi tidak boleh kosong!', '', 'warning');
    });
  });

  it('should show error if updateDoc fails', async () => {
    updateDoc.mockRejectedValueOnce(new Error('Network error'));
    render(<NoteDetail />);
    await screen.findByText('Test Note');
    fireEvent.click(screen.getByText('Edit'));
    fireEvent.change(screen.getByPlaceholderText('Judul catatan'), { target: { value: 'T' } });
    fireEvent.change(screen.getByPlaceholderText('Isi catatan'), { target: { value: 'C' } });

    fireEvent.click(screen.getByText('Simpan'));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith('Gagal mengupdate catatan', 'Network error', 'error');
    });
  });

  it('should allow cancel editing a note', async () => {
    render(<NoteDetail />);
    await screen.findByText('Test Note');
    fireEvent.click(screen.getByText('Edit'));
    fireEvent.click(screen.getByText('Batal'));
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  // it('should handle switching folder to "Tanpa Folder"', async () => {
  //   render(<NoteDetail />);
  //   await screen.findByText('Test Note');
  //   fireEvent.click(screen.getByText('Edit'));
  //   const folderSelect = screen.getByLabelText('Pindahkan ke Folder');
  //   fireEvent.change(folderSelect, { target: { value: '' } }); // Set ke tanpa folder

  //   fireEvent.click(screen.getByText('Simpan'));

  //   await waitFor(() => {
  //     expect(updateDoc).toHaveBeenCalledWith(doc(expect.any(Object), 'notes', '1'), {
  //       title: 'Test Note',
  //       content: 'Test content',
  //       folderId: null,
  //     });
  //   });
  // });

  it('should show "Tanpa Folder" if folderId not found in folders', async () => {
    getAllFolders.mockResolvedValueOnce([]);
    render(<NoteDetail />);
    await screen.findByText('Test Note');
    // Langsung cek text, tidak perlu parent
    expect(screen.getByText('Tanpa Folder')).toBeInTheDocument();
  });
});
