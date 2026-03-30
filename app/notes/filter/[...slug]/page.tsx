import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import { NoteTag } from "@/types/note";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = slug?.[0] === "all" ? undefined : (slug?.[0] as NoteTag);

  const title = category ? `NoteHub: ${category}` : "NoteHub: All Notes";
  const description = category
    ? `Browse ${category.toLowerCase()} notes in NoteHub.`
    : "Browse all notes in NoteHub.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `08-zustand-five-psi.vercel.app/notes/filter/${slug?.[0] || "all"}`,
      siteName: "NoteHub",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub app",
        },
      ],
    },
  };
}

export default async function NotesPage({ params }: Props) {
  const { slug } = await params;
  const category = slug?.[0] === "all" ? undefined : (slug?.[0] as NoteTag);

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
