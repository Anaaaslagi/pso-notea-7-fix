import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NoteDetail from '../src/pages/note-detail/[id]';
import { getAllFolders } from '../src/lib/folderService';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';

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
  });

  it('should render loading state initially', () => {
    render(<NoteDetail />);
    expect(screen.getByText('Memuat catatan...')).toBeInTheDocument();
  });

  it('should display the note when data is fetched', async () => {
    render(<NoteDetail />);
    
    await waitFor(() => {
      expect(screen.getByText(mockNote.title)).toBeInTheDocument();
      expect(screen.getByText(mockNote.content)).toBeInTheDocument();
      expect(screen.getByText('Test Folder')).toBeInTheDocument();
    });
  });

  it('should show error message if note not found', async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => false,
    });

    render(<NoteDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Catatan tidak ditemukan.')).toBeInTheDocument();
    });
  });

  it('should enter edit mode when Edit button is clicked', async () => {
    render(<NoteDetail />);

    await waitFor(() => {
      fireEvent.click(screen.getByText('Edit'));
    });

    expect(screen.getByPlaceholderText('Judul catatan')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Isi catatan')).toBeInTheDocument();
  });

  it('should update note when Save button is clicked', async () => {
    render(<NoteDetail />);
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Edit'));
    });

    fireEvent.change(screen.getByPlaceholderText('Judul catatan'), { target: { value: 'Updated Title' } });
    fireEvent.change(screen.getByPlaceholderText('Isi catatan'), { target: { value: 'Updated Content' } });
    fireEvent.click(screen.getByText('Simpan'));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith('Catatan berhasil diupdate!', '', 'success');
    });
  });

  it('should show warning if title or content is empty when Save is clicked', async () => {
    render(<NoteDetail />);
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Edit'));
    });

    fireEvent.change(screen.getByPlaceholderText('Judul catatan'), { target: { value: '' } });
    fireEvent.change(screen.getByPlaceholderText('Isi catatan'), { target: { value: '' } });
    fireEvent.click(screen.getByText('Simpan'));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith('Judul dan isi tidak boleh kosong!', '', 'warning');
    });
  });
});
