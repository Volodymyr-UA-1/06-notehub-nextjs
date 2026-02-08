import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import { fetchNotes } from "@/lib/api/api";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/NoteModal/NoteModal";
import NoteForm from "@/components/NoteForm/NoteForm";
import EmptyState from "@/components/EmptyState/EmptyState";

import css from "./NotesPage.module.css";

const perPage = 12;

type NotesClientProps = {
    search: string;
    currentPage: number;
};

export default function NotesClient({
    search,
    currentPage,
}: NotesClientProps) {

    // ✅ ЛОКАЛЬНИЙ СТЕЙТ (ініціалізується з props)
    const [searchValue, setSearch] = useState(search);
    const [page, setPage] = useState(currentPage);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ✅ debounce від state
    const [debouncedSearch] = useDebounce(searchValue, 500);

    // ✅ useQuery
    const { data, isLoading, isError, isFetching } = useQuery({
        queryKey: ["notes", debouncedSearch, page],
        queryFn: () =>
            fetchNotes({
                search: debouncedSearch,
                page,
                perPage,
            }),
        placeholderData: (prev) => prev,
    });

    // ===== ОБРОБНИКИ =====
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

    // ===== РЕНДЕР =====
    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox onSearch={handleSearch} />

                {data && data.totalPages > 1 && (
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

            {/* Контент */}
            {isLoading && <p>Loading...</p>}

            {!isLoading && !isError && data && data.notes.length > 0 && (
                <>
                    <NoteList notes={data.notes} />
                    {isFetching && (
                        <div className={css.fetchingLoader}>Updating...</div>
                    )}
                </>
            )}

            {!isLoading && !isError && data && data.notes.length === 0 && (
                <EmptyState
                    message={
                        debouncedSearch
                            ? "No notes match your search"
                            : "No notes yet"
                    }
                />
            )}

            {/* Модалка */}
            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <NoteForm onCancel={() => setIsModalOpen(false)} />
                </Modal>
            )}
        </div>
    );
}