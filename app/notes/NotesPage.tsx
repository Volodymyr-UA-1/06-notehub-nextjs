export default async function NotesPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string; page?: string }>;
}) {
    const { search = "", page = "1" } = await searchParams;
    const currentPage = Number(page);

    // Тут ми будемо робити prefetch...
}