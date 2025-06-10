import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../src/pages/home';
import * as noteService from '../src/lib/noteService';

// mock semua fungsi yang digunakan dari noteService
jest.mock('../src/lib/noteService', () => ({
  getAllNotes: jest.fn(),
  addNote: jest.fn(),
  updateNote: jest.fn(),
  deleteNote: jest.fn(),
}));

describe('Home Page', () => {
  // reset mocks setiap test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty state if no notes', async () => {
    // tidak ada catatan
    noteService.getAllNotes.mockResolvedValueOnce([]);

    render(<Home />);
    expect(await screen.findByText('Belum ada catatan.')).toBeInTheDocument();
  });

  it('should show notes if data exists', async () => {
    // ada catatan
    noteService.getAllNotes.mockResolvedValueOnce([
      { id: '1', title: 'Note 1', content: 'Isi 1' }
    ]);

    render(<Home />);

    // tunggu catatan tampil
    expect(await screen.findByText('Note 1')).toBeInTheDocument();
    expect(screen.getByText('Isi 1')).toBeInTheDocument();
  });

  it('should show alert if title or content is empty on submit', async () => {
    // mock alert
    window.alert = jest.fn();

    render(<Home />);
    
    // submit tanpa input
    fireEvent.click(screen.getByRole('button', { name: /tambah/i }));
    
    expect(window.alert).toHaveBeenCalledWith('Judul dan isi catatan tidak boleh kosong.');
  });

  it('should add note when form is submitted with title and content', async () => {
    noteService.getAllNotes.mockResolvedValue([]); // untuk reload
    noteService.addNote.mockResolvedValueOnce();

    render(<Home />);

    // isi form
    fireEvent.change(screen.getByPlaceholderText('Judul'), { target: { value: 'Baru' } });
    fireEvent.change(screen.getByPlaceholderText('Isi Catatan'), { target: { value: 'Konten baru' } });
    fireEvent.click(screen.getByRole('button', { name: /tambah/i }));

    await waitFor(() => {
      expect(noteService.addNote).toHaveBeenCalledWith('Baru', 'Konten baru');
    });
  });

  it('should call deleteNote when delete button is clicked', async () => {
    noteService.getAllNotes.mockResolvedValueOnce([
      { id: '1', title: 'Hapus Ini', content: 'Konten' }
    ]);
    noteService.deleteNote.mockResolvedValueOnce();
    noteService.getAllNotes.mockResolvedValueOnce([]); // reload

    render(<Home />);

    expect(await screen.findByText('Hapus Ini')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /hapus/i }));

    await waitFor(() => {
      expect(noteService.deleteNote).toHaveBeenCalledWith('1');
    });
  });

  it('should enter edit mode and populate input', async () => {
    const mockNote = { id: '1', title: 'Judul Lama', content: 'Isi Lama' };
    noteService.getAllNotes.mockResolvedValueOnce([mockNote]);

    render(<Home />);
    
    expect(await screen.findByText('Judul Lama')).toBeInTheDocument();

    //  klik edit
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    // validasi input terisi dengan data lama
    expect(screen.getByDisplayValue('Judul Lama')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Isi Lama')).toBeInTheDocument();
  });
});