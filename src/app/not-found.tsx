import { unstable_noStore as noStore } from 'next/cache';
import { Suspense } from 'react';

function NotFoundContent() {
    // Prevent static generation
    noStore();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full text-center">
                <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                    Page Not Found
                </h1>
                <p className="text-gray-600 mb-6">
                    The page you're looking for doesn't exist.
                </p>
                <a
                    href="/"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    Go back home
                </a>
            </div>
        </div>
    );
}

export default function NotFound() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <NotFoundContent />
        </Suspense>
    );
}