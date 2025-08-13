import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import css from './App.module.css';

import { fetchNotes } from '../../services/noteService';

import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteList from '../NoteList/NoteList';
import NoteForm from '../NoteForm/NoteForm';
import Modal from '../Modal/Modal';

const NOTES_PER_PAGE = 12;

export default function App() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);

 
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

 
  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', currentPage, debouncedSearchQuery],
    queryFn: () => fetchNotes({ page: currentPage, perPage: NOTES_PER_PAGE, search: debouncedSearchQuery }),
    placeholderData: (previousData) => previousData,
    staleTime: 5000,
  });

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 0;

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
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
      
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error fetching notes.</p>}

      {!isLoading && !isError && notes.length > 0 && (
        <NoteList notes={notes} />
      )}
      
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <NoteForm onCancel={() => setShowModal(false)} />
        </Modal>
      )}
    </div>
  );
}
