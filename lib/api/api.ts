import axios from "axios";
import { Note, NoteTag } from "../../types/note";

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const noteApi = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
});

noteApi.interceptors.request.use((config) => {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchNotes = async (
  page = 1,
  search = "",
  perPage = 12,
  tag?: string,
): Promise<FetchNotesResponse> => {
  const { data } = await noteApi.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage,
      search,
      tag: tag && tag !== "all" ? tag : undefined,
    },
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await noteApi.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (note: CreateNotePayload): Promise<Note> => {
  const { data } = await noteApi.post<Note>("/notes", note);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await noteApi.delete<Note>(`/notes/${id}`);
  return data;
};
