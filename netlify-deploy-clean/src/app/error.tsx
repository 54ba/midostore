'use client';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full text-center">
                <div className="text-6xl font-bold text-red-300 mb-4">500</div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                    Something went wrong!
                </h1>
                <p className="text-gray-600 mb-6">
                    An error occurred while loading this page.
                </p>
                <div className="space-x-4">
                    <button
                        onClick={reset}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Try again
                    </button>
                    <a
                        href="/"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Go back home
                    </a>
                </div>
            </div>
        </div>
    );
}