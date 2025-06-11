import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../src/pages/home';
import * as folderService from '../src/lib/folderService';
import * as noteService from '../src/lib/noteService';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';

// Mock dependencies
jest.mock('../src/lib/folderService');
jest.mock('../src/lib/noteService');
jest.mock('sweetalert2');

describe('Home Component', () => {
  const mockUsername = 'testUser';

  beforeEach(() => {
    // Setup mocks
    localStorage.setItem('username', mockUsername);
    folderService.getAllFolders.mockResolvedValue([
      { id: '1', name: 'Folder 1' },
      { id: '2', name: 'Folder 2' },
    ]);
    noteService.getAllNotes.mockResolvedValue([
      { id: '1', title: 'Note 1', content: 'Content 1' },
      { id: '2', title: 'Note 2', content: 'Content 2' },
    ]);
    noteService.getNotesByFolder.mockResolvedValue([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component correctly', async () => {
    render(<Home />);

    // Ensure username is loaded
    expect(screen.getByText(/📒 Catatan Simpel/i)).toBeInTheDocument();
    expect(await screen.findByText('Pilih Folder')).toBeInTheDocument();
    expect(await screen.findByText('Tambah Folder Baru')).toBeInTheDocument();
    expect(await screen.findByText('🏠 Home')).toBeInTheDocument();
  });

  it('should load folders on username set', async () => {
    render(<Home />);

    // Ensure folders are loaded correctly
    await waitFor(() => expect(folderService.getAllFolders).toHaveBeenCalled());
    expect(await screen.findByText('Folder 1')).toBeInTheDocument();
    expect(await screen.findByText('Folder 2')).toBeInTheDocument();
  });

  it('should show all notes when no folder is selected', async () => {
    render(<Home />);

    // Ensure notes are loaded when no folder is selected
    await waitFor(() => expect(noteService.getAllNotes).toHaveBeenCalled());
    expect(await screen.findByText('Note 1')).toBeInTheDocument();
    expect(await screen.findByText('Note 2')).toBeInTheDocument();
  });

  it('should handle folder selection', async () => {
    render(<Home />);

    // Open folder selection modal
    const selectFolderButton = screen.getByText('Pilih Folder');
    fireEvent.click(selectFolderButton);

    // Simulate folder selection
    await waitFor(() => expect(Swal.fire).toHaveBeenCalled());
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });
    fireEvent.click(screen.getByText('Pilih'));

    expect(screen.getByText('Folder 1')).toBeInTheDocument();
  });

  it('should handle folder add', async () => {
    render(<Home />);

    const folderInput = screen.getByPlaceholderText('Tambah Folder Baru');
    const addFolderButton = screen.getByText('Tambah Folder');
    
    fireEvent.change(folderInput, { target: { value: 'New Folder' } });
    fireEvent.click(addFolderButton);
    
    await waitFor(() => expect(folderService.addFolder).toHaveBeenCalled());
    expect(folderService.addFolder).toHaveBeenCalledWith(mockUsername, 'New Folder');
  });

  it('should handle folder delete', async () => {
    render(<Home />);

    const deleteFolderButton = screen.getByText('Hapus Folder');
    fireEvent.click(deleteFolderButton);

    // Ensure confirmation modal appears
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Yakin hapus folder?',
    }));

    Swal.fire.mockResolvedValueOnce({ isConfirmed: true });

    await waitFor(() => expect(folderService.deleteFolder).toHaveBeenCalled());
    expect(folderService.deleteFolder).toHaveBeenCalledWith('1');
  });

  it('should handle note delete', async () => {
    render(<Home />);

    const deleteNoteButton = screen.getByText('Hapus');
    fireEvent.click(deleteNoteButton);

    // Ensure confirmation modal appears
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Yakin hapus catatan?',
    }));

    Swal.fire.mockResolvedValueOnce({ isConfirmed: true });

    await waitFor(() => expect(noteService.deleteNote).toHaveBeenCalled());
    expect(noteService.deleteNote).toHaveBeenCalledWith('1');
  });

  it('should handle note click for detail view', async () => {
    render(<Home />);

    const noteCard = screen.getByText('Note 1');
    fireEvent.click(noteCard);

    expect(window.location.href).toContain('/note-detail/1');
  });

  it('should handle edit folder', async () => {
    render(<Home />);

    const editFolderButton = screen.getByText('Edit Folder');
    fireEvent.click(editFolderButton);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Updated Folder' } });

    const saveButton = screen.getByText('Simpan');
    fireEvent.click(saveButton);

    await waitFor(() => expect(folderService.updateFolder).toHaveBeenCalled());
    expect(folderService.updateFolder).toHaveBeenCalledWith('1', 'Updated Folder');
  });

  it('should display empty state when no notes exist', async () => {
    noteService.getAllNotes.mockResolvedValueOnce([]);

    render(<Home />);

    expect(await screen.findByText('Belum ada catatan.')).toBeInTheDocument();
  });
});
