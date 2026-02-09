'use client';
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { fetchNotes, FetchNotesResponse } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import EmptyState from "@/components/EmptyState/EmptyState";
import css from "./Notes.module.css";

const perPage = 12;

interface NotesClientProps {
    search: string;
    currentPage: number;
}
export default function NotesClient({ search: initialSearch, currentPage: initialPage }: NotesClientProps) {
    // Використовуємо пропси як початкові значення для useState
    const [search, setSearch] = useState(initialSearch);
    const [page, setPage] = useState(initialPage);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [debouncedSearch] = useDebounce(search, 500);

    const { data, isLoading, isError, isFetching } = useQuery<FetchNotesResponse>({
        queryKey: ["notes", debouncedSearch, page],
        queryFn: () =>
            fetchNotes({
                search: debouncedSearch,
                page,
                perPage,
            }),
        placeholderData: { notes: [], totalPages: 1 },
    });

    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        if (!data) return;
        if (newPage >= 1 && newPage <= data.totalPages) {
            setPage(newPage);
        }
    };

    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox onSearch={handleSearch} />

                {data && data.totalPages > 1 && (
                    <Pagination page={page} totalPages={data.totalPages} onPageChange={handlePageChange} />
                )}

                <button className={css.button} onClick={() => setIsModalOpen(true)}>
                    Create note +
                </button>
            </header>

            {isLoading && <p>Loading...</p>}

            {!isLoading && !isError && data && data.notes.length > 0 && (
                <>
                    <NoteList notes={data.notes} />
                    {isFetching && <div className={css.fetchingLoader}>Updating...</div>}
                </>
            )}

            {!isLoading && !isError && data && data.notes.length === 0 && (
                <EmptyState
                    message={debouncedSearch ? "No notes match your search" : "No notes yet"}
                />
            )}

            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <NoteForm onCancel={() => setIsModalOpen(false)} />
                </Modal>
            )}
        </div>
    );
}