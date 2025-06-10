import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../pages/index';
import * as noteService from '../lib/noteService';

jest.mock('../lib/noteService');

describe('📒 Halaman Home - Catatan Simpel', () => {
  const dummyNotes = [
    { id: 1, title: 'Note 1', content: 'Content 1' },
    { id: 2, title: 'Note 2', content: 'Content 2' }
  ];

  beforeEach(() => {
    noteService.getAllNotes.mockResolvedValue(dummyNotes);
    noteService.addNote.mockResolvedValue({});
    noteService.updateNote.mockResolvedValue({});
    noteService.deleteNote.mockResolvedValue({});
  });

  it('menampilkan catatan dari getAllNotes', async () => {
    render(<Home />);
    expect(await screen.findByText('Note 1')).toBeInTheDocument();
    expect(screen.getByText('Note 2')).toBeInTheDocument();
  });

  it('menambah catatan baru saat form disubmit', async () => {
    render(<Home />);

    fireEvent.change(screen.getByPlaceholderText('Judul'), {
      target: { value: 'Catatan Baru' }
    });
    fireEvent.change(screen.getByPlaceholderText('Isi Catatan'), {
      target: { value: 'Isi Baru' }
    });

    fireEvent.click(screen.getByText('Tambah'));

    await waitFor(() => {
      expect(noteService.addNote).toHaveBeenCalledWith('Catatan Baru', 'Isi Baru');
    });
  });

  it('mengupdate catatan saat editId aktif', async () => {
    render(<Home />);
    await screen.findByText('Note 1');
    
    fireEvent.click(screen.getAllByText('Edit')[0]);
    fireEvent.change(screen.getByPlaceholderText('Judul'), {
      target: { value: 'Note 1 Edit' }
    });
    fireEvent.click(screen.getByText('Update'));

    await waitFor(() => {
      expect(noteService.updateNote).toHaveBeenCalledWith(1, {
        title: 'Note 1 Edit',
        content: 'Content 1'
      });
    });
  });

  it('menghapus catatan saat tombol Hapus diklik', async () => {
    render(<Home />);
    await screen.findByText('Note 1');
    fireEvent.click(screen.getAllByText('Hapus')[0]);

    await waitFor(() => {
      expect(noteService.deleteNote).toHaveBeenCalledWith(1);
    });
  });

  it('menampilkan teks jika tidak ada catatan', async () => {
    noteService.getAllNotes.mockResolvedValue([]);
    render(<Home />);
    expect(await screen.findByText('Belum ada catatan.')).toBeInTheDocument();
  });
});
