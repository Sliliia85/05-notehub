
export type NoteTag = 'Study' | 'Work' | 'Personal';

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  page: number;
  perPage: number;
  totalNotes: number;
  totalPages: number;
}