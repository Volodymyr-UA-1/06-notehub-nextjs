'use client';

interface ErrorProps {
    error: Error;
    reset: () => void;
}

export default function NotesError({ error, reset }: ErrorProps) {
    return (
        <div>
            <h2>Something went wrong while loading notes</h2>
            <p>{error.message}</p>
            <button onClick={reset}>Try again</button>
        </div>
    );
}

