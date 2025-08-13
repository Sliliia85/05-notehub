import css from './App.module.css';
import { Formik } from 'formik';
import * as yup from 'yup';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteList from './NoteList/NoteList';
import Modal from '../Modal/Modal';


export default function App() {
  return (
  <div className={css.app}>
          <header className={css.toolbar}>
      <SearchBox />
		<button className={css.button}>Create note +</button>
          </header>
            <NoteList />
		
		<Pagination />
          <Modal />
</div>

  );
}