import { notFound } from 'next/navigation';

export default function CatchAllPage({ params }: { params: { slug: string[] } }) {
    // This will trigger the not-found.tsx page instead of Pages Router error handling
    notFound();
}