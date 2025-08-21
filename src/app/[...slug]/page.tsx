import { notFound } from 'next/navigation';

export default async function CatchAllPage({ params }: { params: Promise<{ slug: string[] }> }) {
    // Don't interfere with dashboard routes
    const resolvedParams = await params;
    if (resolvedParams.slug[0] === 'dashboard') {
        // Let the dashboard layout handle this
        return null;
    }

    // This will trigger the not-found.tsx page for truly undefined routes
    notFound();
}