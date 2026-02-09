import { QueryClient, dehydrate } from '@tanstack/react-query';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import NotesClient from './Notes.client';
import { fetchNotes } from '@/lib/api';

interface NotesPageProps {
    searchParams: { search?: string; page?: string };
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
    const search = searchParams.search ?? '';
    const currentPage = Number(searchParams.page ?? '1');

    const queryClient = new QueryClient();

    // prefetch на сервері
    await queryClient.prefetchQuery({
        queryKey: ['notes', search, currentPage],
        queryFn: () => fetchNotes({ search, page: currentPage, perPage: 12 }),
    });

    // передаємо гідратовані дані у TanStackProvider
    return (
        <TanStackProvider dehydratedState={dehydrate(queryClient)}>
            <NotesClient search={search} currentPage={currentPage} />
        </TanStackProvider>
    );
}