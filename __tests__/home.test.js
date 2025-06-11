import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../src/pages/home'; 
import * as folderService from '../src/lib/folderService';
import Swal from 'sweetalert2';

// Mock service dan SweetAlert2
jest.mock('../src/lib/folderService');
jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));

describe('Home Page', () => {
  const mockUsername = 'testUser';

  beforeEach(() => {
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => mockUsername),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });

    // Mock data
    folderService.getAllFolders.mockResolvedValue([
      { id: '1', name: 'Folder 1' },
      { id: '2', name: 'Folder 2' },
    ]);
    folderService.addFolder.mockResolvedValue();
    folderService.updateFolder.mockResolvedValue();
    folderService.deleteFolder.mockResolvedValue();

    // Reset Swal
    Swal.fire.mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('menampilkan daftar folder setelah load', async () => {
    render(<Home />);
    expect(await screen.findByText('Folder 1')).toBeInTheDocument();
    expect(screen.getByText('Folder 2')).toBeInTheDocument();
  });

  it('menampilkan pesan jika tidak ada folder', async () => {
    folderService.getAllFolders.mockResolvedValueOnce([]);
    render(<Home />);
    expect(await screen.findByText('Belum ada folder.')).toBeInTheDocument();
  });

  it('bisa menambah folder baru', async () => {
    render(<Home />);
    const input = screen.getByPlaceholderText('Tambah Folder Baru');
    const button = screen.getByText('Tambah Folder');

    fireEvent.change(input, { target: { value: 'Folder Baru' } });
    fireEvent.click(button);

    await waitFor(() => expect(folderService.addFolder).toHaveBeenCalledWith(mockUsername, 'Folder Baru'));
    // Biasanya akan reload folder, jadi getAllFolders dipanggil lagi.
    expect(folderService.getAllFolders).toHaveBeenCalled();
  });

  it('bisa mengedit folder', async () => {
    render(<Home />);
    // Tunggu render folder
    await screen.findByText('Folder 1');
    fireEvent.click(screen.getAllByText('Edit')[0]);

    const editInput = screen.getByDisplayValue('Folder 1');
    fireEvent.change(editInput, { target: { value: 'Folder Updated' } });

    fireEvent.click(screen.getByText('Simpan'));
    await waitFor(() =>
      expect(folderService.updateFolder).toHaveBeenCalledWith('1', 'Folder Updated')
    );
    expect(folderService.getAllFolders).toHaveBeenCalled();
  });

  it('bisa membatalkan edit folder', async () => {
    render(<Home />);
    await screen.findByText('Folder 1');
    fireEvent.click(screen.getAllByText('Edit')[0]);
    fireEvent.click(screen.getByText('Batal'));
    // Pastikan kembali ke tampilan awal (edit mode hilang)
    expect(screen.queryByText('Simpan')).not.toBeInTheDocument();
  });

  it('bisa menghapus folder dengan konfirmasi', async () => {
    Swal.fire.mockResolvedValueOnce({ isConfirmed: true }); // Confirm hapus
    render(<Home />);
    await screen.findByText('Folder 1');
    fireEvent.click(screen.getAllByText('Hapus')[0]);
    await waitFor(() =>
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Yakin hapus folder?' })
      )
    );
    await waitFor(() => expect(folderService.deleteFolder).toHaveBeenCalledWith('1'));
    expect(folderService.getAllFolders).toHaveBeenCalled();
  });

  it('tidak menghapus folder jika konfirmasi dibatalkan', async () => {
    Swal.fire.mockResolvedValueOnce({ isConfirmed: false }); // Batal hapus
    render(<Home />);
    await screen.findByText('Folder 1');
    fireEvent.click(screen.getAllByText('Hapus')[0]);
    await waitFor(() =>
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Yakin hapus folder?' })
      )
    );
    expect(folderService.deleteFolder).not.toHaveBeenCalled();
  });

  it('navigasi link utama tampil di halaman', async () => {
    render(<Home />);
    expect(screen.getByText('🏠 Home')).toBeInTheDocument();
    expect(screen.getByText('➕ Tambah')).toBeInTheDocument();
    expect(screen.getByText('📋 Daftar')).toBeInTheDocument();
    expect(screen.getByText('ℹ️ Tentang')).toBeInTheDocument();
  });

  it('link nama folder mengarah ke halaman detail folder', async () => {
    render(<Home />);
    const folderLink = await screen.findByText('Folder 1');
    expect(folderLink.closest('a')).toHaveAttribute('href', '/folder?id=1');
  });
});
