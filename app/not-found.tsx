import { Metadata } from "next";
import css from "./Home.module.css";

export const metadata: Metadata = {
  title: "NoteHub: Page Not Found",
  description: "Sorry, but the page you are looking for does not exist.",
  openGraph: {
    title: "NoteHub: Page Not Found",
    description: "The requested page was not found in NoteHub application.",
    url: "08-zustand-five-psi.vercel.app/not-found",
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

export default function NotFound() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>404 - Page not found</h1>
        <p className={css.description}>
          Sorry, the page you are looking for does not exist.
        </p>
      </div>
    </main>
  );
}
