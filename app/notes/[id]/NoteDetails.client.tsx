'use client';
import type { Note } from "@/types/note";
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/api';
import css from './NoteDetails.module.css';
import Error from "./error";

export default function NoteDetailsClient() {
    const params = useParams();
    const idParam = params.id;

    if (!idParam) return <p>Note ID is missing</p>;

    // Беремо рядок, якщо це масив — перший елемент
    const id = Array.isArray(idParam) ? idParam[0] : idParam;

    const { data: note, isLoading, error } = useQuery({
        queryKey: ['note', id],
        queryFn: () => fetchNoteById(id),
        enabled: !!id,
    });

    if (isLoading) return <p>Loading, please wait...</p>;
    if (error || !note)
        return (
            <Error message={error instanceof Error ? error.message : "Note not found"} />
        );

    return (
        <div className={css.container}>
            <div className={css.item}>
                <div className={css.header}>
                    <h2>{note.title}</h2>
                </div>
                <p className={css.tag}>{note.tag}</p>
                <p className={css.content}>{note.content}</p>
                <p className={css.date}>{new Date(note.createdAt).toLocaleString()}</p>
            </div>
        </div>
    );
}