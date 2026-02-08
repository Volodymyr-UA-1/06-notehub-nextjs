'use client';

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { fetchNotes } from "@/lib/api/api";
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/NoteModal/NoteModal';
import NoteForm from "@/components/NoteForm/NoteForm";
import css from './NotesPage.module.css';
import EmptyState from "@/components/EmptyState/EmptyState";

const perPage = 12;

export default function NotesClient() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [debouncedSearch] = useDebounce(search, 500);

    const { data, isLoading, isError, isFetching } = useQuery({
        queryKey: ["notes", debouncedSearch, page],
        queryFn: () => fetchNotes({ search: debouncedSearch, page, perPage }),
        initialData: { notes: [], totalPages: 0 },
        placeholderData: (previousData) => previousData,
    });

    // ===== ОБРОБНИКИ =====
    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1); // Скидаємо на 1-шу сторінку при новому пошуку
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= data.totalPages) {
            setPage(newPage);
        }
    };

    // ===== РЕНДЕР =====
    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox onSearch={handleSearch} />

                {data.totalPages > 1 && (
                    <Pagination
                        page={page}
                        totalPages={data.totalPages}
                        onPageChange={handlePageChange}
                    />
                )}

                <button
                    className={css.button}
                    onClick={() => setIsModalOpen(true)}
                >
                    Create note +
                </button>
            </header>

            {/* Список нотаток або порожній стан */}
            {data.notes.length > 0 ? (
                <>
                    <NoteList notes={data.notes} />
                    {/* Маленький індикатор завантаження при переході між сторінками */}
                    {isFetching && <div className={css.fetchingLoader}>Updating...</div>}
                </>
            ) : (
                !isLoading && !isError && (
                    <EmptyState
                        message={debouncedSearch ? "No notes matches your search" : "No notes yet"}
                    />
                )
            )}

            {/* Модальне вікно для створення */}
            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <NoteForm onCancel={() => setIsModalOpen(false)} />
                </Modal>
            )}
        </div>
    );
}