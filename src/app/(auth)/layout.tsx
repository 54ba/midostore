import { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Store, ArrowLeft } from 'lucide-react';

export default function AuthLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="mb-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Home
                        </Button>
                    </Link>

                    <div className="flex justify-center mb-6">
                        <Link href="/" className="flex items-center space-x-2">
                            <Store className="h-12 w-12 text-blue-600" />
                            <span className="text-2xl font-bold text-gray-900">MidoStore</span>
                        </Link>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900">
                        Welcome to MidoStore
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Join our community of buyers and sellers
                    </p>
                </div>

                {/* Auth Form */}
                <div className="bg-white py-8 px-6 shadow-xl rounded-lg">
                    {children}
                </div>

                {/* Footer */}
                <div className="text-center text-sm text-gray-600">
                    <p>
                        By continuing, you agree to our{' '}
                        <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}