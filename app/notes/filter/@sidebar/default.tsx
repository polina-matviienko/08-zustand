import css from "./SidebarNotes.module.css";
import Link from "next/link";
import { noteTags } from "@/types/note";

export default async function SidebarNotes() {
  return (
    <ul className={css.menuList}>
      <li className={css.menuItem}>
        <Link href={`/notes/filter/all`} className={css.menuLink}>
          All notes
        </Link>
      </li>
      {noteTags.map((noteTag) => (
        <li className={css.menuItem} key={noteTag}>
          <Link href={`/notes/filter/${noteTag}`} className={css.menuLink}>
            {noteTag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
