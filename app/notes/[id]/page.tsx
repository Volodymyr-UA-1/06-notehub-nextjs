import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/api';
import NotesClient from '../Notes.client';

type NotesPageProps = {
    searchParams: Promise<{
        search?: string;
        page?: string;
    }>;
};

export default async function NotesPage({ searchParams }: NotesPageProps) {
    const params = await searchParams;
    const search = params.search ?? '';
    const currentPage = Number(params.page ?? '1');

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['notes', search, currentPage],
        queryFn: () => fetchNotes({ search, page: currentPage, perPage: 12 }),
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <NotesClient search={search} currentPage={currentPage} />
        </HydrationBoundary>
    );
}