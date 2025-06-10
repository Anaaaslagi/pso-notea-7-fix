import { render, screen, waitFor } from '@testing-library/react';
import ListPage from '../src/pages/list';
import * as noteService from '../src/lib/noteService';

// mock getAllNotes dari noteService
jest.mock('../src/lib/noteService', () => ({
  getAllNotes: jest.fn(),
}));

describe('ListPage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render message if no notes exist', async () => {
    // coba submit kosongan
    noteService.getAllNotes.mockResolvedValueOnce([]);

    render(<ListPage />);

    // cek alert kalo submit keadaan kosong
    expect(await screen.findByText('Tidak ada catatan yang tersedia.')).toBeInTheDocument();
  });

  it('should render all notes if data exists', async () => {
    // buat data catatan
    const notes = [
      { id: '1', title: 'Catatan A', content: 'Isi A' },
      { id: '2', title: 'Catatan B', content: 'Isi B' },
    ];
    noteService.getAllNotes.mockResolvedValueOnce(notes);

    render(<ListPage />);

    // cek semua catatan tampil
    for (const note of notes) {
      expect(await screen.findByText(note.title)).toBeInTheDocument();
      expect(screen.getByText(note.content)).toBeInTheDocument();
    }
  });

  it('should render navigation links correctly', () => {
    noteService.getAllNotes.mockResolvedValueOnce([]);

    render(<ListPage />);

    // buat cek link navigasi muncul
    expect(screen.getByText(/🏠 Home/i)).toBeInTheDocument();
    expect(screen.getByText(/📋 Daftar Catatan/i)).toBeInTheDocument();
    expect(screen.getByText(/➕ Tambah/i)).toBeInTheDocument();
    expect(screen.getByText(/ℹ️ Tentang/i)).toBeInTheDocument();
  });
});
