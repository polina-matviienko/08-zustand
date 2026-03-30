"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import Link from "next/link";

import { fetchNotes } from "@/lib/api/api";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import css from "./NotesPage.module.css";
import { NoteTag } from "@/types/note";

interface NotesClientProps {
  category?: NoteTag;
}

export default function NotesClient({ category }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, debouncedSearch, 12, category],
    queryFn: () => fetchNotes(page, debouncedSearch, 12, category),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className={css.container}>
      <div className={css.toolbar}>
        <SearchBox
          onSearch={(val) => {
            setSearch(val);
            setPage(1);
          }}
        />

        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            onPageChange={(p) => setPage(p)}
            forcePage={page - 1}
          />
        )}

        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </div>

      {isLoading && <p>Loading notes...</p>}
      {isError && <p>Error loading notes. Please try again.</p>}

      {data && data.notes.length > 0 ? (
        <NoteList notes={data.notes} />
      ) : (
        !isLoading && (
          <p className={css.empty}>No notes found in this category.</p>
        )
      )}
    </div>
  );
}
