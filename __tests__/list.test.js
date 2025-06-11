import { render, screen, waitFor } from '@testing-library/react';
import ListPage from '../src/pages/list';
import * as noteService from '../src/lib/noteService';

jest.mock('../src/lib/noteService', () => ({
  getAllNotes: jest.fn(),
}));

describe('ListPage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render message if no notes exist', async () => {
    noteService.getAllNotes.mockResolvedValueOnce([]);
    render(<ListPage />);
    expect(await screen.findByText('Tidak ada catatan yang tersedia.')).toBeInTheDocument();
  });

  it('should render all notes if data exists', async () => {
    const notes = [
      { id: '1', title: 'Catatan A', content: 'Isi A' },
      { id: '2', title: 'Catatan B', content: 'Isi B' },
    ];
    noteService.getAllNotes.mockResolvedValueOnce(notes);
    render(<ListPage />);

    for (const note of notes) {
      expect(await screen.findByText(note.title)).toBeInTheDocument();
      expect(screen.getByText(note.content)).toBeInTheDocument();
    }
  });

  it('should render navigation links and page title correctly', async () => {
    noteService.getAllNotes.mockResolvedValueOnce([]);
    render(<ListPage />);

    expect(await screen.findByText('🏠 Home')).toBeInTheDocument();
    expect(screen.getByText('➕ Tambah')).toBeInTheDocument();
    expect(screen.getByText('📋 Daftar')).toBeInTheDocument();
    expect(screen.getByText('ℹ️ Tentang')).toBeInTheDocument();

    // Judul halaman
    expect(screen.getByRole('heading', { level: 1, name: '📋 Daftar Semua Catatan' })).toBeInTheDocument();
  });

  it('should link each note to its detail page', async () => {
    const notes = [
      { id: '1', title: 'Catatan A', content: 'Isi A' },
      { id: '2', title: 'Catatan B', content: 'Isi B' },
    ];
    noteService.getAllNotes.mockResolvedValueOnce(notes);
    render(<ListPage />);

    for (const note of notes) {
      // Tunggu link muncul
      const noteLink = await screen.findByText(note.title);
      expect(noteLink.closest('a')).toHaveAttribute('href', `/note-detail?id=${note.id}`);
    }
  });
});
