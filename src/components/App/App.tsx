import css from './App.module.css';
import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';

import { fetchNotes, createNote, deleteNote } from '../../services/noteService';
import type { NoteTag } from '../../types/note';

import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteList from '../NoteList/NoteList';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';

const NOTES_PER_PAGE = 12;

export default function App() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);


  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);


  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', currentPage, debouncedSearchQuery],
    queryFn: () => fetchNotes({ page: currentPage, perPage: NOTES_PER_PAGE, search: debouncedSearchQuery }),
    staleTime: 5000,
  });

 
  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      toast.success('Note created successfully!');
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setShowModal(false);
    },
    onError: (error) => {
      toast.error(`Error creating note: ${error.message}`);
    },
  });


  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      toast.success('Note deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (error) => {
      toast.error(`Error deleting note: ${error.message}`);
    },
  });

  const notes = data?.results || [];
  const totalPages = data?.totalPages || 0;

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleCreateNote = (values: { title: string; content: string; tag: NoteTag }) => {
    createNoteMutation.mutate(values);
  };

  const handleDeleteNote = (id: string) => {
    deleteNoteMutation.mutate(id);
  };

  return (
    <div className={css.app}>
      <Toaster position="top-right" />
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />
        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            onPageChange={handlePageChange}
            currentPage={currentPage}
          />
        )}
        <button className={css.createButton} onClick={() => setShowModal(true)}>
          Create note +
        </button>
      </header>
      
      {!isLoading && !isError && notes.length > 0 && (
        <NoteList notes={notes} onDelete={handleDeleteNote} />
      )}
      
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <NoteForm onCancel={() => setShowModal(false)} onSubmit={handleCreateNote} />
        </Modal>
      )}
    </div>
  );
}
