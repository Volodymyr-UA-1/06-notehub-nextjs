import {
    QueryClient,
    HydrationBoundary,
    dehydrate,
} from "@tanstack/react-query";

import { fetchNotes } from "@/lib/api/api";
import NotesClient from "./Notes.client";

type NotesPageProps = {
    searchParams: {
        search?: string;
        page?: string;
    };
};

export default async function NotesPage({
    searchParams,
}: NotesPageProps) {
    const search = searchParams.search ?? "";
    const currentPage = Number(searchParams.page ?? "1");

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["notes", search, currentPage],
        queryFn: () =>
            fetchNotes({
                search,
                page: currentPage,
                perPage: 12,
            }),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NotesClient search={search} currentPage={currentPage} />
        </HydrationBoundary>
    );
}