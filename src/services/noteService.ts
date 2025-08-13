import axios from 'axios';
import type { FetchNotesResponse } from '../types/note';
import type { Note } from '../types/note';


const NOTEHUB_TOKEN = import.meta.env.VITE_NOTENEXT_PUBLIC_NOTEHUB_TOKEN;

const BASE_URL = 'https://notehub-public.goit.study/api';

if (!NOTEHUB_TOKEN) {
  throw new Error("NOTEHUB token is not set. Please add VITE_NOTEHUB_TOKEN to your .env file.");
}

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${NOTEHUB_TOKEN}`,
  },
});

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export const fetchNotes = async ({ page, perPage, search }: FetchNotesParams): Promise<FetchNotesResponse> => {
  const params: { page: number; perPage: number; search?: string } = {
    page,
    perPage,
  };
  if (search) {
    params.search = search;
  }
  const response = await axiosInstance.get<FetchNotesResponse>('/notes', { params });
  return response.data;
};

interface CreateNoteParams {
  title: string;
  content: string;
  tag: Note['tag'];
}

export const createNote = async (newNote: CreateNoteParams): Promise<Note> => {
  const response = await axiosInstance.post<Note>('/notes', newNote);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axiosInstance.delete<Note>(`/notes/${id}`);
  return response.data;
};
