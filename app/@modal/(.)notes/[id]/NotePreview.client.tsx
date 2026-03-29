"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { fetchNoteById } from "@/lib/api/api";
import Modal from "@/components/Modal/Modal";
import css from "./NotePreview.module.css";

export default function NotePreviewClient() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const handleClose = () => {
    router.back();
  };

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
    refetchOnMount: false,
  });

  if (isLoading) return null;
  if (isError || !note) return null;

  return (
    <Modal onClose={handleClose}>
      <div className={css.item}>
        <button type="button" className={css.backBtn} onClick={handleClose}>
          ← Back
        </button>

        <div className={css.header}>
          <h2>{note.title}</h2>
          <span className={css.tag}>{note.tag}</span>
        </div>

        <p className={css.content}>{note.content}</p>

        <p className={css.date}>
          {new Date(note.createdAt).toLocaleString("uk-UA", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </Modal>
  );
}
