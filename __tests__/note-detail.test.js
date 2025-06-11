import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NoteDetail from '../src/pages/note-detail'; // Sesuaikan path dengan struktur folder Anda
import { getAllFolders } from '../src/lib/folderService'; // Pastikan path sesuai dengan struktur proyek Anda
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';

// Mocking
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
      data: () => mockNote,
    });
    updateDoc.mockResolvedValue({});
    Swal.fire = jest.fn(); // Mock Swal
    // Mock localStorage untuk simulasi `username`
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'testUser'),
      },
      writable: true,
    });
  });

  it('should render loading state initially', () => {
    render(<NoteDetail />);
    expect(screen.getByText('Memuat catatan...')).toBeInTheDocument();
  });

  it('should fetch and render note details after loading', async () => {
    render(<NoteDetail />);
    
    await waitFor(() => expect(screen.getByText('Test Note')).toBeInTheDocument());
    expect(screen.getByText('Test content')).toBeInTheDocument();
    expect(screen.getByText('Folder: Test Folder')).toBeInTheDocument();
  });

  it('should display error message if note not found', async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => false,
    });
    
    render(<NoteDetail />);
    
    await waitFor(() => expect(screen.getByText('Catatan tidak ditemukan.')).toBeInTheDocument());
    expect(screen.getByText('Kembali ke Beranda')).toBeInTheDocument();
  });

  it('should allow editing a note', async () => {
    render(<NoteDetail />);

    await waitFor(() => expect(screen.getByText('Test Note')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Edit'));

    // Edit Mode
    const titleInput = screen.getByPlaceholderText('Judul catatan');
    const contentTextarea = screen.getByPlaceholderText('Isi catatan');
    const folderSelect = screen.getByLabelText('Pindahkan ke Folder');

    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
    fireEvent.change(contentTextarea, { target: { value: 'Updated content' } });
    fireEvent.change(folderSelect, { target: { value: 'folder1' } });

    fireEvent.click(screen.getByText('Simpan'));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith('Catatan berhasil diupdate!', '', 'success');
    });

    expect(updateDoc).toHaveBeenCalledWith(doc(expect.any(Object), 'notes', '1'), {
      title: 'Updated Title',
      content: 'Updated content',
      folderId: 'folder1',
    });
  });

  it('should show warning if title or content is empty when saving', async () => {
    render(<NoteDetail />);

    await waitFor(() => expect(screen.getByText('Test Note')).toBeInTheDocument());

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
});
