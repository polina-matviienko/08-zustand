import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/api";
import NotesClient from "./Notes.client";
import { NoteTag } from "@/types/note";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export default async function NotesPage({ params }: Props) {
  const { slug } = await params;

  const category = (slug[0] === "all" ? undefined : slug[0]) as
    | NoteTag
    | undefined;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", 12, category],
    queryFn: () => fetchNotes(1, "", 12, category),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient key={category ?? "all"} category={category} />
    </HydrationBoundary>
  );
}
