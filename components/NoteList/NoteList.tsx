import css from "./NoteList.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/lib/api/api";
import { useState } from "react";
import type { Note } from "../../types/note";
import Link from "next/link";

interface NoteListProps {
    notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
    const queryClient = useQueryClient();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const { mutate } = useMutation({
        mutationFn: deleteNote,
        onMutate: (id: string) => {
            setDeletingId(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) =>
                    Array.isArray(query.queryKey) &&
                    query.queryKey[0] === "notes",
            });
        },
        onSettled: () => {
            setDeletingId(null);
        },
    });

    if (notes.length === 0) {
        return <p className={css.empty}>No notes found</p>;
    }

    return (
        <ul className={css.list}>
            {notes.map((note) => {
                const isDeleting = deletingId === note.id;

                return (
                    <li key={note.id} className={css.listItem}>
                        <h3 className={css.title}>{note.title}</h3>
                        <p className={css.content}>{note.content}</p>

                        <div className={css.footer}>
                            <span className={css.tag}>{note.tag}</span>

                            <div className={css.actions}>
                                {/* Нове посилання для переходу до деталей */}
                                <Link href={`/notes/${note.id}`} className={css.detailsLink}>
                                    View details
                                </Link>

                                <button
                                    className={css.deleteBtn}
                                    onClick={() => mutate(note.id)}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}