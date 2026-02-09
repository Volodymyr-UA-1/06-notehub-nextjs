
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import NoteDetailsClient from './NoteDetails.client'; // Переконайтеся, що шлях правильний

type NotePageProps = {
    params: Promise<{ id: string }>; // Використовуємо params, як просив викладач
};

export default async function NotePage({ params }: NotePageProps) {
    // 1. Отримуємо id через await 
    const { id } = await params;

    const queryClient = new QueryClient();

    // 2. Префетчимо саме одну нотатку за ID 
    await queryClient.prefetchQuery({
        queryKey: ['note', id],
        queryFn: () => fetchNoteById(id),
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            {/* 3. Передаємо id в правильний клієнтський компонент */}
            <NoteDetailsClient id={id} />
        </HydrationBoundary>
    );
}