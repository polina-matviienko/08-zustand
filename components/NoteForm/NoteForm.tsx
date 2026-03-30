"use client";

import { useId, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";

import { createNote } from "@/lib/api/api";
import { noteTags, type NoteTag } from "@/types/note";
import { useNoteDraftStore } from "@/lib/store/noteStore";
import css from "./NoteForm.module.css";

const Schema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Too short")
    .max(50, "Too long")
    .required("Required"),
  content: Yup.string().max(500, "Too long"),
  tag: Yup.string().oneOf(noteTags).required("Required"),
});

type NoteFormErrors = Partial<Record<"title" | "content" | "tag", string>>;

export default function NoteForm() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const id = useId();

  const [mounted, setMounted] = useState(false);
  const [errors, setErrors] = useState<NoteFormErrors>({});

  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      router.back();
    },
  });

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setDraft({
      ...draft,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (formData: FormData) => {
    const values = {
      title: (formData.get("title") as string).trim(),
      content: (formData.get("content") as string).trim(),
      tag: formData.get("tag") as NoteTag,
    };

    try {
      const validatedValues = await Schema.validate(values, {
        abortEarly: false,
      });
      setErrors({});

      mutate({
        title: validatedValues.title,
        content: validatedValues.content ?? "",
        tag: validatedValues.tag as NoteTag,
      });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const nextErrors: NoteFormErrors = {};
        error.inner.forEach((err) => {
          if (err.path)
            nextErrors[err.path as keyof NoteFormErrors] = err.message;
        });
        setErrors(nextErrors);
      }
    }
  };

  if (!mounted) return null;

  return (
    <form className={css.form} noValidate>
      <div className={css.formGroup}>
        <label htmlFor={`${id}-title`}>Title</label>
        <input
          id={`${id}-title`}
          name="title"
          type="text"
          className={css.input}
          value={draft.title}
          onChange={handleChange}
        />
        {errors.title && <span className={css.error}>{errors.title}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${id}-content`}>Content</label>
        <textarea
          id={`${id}-content`}
          name="content"
          rows={5}
          className={css.textarea}
          value={draft.content}
          onChange={handleChange}
        />
        {errors.content && <span className={css.error}>{errors.content}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${id}-tag`}>Tag</label>
        <select
          id={`${id}-tag`}
          name="tag"
          className={css.select}
          value={draft.tag}
          onChange={handleChange}
        >
          {noteTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        {errors.tag && <span className={css.error}>{errors.tag}</span>}
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={isPending}
          formAction={handleSubmit}
        >
          {isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}
