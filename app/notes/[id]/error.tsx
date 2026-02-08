'use client';

export default function Error({ message }: { message: string }) {
    return <p>Could not fetch note details. {message}</p>;
}


