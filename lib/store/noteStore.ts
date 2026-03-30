import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type CreateNotePayload } from "../api";

type NoteDraftStore = {
  draft: CreateNotePayload;
  setDraft: (updatedDraft: CreateNotePayload) => void;
  clearDraft: () => void;
};

const initialDraft: CreateNotePayload = {
  title: "",
  content: "",
  tag: "Todo",
};

export const useNoteDraftStore = create<NoteDraftStore>()(
  persist(
    (set) => ({
      draft: initialDraft,

      setDraft: (updatedDraft) => set({ draft: updatedDraft }),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "note-draft-storage",
      partialize: (state) => ({ draft: state.draft }),
    },
  ),
);
